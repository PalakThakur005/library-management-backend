import express from "express";
import {
  issueBook,
  returnBook,
  getIssuedBooks,
  updateIssue,
  getIssue,
  getIssueStats,
  clearFine,
  getFinedBooks,
} from "../controllers/issueController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();


router.post(
  "/issue-book",
  protect,
  authorizeRoles("admin"),
  issueBook
);


router.get(
  "/issued-books",
  protect,
  authorizeRoles("admin"),
  getIssue
);

router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getIssuedBooks
);

router.put(
  "/update/:id",
  protect,
  authorizeRoles("admin"),
  updateIssue
);

router.put(
  "/return-book/:id",
  protect,
  authorizeRoles("admin"),
  returnBook
);

router.get(
  "/statscard",
  protect,
  authorizeRoles("admin"),
  getIssueStats
);

router.get("/fined-books",
   protect,
  authorizeRoles("admin"),
   getFinedBooks);



router.put("/clear-fine/:id",
   protect,
  authorizeRoles("admin"),
   clearFine);


export default router;