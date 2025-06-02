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
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0 } = location.state || {};

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [includeDeliveryFee, setIncludeDeliveryFee] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("30-45 minutes");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    town: "",
    street: "",
    phone: "",
    email: "",
    paymentPhone: "",
    specialInstructions: "",
    saveAddress: false,
  });

  const [step, setStep] = useState(1);
  const [isPaymentSameAsContact, setIsPaymentSameAsContact] = useState(true);

  // Constants
  const deliveryFee = includeDeliveryFee ? 100 : 0;
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const totalBeforeCoupon = subtotal + deliveryFee;
  const totalAmount = totalBeforeCoupon - couponDiscount;

  // Effects
  useEffect(() => {
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate("/menu");
    }

    // Load saved addresses if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      fetchSavedAddresses(token);
    }

    // Sync payment phone if checkbox is checked
    if (isPaymentSameAsContact) {
      setFormData((prev) => ({
        ...prev,
        paymentPhone: prev.phone,
      }));
    }
  }, [cart, navigate, isPaymentSameAsContact]);

  useEffect(() => {
    let intervalId;

    if (checkoutRequestId && paymentStatus === "pending") {
      intervalId = setInterval(() => {
        verifyPayment(checkoutRequestId);
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkoutRequestId, paymentStatus]);

  // API functions
  const fetchSavedAddresses = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/addresses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching saved addresses:", error);
    }
  };

  const verifyPayment = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/order/verify",
        { CheckoutRequestID: requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPaymentStatus("success");
        toast.success("Payment successful! Redirecting to order details...");
        setTimeout(() => {
          navigate("/orders", { state: { orderId: response.data.orderId } });
        }, 2000);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/coupons/validate",
        {
          code: couponCode,
        }
      );

      if (response.data.valid) {
        setCouponDiscount(response.data.discount);
        setCouponApplied(true);
        toast.success(`Coupon applied! ${response.data.discount} KSh discount`);
      } else {
        toast.error(response.data.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Error applying coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address) => {
    setFormData({
      ...formData,
      town: address.town,
      street: address.street,
      phone: address.phone || formData.phone,
    });
    setShowSavedAddresses(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Validate delivery info
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.town ||
        !formData.street ||
        !formData.phone
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate phone format
      if (!/^07\d{8}$/.test(formData.phone)) {
        toast.error(
          "Please enter a valid Kenyan phone number (e.g. 0712345678)"
        );
        return;
      }

      setStep(2);
      return;
    }

    // Payment step
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to complete your order");
      }

      // Prepare order data
      const orderData = {
        userId: JSON.parse(localStorage.getItem("user"))?.id,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        amount: totalAmount,
        address: {
          town: formData.town,
          street: formData.street,
          contactName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        mobileNumber: isPaymentSameAsContact
          ? formData.phone
          : formData.paymentPhone,
        includeDelivery: includeDeliveryFee,
        deliveryTime,
        specialInstructions: formData.specialInstructions,
        paymentMethod,
        couponCode: couponApplied ? couponCode : null,
        couponDiscount: couponApplied ? couponDiscount : 0,
        saveAddress: formData.saveAddress,
      };

      console.log(
        `This is user id ${JSON.parse(localStorage.getItem("user"))?.id}`
      );

      // Submit order based on payment method
      if (paymentMethod === "mpesa") {
        const response = await axios.post(
          "http://localhost:4000/api/order/place",
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setCheckoutRequestId(response.data.CheckoutRequestID);
          setPaymentStatus("pending");
          toast.info(
            <div>
              <p className="font-bold">Check your phone to complete payment</p>
              <p>You'll receive an M-Pesa STK push notification</p>
            </div>,
            { autoClose: false }
          );
        }
      } else if (paymentMethod === "cash") {
        const response = await axios.post(
          "http://localhost:4000/api/order/place-cod",
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success("Order placed successfully! You'll pay on delivery");
          setTimeout(() => {
            navigate("/orders", { state: { orderId: response.data.orderId } });
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      setError(
        error.response?.data?.message || error.message || "Order failed"
      );
      toast.error("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // UI Components
  const InputField = ({
    label,
    name,
    type = "text",
    required = false,
    icon,
    ...props
  }) => (
    <div className="mb-4">
      <label className={`${labelClasses} ${required ? "required" : ""}`}>
        {icon &&
          React.cloneElement(icon, { size: 16, className: "text-[#FFD700]" })}
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className={inputClasses}
        value={formData[name]}
        onChange={handleInputChange}
        {...props}
      />
    </div>
  );

  const PaymentMethodCard = ({ method, title, description, icon }) => (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        paymentMethod === method
          ? "border-[#FFD700] bg-[#FFD700]/10"
          : "border-white/20 hover:border-white/40"
      }`}
      onClick={() => setPaymentMethod(method)}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-[#800020] text-[#FFD700]">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-white">{title}</h4>
          <p className="text-sm text-white/70">{description}</p>
        </div>
        {paymentMethod === method && (
          <div className="ml-auto w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center">
            <Check size={14} className="text-[#800020]" />
          </div>
        )}
      </div>
    </div>
  );

  // Styles
  const inputClasses =
    "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-200";
  const labelClasses =
    "text-white/80 text-sm font-medium mb-1 flex items-center gap-2";

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] py-12">
      <ToastContainer position="top-center" />

      {/* Checkout Header */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowRight size={20} className="rotate-180 text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
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

            {["Delivery", "Payment"].map((stepName, index) => (
              <div
                key={stepName}
                className="relative z-10 flex flex-col items-center"
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index + 1 <= step
                      ? "bg-[#FFD700] text-[#800020]"
                      : "bg-white/20 text-white"
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {index + 1}
                </motion.div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    index + 1 <= step ? "text-[#FFD700]" : "text-white/70"
                  }`}
                >
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
              className="bg-[#0f3460] p-8 rounded-2xl shadow-xl border border-white/10"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-500/70 text-white rounded-lg">
                  {error}
                </div>
              )}

              {paymentStatus === "pending" && (
                <div className="mb-6 p-4 bg-yellow-500/70 text-white rounded-lg flex items-center gap-3">
                  <Clock className="animate-pulse" />
                  <div>
                    <p className="font-bold">Payment in progress</p>
                    <p className="text-sm">
                      Please complete the payment on your phone
                    </p>
                  </div>
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

                      {/* Saved Addresses */}
                      {savedAddresses.length > 0 && (
                        <div className="mb-6">
                          <button
                            type="button"
                            className="flex items-center gap-2 text-[#FFD700] text-sm font-medium"
                            onClick={() =>
                              setShowSavedAddresses(!showSavedAddresses)
                            }
                          >
                            {showSavedAddresses
                              ? "Hide saved addresses"
                              : "Use saved address"}
                            {showSavedAddresses ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>

                          {showSavedAddresses && (
                            <div className="mt-2 space-y-2">
                              {savedAddresses.map((address, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                                  onClick={() => handleAddressSelect(address)}
                                >
                                  <p className="font-medium text-white">
                                    {address.town}
                                  </p>
                                  <p className="text-sm text-white/70">
                                    {address.street}
                                  </p>
                                  {address.phone && (
                                    <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                                      <Phone size={12} /> {address.phone}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Delivery Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            includeDeliveryFee
                              ? "border-[#FFD700] bg-[#FFD700]/10"
                              : "border-white/20 hover:border-white/40"
                          }`}
                          onClick={() => setIncludeDeliveryFee(true)}
                        >
                          <div className="flex items-center gap-3">
                            <Truck size={20} className="text-[#FFD700]" />
                            <div>
                              <h4 className="font-bold text-white">Delivery</h4>
                              <p className="text-sm text-white/70">
                                KSh. 100 - {deliveryTime}
                              </p>
                            </div>
                            {includeDeliveryFee && (
                              <div className="ml-auto w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center">
                                <Check size={14} className="text-[#800020]" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            !includeDeliveryFee
                              ? "border-[#FFD700] bg-[#FFD700]/10"
                              : "border-white/20 hover:border-white/40"
                          }`}
                          onClick={() => setIncludeDeliveryFee(false)}
                        >
                          <div className="flex items-center gap-3">
                            <ShoppingBag size={20} className="text-[#FFD700]" />
                            <div>
                              <h4 className="font-bold text-white">Pickup</h4>
                              <p className="text-sm text-white/70">
                                Collect at our location
                              </p>
                            </div>
                            {!includeDeliveryFee && (
                              <div className="ml-auto w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center">
                                <Check size={14} className="text-[#800020]" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Time Selection */}
                      {includeDeliveryFee && (
                        <div className="mb-6">
                          <label className={labelClasses}>
                            <Clock size={16} className="text-[#FFD700]" />
                            Delivery Time
                          </label>
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {[
                              "30-45 minutes",
                              "1 hour",
                              "2 hours",
                              "Schedule",
                            ].map((time) => (
                              <button
                                key={time}
                                type="button"
                                className={`py-2 px-3 rounded-lg text-sm ${
                                  deliveryTime === time
                                    ? "bg-[#FFD700] text-[#800020] font-bold"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                                onClick={() => setDeliveryTime(time)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="First Name"
                          name="firstName"
                          required
                          icon={<User />}
                        />
                        <InputField
                          label="Last Name"
                          name="lastName"
                          required
                        />
                      </div>

                      <InputField
                        label="Town/City"
                        name="town"
                        required
                        icon={<MapPin />}
                      />

                      <InputField
                        label="Street Address"
                        name="street"
                        required
                        icon={<MapPin />}
                        placeholder="Building, floor, apartment, etc."
                      />

                      <InputField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        required
                        icon={<Phone />}
                        placeholder="e.g. 0712345678"
                      />

                      <InputField
                        label="Email (Optional)"
                        name="email"
                        type="email"
                        icon={<Mail />}
                        placeholder="For order confirmation"
                      />

                      <div>
                        <label className={labelClasses}>
                          Special Instructions
                        </label>
                        <textarea
                          name="specialInstructions"
                          className={`${inputClasses} min-h-[100px]`}
                          value={formData.specialInstructions}
                          onChange={handleInputChange}
                          placeholder="Delivery notes, allergies, etc."
                        />
                      </div>

                      {localStorage.getItem("token") && (
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="saveAddress"
                            name="saveAddress"
                            checked={formData.saveAddress}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                saveAddress: e.target.checked,
                              })
                            }
                            className="form-checkbox text-[#FFD700] rounded"
                          />
                          <label
                            htmlFor="saveAddress"
                            className="text-white/80 text-sm"
                          >
                            Save this address for future orders
                          </label>
                        </div>
                      )}
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
                        Payment Method
                      </h2>

                      {/* Payment Methods */}
                      <div className="space-y-4">
                        <PaymentMethodCard
                          method="mpesa"
                          title="M-Pesa"
                          description="Pay instantly via M-Pesa"
                          icon={<CreditCard size={16} />}
                        />

                        <PaymentMethodCard
                          method="cash"
                          title="Cash on Delivery"
                          description="Pay when you receive your order"
                          icon={<ShoppingBag size={16} />}
                        />
                      </div>

                      {/* Payment Phone Number */}
                      {paymentMethod === "mpesa" && (
                        <div className="mt-6">
                          <div className="p-4 bg-white/10 rounded-lg mb-4">
                            <label className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={isPaymentSameAsContact}
                                onChange={() =>
                                  setIsPaymentSameAsContact(
                                    !isPaymentSameAsContact
                                  )
                                }
                                className="form-checkbox text-[#FFD700] rounded"
                              />
                              <span className="text-white">
                                Use same phone number for payment
                              </span>
                            </label>
                          </div>

                          {!isPaymentSameAsContact && (
                            <InputField
                              label="M-Pesa Payment Number"
                              name="paymentPhone"
                              type="tel"
                              required
                              icon={<Phone />}
                              placeholder="e.g. 0712345678"
                            />
                          )}

                          <div className="bg-white/10 p-4 rounded-lg mt-4">
                            <h3 className="text-white font-medium mb-3">
                              How to pay with M-Pesa:
                            </h3>
                            <ol className="text-white/80 text-sm space-y-3">
                              <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#FFD700] text-[#800020] flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                                  1
                                </span>
                                <span>
                                  Click "Pay with M-Pesa" to initiate payment
                                </span>
                              </li>
                              <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#FFD700] text-[#800020] flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                                  2
                                </span>
                                <span>
                                  You will receive an STK push on your phone
                                </span>
                              </li>
                              <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#FFD700] text-[#800020] flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                                  3
                                </span>
                                <span>
                                  Enter your M-Pesa PIN to complete payment
                                </span>
                              </li>
                            </ol>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between mt-8">
                  {step === 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                      <ArrowRight size={18} className="rotate-180" />
                      Back to Delivery
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <motion.button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] rounded-lg font-bold relative overflow-hidden group"
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
                          {step === 1
                            ? "Continue to Payment"
                            : paymentMethod === "mpesa"
                            ? "Pay with M-Pesa"
                            : "Place Order"}
                          <ArrowRight size={18} />
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
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0f3460] p-6 rounded-2xl shadow-xl border border-white/10 sticky top-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="text-[#FFD700]" />
                Order Summary
              </h3>

              {/* Order Items */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-white/5 p-3 rounded-lg"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || "/placeholder-food.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-[#FFD700] text-sm">
                        {item.quantity || 1} × KSh. {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-white font-medium">
                      KSh. {(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className={`${inputClasses} flex-1 ${
                      couponApplied ? "bg-[#4CAF50]/10 border-[#4CAF50]" : ""
                    }`}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCouponApplied(false);
                        setCouponDiscount(0);
                        setCouponCode("");
                      }}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg hover:bg-[#FFD700]/20 transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponApplied && (
                  <p className="text-sm text-[#4CAF50] mt-1">
                    Coupon applied: -KSh. {couponDiscount.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Order Totals */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>KSh. {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white/80">
                  <span className="flex items-center gap-2">
                    <Truck size={16} className="text-[#FFD700]" />
                    Delivery Fee
                  </span>
                  <span>
                    {includeDeliveryFee
                      ? `KSh. ${deliveryFee.toFixed(2)}`
                      : "Free pickup"}
                  </span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-[#4CAF50]">
                    <span>Coupon Discount</span>
                    <span>-KSh. {couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-px bg-white/20 my-3"></div>
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#FFD700]">
                    KSh. {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-4">
                {includeDeliveryFee ? (
                  <div className="flex items-start gap-3 text-white/80 text-sm">
                    <Truck className="text-[#FFD700] mt-0.5" size={16} />
                    <div>
                      <p className="font-medium">Delivery to your location</p>
                      <p className="text-white/60">Estimated: {deliveryTime}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-white/80 text-sm">
                    <ShoppingBag className="text-[#FFD700] mt-0.5" size={16} />
                    <div>
                      <p className="font-medium">Pickup order</p>
                      <p className="text-white/60">123 Food Street, Nairobi</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 text-white/80 text-sm">
                  <Shield className="text-[#FFD700] mt-0.5" size={16} />
                  <div>
                    <p className="font-medium">Secure payment</p>
                    <p className="text-white/60">
                      {paymentMethod === "mpesa"
                        ? "Powered by M-Pesa"
                        : "Pay when you receive"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
