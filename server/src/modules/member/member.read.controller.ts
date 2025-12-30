import { Request, Response, NextFunction } from "express";
import { MemberReadService } from "./member.read.service";

export const getTreeMembers = async (
  req: Request,
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

export const getSingleMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const member = await MemberReadService.getMemberById(
      req.params.treeId,
      req.params.memberId,
      req.userId!
    );
    res.status(200).json(member);
  } catch (err) {
    next(err);
  }
};