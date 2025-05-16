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

const placeOrder = async (req, res) => {
  console.log("📥 Received Order Request:", req.body);

  try {
    const userId = req.user.id;
    let { items, amount, address, mobileNumber } = req.body;

    if (!items || !amount || !address || !mobileNumber) {
      return res
        .status(400)
        .json({ success: false, message: "❌ Missing required fields" });
    }

    amount = Math.floor(parseFloat(amount));
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid amount. Must be a positive integer.",
      });
    }

    mobileNumber = mobileNumber.toString().replace(/^0/, "254");

    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

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
            orderDetails: { totalAmountKES: amount, items },
          });
        } else {
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
        return res.status(500).json({
          success: false,
          message: "Error processing payment request",
        });
      }
    });
  } catch (error) {
    console.error("❌ Order Placement Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error processing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { CheckoutRequestID } = req.body;

  if (!CheckoutRequestID) {
    return res
      .status(400)
      .json({ success: false, message: "❌ CheckoutRequestID required" });
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
          // Update the payment status in the order
          const orderRef = data.ResultDesc.match(/Order_([a-f0-9]+)/i);
          if (orderRef && orderRef[1]) {
            await orderModel.findByIdAndUpdate(orderRef[1], { payment: true });
          }

          return res.json({
            success: true,
            message: "✅ Payment successful. Redirecting to orders page...",
            redirectTo: "/orders",
          });
        } else {
          return res.json({
            success: false,
            message: "❌ Payment failed. Staying on checkout page.",
            redirectTo: "/checkout",
          });
        }
      } catch (error) {
        console.error(
          "❌ Order Verification Error:",
          error.response?.data || error.message
        );
        return res
          .status(500)
          .json({ success: false, message: "Verification error" });
      }
    });
  } catch (error) {
    console.error("❌ Error Verifying Payment:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Payment verification error" });
  }
};

/**
 * Get all orders (admin functionality)
 */
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ date: -1 });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("❌ Error Fetching Orders:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching orders" });
  }
};

/**
 * Get orders for a specific user
 */
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("❌ Error Fetching User Orders:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching user orders" });
  }
};

/**
 * Update order status
 */
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "❌ Order ID and status required" });
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
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Order not found" });
    }

    return res.json({
      success: true,
      message: "✅ Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error Updating Order Status:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error updating order status" });
  }
};

export { placeOrder, verifyOrder, listOrders, userOrders, updateStatus };
