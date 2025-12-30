import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { MemberReadService } from "./member.read.service";

export const getTreeMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await MemberReadService.getMembersByTree(
      req.params.treeId,
      req.userId!
    );
    res.status(200).json({ members });
  } catch (err) {
    next(err);
  }
};
