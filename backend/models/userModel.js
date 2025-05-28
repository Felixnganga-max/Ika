import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
      required: true,
    },
    cartData: { type: mongoose.Schema.Types.Mixed, default: {} },
    refreshTokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ "refreshTokens.token": 1 });

// Clean up expired refresh tokens before saving
userSchema.pre("save", function (next) {
  if (this.refreshTokens && this.refreshTokens.length > 0) {
    this.refreshTokens = this.refreshTokens.filter(
      (tokenObj) => tokenObj.expiresAt > new Date() && tokenObj.isActive
    );
  }
  next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
