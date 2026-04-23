import jwt from "jsonwebtoken";
// import User from "../models/user.js";

export const protect = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1]; 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    //  const user = await User.findById(decoded.id);

    // if (!user || !user.status === "inactive") {
    //   return res.status(401).json({
    //     message: "Account deactivated by admin",
    //   });   
    // }


    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};