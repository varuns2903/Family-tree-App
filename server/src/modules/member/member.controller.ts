import { Response, NextFunction } from "express";
import { MemberService } from "./member.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createFirstMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      birthPlace,
      isAlive,
      deathDate,
      contactNo,
    } = req.body;

    const member = await MemberService.createFirstMember(
      req.params.treeId,
      req.userId!,
      {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        birthPlace,
        isAlive,
        deathDate,
        contactNo,
      }
    );

    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};
