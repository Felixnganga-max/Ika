import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {
    type: String,
    required: true,
    default: "Food Processing",
    enum: [
      "Payment Pending",
      "Food Processing",
      "On the Way",
      "Delivered",
      "Cancelled",
      "Payment Failed",
    ],
  },
  date: { type: Date, default: () => Date.now() },
  payment: { type: Boolean, default: false },

  // Additional fields for M-Pesa integration
  mobileNumber: { type: String },

  // STK Push details
  stkPushDetails: {
    MerchantRequestID: { type: String },
    CheckoutRequestID: { type: String },
    ResponseCode: { type: String },
    ResponseDescription: { type: String },
    CustomerMessage: { type: String },
    sentAt: { type: Date, default: Date.now },
  },

  // Payment confirmation details from M-Pesa callback
  paymentConfirmation: {
    merchantRequestID: { type: String },
    checkoutRequestID: { type: String },
    resultCode: { type: Number },
    resultDesc: { type: String },
    mpesaReceiptNumber: { type: String },
    transactionDate: { type: Date },
    phoneNumber: { type: String },
    amount: { type: Number },
    confirmedAt: { type: Date },
  },

  // Payment failure details
  paymentFailure: {
    merchantRequestID: { type: String },
    checkoutRequestID: { type: String },
    resultCode: { type: Number },
    resultDesc: { type: String },
    failedAt: { type: Date },
  },

  deliveredAt: { type: Date },
});

// Add indexes for better query performance
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ "paymentConfirmation.transactionDate": -1 });
orderSchema.index({ "paymentConfirmation.mpesaReceiptNumber": 1 });
orderSchema.index({ "stkPushDetails.CheckoutRequestID": 1 });

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
