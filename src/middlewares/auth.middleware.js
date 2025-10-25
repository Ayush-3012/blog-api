import jwt from "jsonwebtoken";

export const generateToken = (userId) =>
  jwt.sign(userId, process.env.JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.signedCookies[process.env.COOKIE_NAME];
    if (!token?.trim())
      return res.status(401).json({ message: "Token Not Received" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid Token" });
      else {
        req.userId = decoded.userId;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Authentication failed, try again." });
  }
};
