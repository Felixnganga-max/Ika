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

    // Create new order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "Food Processing",
      payment: false,
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
    await generateToken(req, res, async () => {
      try {
        const token = req.token;
        const timestamp = getTimestamp();

        const { data } = await axios.post(
          `${DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`,
          {
            BusinessShortCode: SHORTCODE,
            Password: getMpesaPassword(timestamp),
            Timestamp: timestamp,
            CheckoutRequestID,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ M-Pesa Verification Response:", data);

        if (data.ResultCode === "0") {
          // Extract order ID from the account reference
          const orderRef = data.ResultDesc.match(/Order_([a-f0-9]+)/i);
          if (orderRef && orderRef[1]) {
            const updatedOrder = await orderModel.findByIdAndUpdate(
              orderRef[1],
              { payment: true },
              { new: true }
            );

            if (updatedOrder) {
              return res.json({
                success: true,
                message: "✅ Payment successful. Redirecting to orders page...",
                redirectTo: "/orders",
                order: updatedOrder,
              });
            }
          }

          return res.json({
            success: true,
            message: "✅ Payment successful.",
            redirectTo: "/orders",
          });
        } else {
          return res.json({
            success: false,
            message: "❌ Payment failed. Please try again.",
            redirectTo: "/checkout",
          });
        }
      } catch (error) {
        console.error(
          "❌ Order Verification Error:",
          error.response?.data || error.message
        );
        return res.status(500).json({
          success: false,
          message: "Verification error",
        });
      }
    });
  } catch (error) {
    console.error("❌ Error Verifying Payment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Payment verification error",
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
    const userId = req.user.id;
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
      "Food Processing",
      "On the Way",
      "Delivered",
      "Cancelled",
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
    if (!["Food Processing"].includes(order.status)) {
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
};
