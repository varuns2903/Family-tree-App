import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getSingleMember, getTreeMembers } from "./member.read.controller";

const router = Router();

router.get("/trees/:treeId/members", protect, getTreeMembers);
router.get("/trees/:treeId/members/:memberId", protect, getSingleMember);
export default router;
