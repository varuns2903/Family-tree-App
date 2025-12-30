import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getTreeMembers } from "./member.read.controller";

const router = Router();

router.get("/trees/:treeId/members", protect, getTreeMembers);

export default router;
