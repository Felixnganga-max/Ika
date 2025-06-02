import axios from "axios";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

dotenv.config();

const SHORTCODE = process.env.BUSINESS_SHORT_CODE;
const PASSKEY = process.env.PASS_KEY;
const CALLBACK_URL = process.env.CALLBACK_URL;
const DARAJA_BASE_URL = "https://sandbox.safaricom.co.ke";

const getTimestamp = () => {
  const date = new Date();
  return (
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2)
  );
};

const getMpesaPassword = (timestamp) => {
  return Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");
};

/**
 * Place a new order and initiate M-Pesa payment
 */
const placeOrder = async (req, res) => {
  console.log("📥 Received Order Request:", req.body);

  try {
    const userId = req.user.id;
    let { items, amount, address, mobileNumber } = req.body;

    // Validation
    if (!items || !amount || !address || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "❌ Missing required fields",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "❌ Items must be a non-empty array",
      });
    }

    // Ensure amount is a positive integer
    amount = Math.floor(parseFloat(amount));
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid amount. Must be a positive integer.",
      });
    }

    // Format phone number to Kenya format
    mobileNumber = mobileNumber.toString().replace(/^0/, "254");
    if (!/^254\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid phone number format",
      });
    }

    // Validate address object
    if (
      !address.contactName ||
      !address.email ||
      !address.street ||
      !address.town
    ) {
      return res.status(400).json({
        success: false,
        message: "❌ Complete address information required",
      });
    }

    // Create new order with pending payment status
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "Payment Pending",
      payment: false, // Set to false initially
      mobileNumber, // Store mobile number for reference
    });
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Generate M-Pesa token and process payment
    await generateToken(req, res, async () => {
      try {
        const token = req.token;
        const timestamp = getTimestamp();
        const password = getMpesaPassword(timestamp);

        const paymentData = {
          BusinessShortCode: SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: mobileNumber,
          PartyB: SHORTCODE,
          PhoneNumber: mobileNumber,
          CallBackURL: CALLBACK_URL,
          AccountReference: `Order_${newOrder._id.toString()}`,
          TransactionDesc: "Order Payment",
        };

        console.log("📤 Sending M-Pesa STK Push Request:", paymentData);

        const { data } = await axios.post(
          `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Daraja STK Push Response:", data);

        if (data.ResponseCode === "0") {
          // Store STK Push details for tracking
          await orderModel.findByIdAndUpdate(newOrder._id, {
            stkPushDetails: {
              MerchantRequestID: data.MerchantRequestID,
              CheckoutRequestID: data.CheckoutRequestID,
              ResponseCode: data.ResponseCode,
              ResponseDescription: data.ResponseDescription,
              CustomerMessage: data.CustomerMessage,
            },
          });

          return res.json({
            success: true,
            message: "✅ STK Push sent. Complete payment on your phone.",
            MerchantRequestID: data.MerchantRequestID,
            CheckoutRequestID: data.CheckoutRequestID,
            orderId: newOrder._id,
            orderDetails: { totalAmountKES: amount, items },
          });
        } else {
          // Delete the order if payment initiation failed
          await orderModel.findByIdAndDelete(newOrder._id);
          return res.status(400).json({
            success: false,
            message: "❌ STK Push failed. Try again.",
          });
        }
      } catch (error) {
        console.error(
          "❌ Payment Processing Error:",
          error.response?.data || error.message
        );
        // Delete the order if payment processing failed
        await orderModel.findByIdAndDelete(newOrder._id);
        return res.status(500).json({
          success: false,
          message: "Error processing payment request",
        });
      }
    });
  } catch (error) {
    console.error("❌ Order Placement Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error processing order",
    });
  }
};

/**
 * M-Pesa Callback Handler - This is where M-Pesa sends payment confirmations
 */
const mpesaCallback = async (req, res) => {
  console.log(
    "🔔 M-Pesa Callback Received:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const { Body } = req.body;

    if (!Body || !Body.stkCallback) {
      console.log("❌ Invalid callback format");
      return res
        .status(400)
        .json({ success: false, message: "Invalid callback format" });
    }

    const { stkCallback } = Body;
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    console.log(`📊 Payment Result: ${ResultCode} - ${ResultDesc}`);

    // Extract order ID from callback metadata or account reference
    let orderId = null;
    if (CallbackMetadata && CallbackMetadata.Item) {
      const accountRefItem = CallbackMetadata.Item.find(
        (item) => item.Name === "AccountReference"
      );
      if (accountRefItem && accountRefItem.Value) {
        const orderMatch = accountRefItem.Value.match(/Order_([a-f0-9]+)/i);
        if (orderMatch) {
          orderId = orderMatch[1];
        }
      }
    }

    if (!orderId) {
      console.log("❌ Could not extract order ID from callback");
      return res
        .status(400)
        .json({ success: false, message: "Invalid order reference" });
    }

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      console.log(`❌ Order not found: ${orderId}`);
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Process based on payment result
    if (ResultCode === 0) {
      // Payment successful
      const paymentDetails = {};

      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach((item) => {
          switch (item.Name) {
            case "Amount":
              paymentDetails.amount = item.Value;
              break;
            case "MpesaReceiptNumber":
              paymentDetails.mpesaReceiptNumber = item.Value;
              break;
            case "TransactionDate":
              paymentDetails.transactionDate = new Date(item.Value.toString());
              break;
            case "PhoneNumber":
              paymentDetails.phoneNumber = item.Value;
              break;
          }
        });
      }

      // Update order with payment confirmation
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        {
          payment: true,
          status: "Food Processing",
          paymentConfirmation: {
            merchantRequestID: MerchantRequestID,
            checkoutRequestID: CheckoutRequestID,
            resultCode: ResultCode,
            resultDesc: ResultDesc,
            mpesaReceiptNumber: paymentDetails.mpesaReceiptNumber,
            transactionDate: paymentDetails.transactionDate,
            phoneNumber: paymentDetails.phoneNumber,
            amount: paymentDetails.amount,
            confirmedAt: new Date(),
          },
        },
        { new: true }
      );

      console.log(`✅ Payment confirmed for Order ${orderId}:`, {
        receipt: paymentDetails.mpesaReceiptNumber,
        amount: paymentDetails.amount,
        phone: paymentDetails.phoneNumber,
      });

      // You can add additional logic here like:
      // - Send confirmation email to customer
      // - Send notification to admin
      // - Update inventory
      // - Trigger order processing workflow
    } else {
      // Payment failed
      await orderModel.findByIdAndUpdate(orderId, {
        payment: false,
        status: "Payment Failed",
        paymentFailure: {
          merchantRequestID: MerchantRequestID,
          checkoutRequestID: CheckoutRequestID,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          failedAt: new Date(),
        },
      });

      console.log(`❌ Payment failed for Order ${orderId}: ${ResultDesc}`);
    }

    // Always respond with success to M-Pesa
    return res.status(200).json({
      success: true,
      message: "Callback processed successfully",
    });
  } catch (error) {
    console.error("❌ M-Pesa Callback Error:", error.message);
    // Still return success to prevent M-Pesa retries
    return res.status(200).json({
      success: true,
      message: "Callback received",
    });
  }
};

/**
 * Get payment confirmations for admin dashboard
 */
const getPaymentConfirmations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const status = req.query.status;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    let query = { payment: true };

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by date range if provided
    if (dateFrom || dateTo) {
      query["paymentConfirmation.transactionDate"] = {};
      if (dateFrom) {
        query["paymentConfirmation.transactionDate"].$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query["paymentConfirmation.transactionDate"].$lte = new Date(dateTo);
      }
    }

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      orderModel
        .find(query)
        .select(
          "_id amount status address.contactName paymentConfirmation createdAt"
        )
        .sort({ "paymentConfirmation.transactionDate": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      orderModel.countDocuments(query),
    ]);

    // Calculate totals
    const totalAmount = await orderModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return res.json({
      success: true,
      count: orders.length,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalAmount: totalAmount[0]?.total || 0,
      payments: orders,
    });
  } catch (error) {
    console.error("❌ Error Fetching Payment Confirmations:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching payment confirmations",
    });
  }
};

/**
 * Verify M-Pesa payment status
 */
const verifyOrder = async (req, res) => {
  const { CheckoutRequestID } = req.body;

  if (!CheckoutRequestID) {
    return res.status(400).json({
      success: false,
      message: "❌ CheckoutRequestID required",
    });
  }

  try {
    // First, find the order using CheckoutRequestID from stored STK push details
    const order = await orderModel.findOne({
      "stkPushDetails.CheckoutRequestID": CheckoutRequestID,
    });

    if (!order) {
      console.log(
        `❌ Order not found for CheckoutRequestID: ${CheckoutRequestID}`
      );
      return res.status(404).json({
        success: false,
        message: "❌ Order not found",
      });
    }

    // If payment is already confirmed, return success
    if (order.payment === true) {
      return res.json({
        success: true,
        message: "✅ Payment already confirmed. Redirecting to orders page...",
        redirectTo: "/orders",
        order: order,
      });
    }

    await generateToken(req, res, async () => {
      try {
        const token = req.token;
        const timestamp = getTimestamp();

        const verificationData = {
          BusinessShortCode: SHORTCODE,
          Password: getMpesaPassword(timestamp),
          Timestamp: timestamp,
          CheckoutRequestID,
        };

        console.log(
          "📤 Sending M-Pesa Verification Request:",
          verificationData
        );

        const { data } = await axios.post(
          `${DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`,
          verificationData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ M-Pesa Verification Response:", data);

        // Handle different response scenarios
        if (data.ResponseCode === "0") {
          // Check the ResultCode to determine payment status
          if (data.ResultCode === "0") {
            // Payment successful - update order
            const updatedOrder = await orderModel.findByIdAndUpdate(
              order._id,
              {
                payment: true,
                status: "Food Processing", // Update status to next stage
                verificationDetails: {
                  merchantRequestID: data.MerchantRequestID,
                  checkoutRequestID: data.CheckoutRequestID,
                  resultCode: data.ResultCode,
                  resultDesc: data.ResultDesc,
                  verifiedAt: new Date(),
                },
              },
              { new: true }
            );

            console.log(`✅ Payment verified and order updated: ${order._id}`);

            return res.json({
              success: true,
              message: "✅ Payment successful. Redirecting to orders page...",
              redirectTo: "/orders",
              order: updatedOrder,
            });
          } else if (data.ResultCode === "1032") {
            // Transaction cancelled by user
            await orderModel.findByIdAndUpdate(order._id, {
              payment: false,
              status: "Payment Cancelled",
              verificationDetails: {
                merchantRequestID: data.MerchantRequestID,
                checkoutRequestID: data.CheckoutRequestID,
                resultCode: data.ResultCode,
                resultDesc: data.ResultDesc,
                verifiedAt: new Date(),
              },
            });

            return res.json({
              success: false,
              message: "❌ Payment was cancelled. Please try again.",
              redirectTo: "/checkout",
            });
          } else if (data.ResultCode === "1037" || data.ResultCode === "1001") {
            // Transaction timeout or user couldn't complete
            await orderModel.findByIdAndUpdate(order._id, {
              payment: false,
              status: "Payment Timeout",
              verificationDetails: {
                merchantRequestID: data.MerchantRequestID,
                checkoutRequestID: data.CheckoutRequestID,
                resultCode: data.ResultCode,
                resultDesc: data.ResultDesc,
                verifiedAt: new Date(),
              },
            });

            return res.json({
              success: false,
              message: "❌ Payment timed out. Please try again.",
              redirectTo: "/checkout",
            });
          } else {
            // Other failure codes
            await orderModel.findByIdAndUpdate(order._id, {
              payment: false,
              status: "Payment Failed",
              verificationDetails: {
                merchantRequestID: data.MerchantRequestID,
                checkoutRequestID: data.CheckoutRequestID,
                resultCode: data.ResultCode,
                resultDesc: data.ResultDesc,
                verifiedAt: new Date(),
              },
            });

            return res.json({
              success: false,
              message: `❌ Payment failed: ${data.ResultDesc}`,
              redirectTo: "/checkout",
            });
          }
        } else {
          // API call failed
          console.log(
            `❌ Verification API failed: ${data.ResponseDescription}`
          );
          return res.status(400).json({
            success: false,
            message: "❌ Unable to verify payment. Please try again.",
          });
        }
      } catch (error) {
        console.error(
          "❌ Order Verification Error:",
          error.response?.data || error.message
        );

        // Handle specific M-Pesa error responses
        if (error.response?.data?.errorCode === "500.001.1001") {
          // Transaction still being processed
          return res.json({
            success: false,
            message:
              "⏳ Payment is still being processed. Please wait a moment and try again.",
            processing: true,
          });
        }

        return res.status(500).json({
          success: false,
          message: "❌ Verification error. Please try again.",
        });
      }
    });
  } catch (error) {
    console.error("❌ Error Verifying Payment:", error.message);
    return res.status(500).json({
      success: false,
      message: "❌ Payment verification error",
    });
  }
};

/**
 * Get all orders (admin functionality)
 */
const listOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const status = req.query.status;
    const search = req.query.search;

    // Build query
    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { "address.contactName": { $regex: search, $options: "i" } },
        { "address.email": { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      orderModel.find(query).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      orderModel.countDocuments(query),
    ]);

    // Get statistics
    const stats = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const statsObject = stats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalAmount: stat.totalAmount,
      };
      return acc;
    }, {});

    return res.json({
      success: true,
      count: orders.length,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      orders,
      statistics: statsObject,
    });
  } catch (error) {
    console.error("❌ Error Fetching Orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

/**
 * Get orders for a specific user
 */
const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;

    // Build query
    let query = { userId };
    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      orderModel.find(query).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      orderModel.countDocuments(query),
    ]);

    return res.json({
      success: true,
      count: orders.length,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      orders,
    });
  } catch (error) {
    console.error("❌ Error Fetching User Orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching user orders",
    });
  }
};

/**
 * Update order status (admin functionality)
 */
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "❌ Order ID and status required",
      });
    }

    // Valid status values
    const validStatuses = [
      "Payment Pending",
      "Food Processing",
      "On the Way",
      "Delivered",
      "Cancelled",
      "Payment Failed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid status. Valid values: " + validStatuses.join(", "),
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status,
        ...(status === "Delivered" && { deliveredAt: new Date() }),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "❌ Order not found",
      });
    }

    console.log(`✅ Order ${orderId} status updated to: ${status}`);

    return res.json({
      success: true,
      message: `✅ Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error Updating Order Status:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};

/**
 * Cancel order (user functionality)
 */
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "❌ Order ID required",
      });
    }

    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "❌ Order not found",
      });
    }

    // Only allow cancellation for certain statuses
    if (!["Payment Pending", "Food Processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "❌ Order cannot be cancelled at this stage",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: "Cancelled" },
      { new: true }
    );

    return res.json({
      success: true,
      message: "✅ Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error Cancelling Order:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error cancelling order",
    });
  }
};

export {
  placeOrder,
  verifyOrder,
  listOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  mpesaCallback,
  getPaymentConfirmations,
};
