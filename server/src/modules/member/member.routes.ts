import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { createFirstMember } from "./member.controller";

const router = Router();

// First member initialization (tree-scoped)
router.post(
  "/trees/:treeId/first-member",
  protect,
  createFirstMember
);

export default router;
