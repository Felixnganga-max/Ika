import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization; // Standard way to send tokens
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id }; // Attach userId to req.user

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
