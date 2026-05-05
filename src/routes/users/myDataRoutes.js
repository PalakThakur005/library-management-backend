import express from "express";
import {
  getMyIssuedBooks,
  getMyCard,
  getMyFineBooks,
} from  "../../controllers/users/myDataController.js"

import { protect } from "../../middlewares/authMiddleware.js"
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/getmyissuedbooks" ,protect , authorizeRoles("teacher" , "student"), getMyIssuedBooks)
router.get("/my-card", protect, authorizeRoles("teacher" , "student"), getMyCard);
router.get("/getmyfinebooks" ,protect , authorizeRoles("teacher" , "student"), getMyFineBooks)

  export default router;