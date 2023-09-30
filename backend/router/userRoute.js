import express from "express";
import { getUser, createUser, geteUserById, updateUser, deleteUser } from "../control/user.js";
import { verifyUser, adminOnly } from "../middleware/authUser.js";

const router = express.Router();
router.post("/user", verifyUser, adminOnly, createUser);
router.get("/user", verifyUser, adminOnly, getUser);
router.get("/user/:id", verifyUser, adminOnly, geteUserById);
router.patch("/user/:id", verifyUser, adminOnly, updateUser);
router.delete("/user/:id", verifyUser, adminOnly, deleteUser);

export default router;
