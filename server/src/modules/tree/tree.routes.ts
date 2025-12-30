import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { createTree, getTrees, getTreeById } from "./tree.controller";

const router = Router();

router.post("/", protect, createTree);
router.get("/", protect, getTrees);
router.get("/:treeId", protect, getTreeById);

export default router;
