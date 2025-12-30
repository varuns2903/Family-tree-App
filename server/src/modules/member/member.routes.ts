import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  createFirstMember,
  addChild,
  addParent,
  addSibling,
  addSpouse,
} from "./member.controller";

const router = Router();

router.post("/trees/:treeId/first-member", protect, createFirstMember);

router.post("/members/:memberId/add-child", protect, addChild);
router.post("/members/:memberId/add-parent", protect, addParent);
router.post("/members/:memberId/add-sibling", protect, addSibling);
router.post("/members/:memberId/add-spouse", protect, addSpouse);

export default router;
