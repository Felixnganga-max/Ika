import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0 } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [includeDeliveryFee, setIncludeDeliveryFee] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    town: "",
    street: "",
    phone: "",
    email: "",
    paymentPhone: "",
  });

  const [step, setStep] = useState(1);
  const [isPaymentSameAsContact, setIsPaymentSameAsContact] = useState(true);

  // Calculate total amount with conditional delivery fee (100 KES)
  const deliveryFee = 100;
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const totalAmount = includeDeliveryFee ? subtotal + deliveryFee : subtotal;

  useEffect(() => {
    // If payment phone is same as contact, update it when contact phone changes
    if (isPaymentSameAsContact) {
      setFormData((prev) => ({
        ...prev,
        paymentPhone: prev.phone,
      }));
    }
  }, [formData.phone, isPaymentSameAsContact]);

  // Effect to check payment status
  useEffect(() => {
    let intervalId;

    if (checkoutRequestId) {
      intervalId = setInterval(() => {
        verifyPayment(checkoutRequestId);
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkoutRequestId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const verifyPayment = async (checkoutRequestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.post(
        "http://localhost:4000/api/order/verify",
        { CheckoutRequestID: checkoutRequestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPaymentStatus("success");
        clearInterval(intervalId);
        navigate("/", {
          state: { orderDetails: response.data.orderDetails },
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Confirm phone number before proceeding to payment step
      toast.info(
        <div>
          <p>Please confirm your phone number:</p>
          <p className="font-bold">{formData.phone}</p>
          <p className="text-sm mt-2">
            This will be used for order updates{" "}
            {includeDeliveryFee ? "and delivery" : ""}.
          </p>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setStep(2);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not logged in");
      }

      // Prepare the address object
      const address = {
        town: formData.town,
        street: formData.street,
        contactName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      };

      // Get items from cart with necessary information
      const items = cart.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      // Prepare order data for your backend
      const orderData = {
        userId: JSON.parse(localStorage.getItem("user"))?._id,
        items: items,
        amount: totalAmount,
        address: address,
        mobileNumber: isPaymentSameAsContact
          ? formData.phone
          : formData.paymentPhone,
        includeDelivery: includeDeliveryFee,
      };

      console.log("Sending order data:", orderData);

      // Send order request to your backend
      const response = await axios.post(
        "http://localhost:4000/api/order/place",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Store the checkout request ID for status checking
        setCheckoutRequestId(response.data.CheckoutRequestID);

        // Show success message for the STK push
        setPaymentStatus("pending");

        // Notification to check phone
        toast.info("Please check your phone to complete the payment", {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
        });

        // Polling to check payment status every 5 seconds
        const checkPaymentStatus = async () => {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:4000/api/order/verify",
              { CheckoutRequestID: response.data.CheckoutRequestID },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              // Payment successful, redirect to orders page
              toast.success(
                "✅ Payment successful! Redirecting to orders page..."
              );
              setTimeout(() => {
                window.location.href = "/orders"; // Redirect to orders page
              }, 2000);
            } else {
              // Payment failed/canceled
              setPaymentStatus("failed");
              toast.error(
                "❌ Payment failed or was canceled. Please try again."
              );
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            toast.error("❌ Error verifying payment. Please try again.");
          }
        };

        setTimeout(checkPaymentStatus, 5000); // Check after 5 seconds
      } else {
        throw new Error(response.data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while processing your payment"
      );
      toast.error("❌ Payment could not be processed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-200";
  const labelClasses =
    "text-white/80 text-sm font-medium mb-1 flex items-center gap-2";

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FAF7F0] to-[#FFF5E6] py-12">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/20 -z-1"></div>
            <motion.div
              className="absolute left-0 top-1/2 h-1 bg-[#FFD700]"
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.5 }}
            ></motion.div>

            {["Delivery Details", "Payment"].map((stepName, index) => (
              <div
                key={stepName}
                className="relative z-10 flex flex-col items-center"
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index + 1 <= step ? "bg-[#800020]" : "bg-white/20"
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-bold">{index + 1}</span>
                </motion.div>
                <span className="mt-2 text-sm font-medium text-white/80">
                  {stepName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-[#800020]/80 p-8 rounded-2xl shadow-xl border border-white/20"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-500/70 text-white rounded-lg">
                  {error}
                </div>
              )}

              {paymentStatus === "pending" && (
                <div className="mb-6 p-4 bg-yellow-500/70 text-white rounded-lg">
                  Please check your phone to complete the M-Pesa payment. This
                  page will automatically update when payment is confirmed.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <MapPin className="text-[#FFD700]" />
                        Delivery Information
                      </h2>

                      {/* Delivery Option Checkbox */}
                      <div className="p-4 bg-white/10 rounded-lg">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={includeDeliveryFee}
                            onChange={() =>
                              setIncludeDeliveryFee(!includeDeliveryFee)
                            }
                            className="form-checkbox text-[#FFD700] rounded"
                          />
                          <div>
                            <span className="text-white">
                              Include delivery (KSh. {deliveryFee})
                            </span>
                            <p className="text-sm text-white/60 mt-1">
                              Uncheck if you'll pick up the order yourself
                            </p>
                          </div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClasses}>First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            className={inputClasses}
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            className={inputClasses}
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClasses}>
                          <MapPin size={16} className="text-[#FFD700]" />
                          Town
                        </label>
                        <input
                          type="text"
                          name="town"
                          required
                          className={inputClasses}
                          value={formData.town}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className={labelClasses}>
                          <MapPin size={16} className="text-[#FFD700]" />
                          Street / Exact Location
                        </label>
                        <input
                          type="text"
                          name="street"
                          required
                          className={inputClasses}
                          placeholder="Provide detailed delivery location"
                          value={formData.street}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className={labelClasses}>
                          <Phone size={16} className="text-[#FFD700]" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          className={inputClasses}
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 07XXXXXXXX"
                        />
                        <p className="text-sm text-white/60 mt-1">
                          This number will be used for order updates{" "}
                          {includeDeliveryFee && "and delivery"}
                        </p>
                      </div>

                      <div>
                        <label className={labelClasses}>
                          <Mail size={16} className="text-[#FFD700]" />
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          className={inputClasses}
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <p className="text-sm text-white/60 mt-1">
                          Your order details will be sent here
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <CreditCard className="text-[#FFD700]" />
                        Payment Information
                      </h2>

                      <div className="p-4 bg-white/10 rounded-lg">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={isPaymentSameAsContact}
                            onChange={() =>
                              setIsPaymentSameAsContact(!isPaymentSameAsContact)
                            }
                            className="form-checkbox text-[#FFD700] rounded"
                          />
                          <span className="text-white">
                            Use same phone number for payment
                          </span>
                        </label>
                      </div>

                      {!isPaymentSameAsContact && (
                        <div>
                          <label className={labelClasses}>
                            <Phone size={16} className="text-[#FFD700]" />
                            M-Pesa Payment Number
                          </label>
                          <input
                            type="tel"
                            name="paymentPhone"
                            required
                            className={inputClasses}
                            value={formData.paymentPhone}
                            onChange={handleInputChange}
                            placeholder="e.g. 07XXXXXXXX"
                          />
                        </div>
                      )}

                      <div className="bg-white/10 p-4 rounded-lg space-y-3">
                        <h3 className="text-white font-medium">
                          M-Pesa Payment Process:
                        </h3>
                        <ol className="text-white/80 text-sm space-y-2">
                          <li className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#FFD700] text-[#800020] flex items-center justify-center text-xs font-bold">
                              1
                            </span>
                            Click "Pay with M-Pesa" to initiate payment
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#FFD700] text-[#800020] flex items-center justify-center text-xs font-bold">
                              2
                            </span>
                            You will receive an STK push on your phone
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#FFD700] text-[#800020] flex items-center justify-center text-xs font-bold">
                              3
                            </span>
                            Enter your M-Pesa PIN to complete payment
                          </li>
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] rounded-xl font-bold text-lg mt-8 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || paymentStatus === "pending"}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      "Processing..."
                    ) : paymentStatus === "pending" ? (
                      "Waiting for payment..."
                    ) : (
                      <>
                        {step === 1 ? "Continue to Payment" : "Pay with M-Pesa"}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#FFE55C] to-[#FFB52E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  ></motion.div>
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-[#800020]/80 p-6 rounded-2xl shadow-xl border border-white/20 sticky top-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="text-[#FFD700]" />
                Order Summary
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-white/10 p-3 rounded-lg"
                  >
                    <img
                      src={item.images?.[0] || "/api/placeholder/400/320"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-[#FFD700]">KSh. {item.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>KSh. {subtotal}</span>
                </div>

                {/* Conditional delivery fee display */}
                <div className="flex justify-between text-white/80">
                  <span className="flex items-center gap-2">
                    <Truck size={16} className="text-[#FFD700]" />
                    Delivery Fee
                  </span>
                  <span>
                    {includeDeliveryFee
                      ? `KSh. ${deliveryFee}`
                      : "Not included"}
                  </span>
                </div>

                <div className="h-px bg-white/20 my-3"></div>
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#FFD700]">KSh. {totalAmount}</span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-4">
                {includeDeliveryFee ? (
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Truck className="text-[#FFD700]" size={20} />
                    <span>Estimated delivery: 30-45 minutes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <ShoppingBag className="text-[#FFD700]" size={20} />
                    <span>Pickup order - no delivery fee</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <Shield className="text-[#FFD700]" size={20} />
                  <span>Secure payment powered by M-Pesa</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
