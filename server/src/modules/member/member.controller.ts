import { Response, NextFunction } from "express";
import { MemberService } from "./member.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createFirstMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const member = await MemberService.createFirstMember(
      req.params.treeId,
      req.userId!,
      req.body
    );
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

export const addChild = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MemberService.addChild(
      req.params.memberId,
      req.userId!,
      {
        secondaryParentId: req.body.secondaryParentId,
        childData: req.body.childData,
      }
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const addParent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MemberService.addParent(
      req.params.memberId,
      req.userId!,
      {
        parentData: req.body.parentData,
        applyToSiblings: req.body.applyToSiblings,
      }
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const addSibling = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MemberService.addSibling(
      req.params.memberId,
      req.userId!,
      req.body
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const addSpouse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MemberService.addSpouse(
      req.params.memberId,
      req.userId!,
      req.body
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
