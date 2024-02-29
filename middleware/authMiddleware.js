import User from "../models/userSchema.js";
import { decodeToken } from "../config/generateToken.js";

const verify = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      console.log(token);
      if (!token) {
        return res.status(401).json({ message: "Unauthorized Token" });
      }
      let decoded = decodeToken(token);
      // console.log(decoded);
      req.user = await User.findOne({ _id: decoded.id }, { password: 0 });
      console.log("Token Verified", decoded);
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error", error: error });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { verify };
