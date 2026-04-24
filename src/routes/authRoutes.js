import express from "express"
import {registerUser,loginUser, getUser,getDashboardStats , 
     deleteUser, updateUser , toggleStatus, resetUserPassword, 
     contactAdmin, pagination , getMe,
     tokenVerify} from "../controllers/authController.js"
import {protect} from "../middlewares/authMiddleware.js"    
import { authorizeRoles } from "../middlewares/roleMiddleware.js"; 
import upload from "../middlewares/upload.js";
import { uploadProfileImage , removeProfileImage ,updateProfile} from "../controllers/authController.js";



const router = express.Router()

router.get(
  "/tokenVerify",
  tokenVerify
);

router.post(
  "/register",
  protect,
  authorizeRoles("admin"),
  registerUser
);

router.post("/login" , loginUser);


router.get(
  "/getRoles",
  protect,
  authorizeRoles("admin"),
  getUser
);


router.get(
  "/pagination",
  protect,
  authorizeRoles("admin"),
  pagination
);


router.get(
  "/dashboard-stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

router.delete(
  "/deleteUser/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

router.put(
  "/updateUser/:id",
  protect,
  authorizeRoles("admin"),
  updateUser 
);


router.put(
  "/toggle-status/:id",
  protect,
  authorizeRoles("admin"),
  toggleStatus
);



router.put(
  "/reset-password/:id",
  protect,
  authorizeRoles("admin"),
  resetUserPassword
);


router.post("/contact-admin" , contactAdmin);

router.get("/me", protect , getMe);


router.put(
  "/upload-profile",
  protect,
  upload.single("image"),
  uploadProfileImage
);


router.put("/remove-profile", 
  protect,
   removeProfileImage);

router.put("/update-profile",
     protect,
      updateProfile);

export default router;