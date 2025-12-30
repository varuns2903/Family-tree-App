import { Request, Response, NextFunction } from "express";
import { TreeService } from "./tree.service";

export const createTree = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const tree = await TreeService.createTree(req.userId!, name, description);
    res.status(201).json(tree);
  } catch (err) {
    next(err);
  }
};

export const getTrees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await TreeService.getTreesForUser(req.userId!);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getTreeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tree = await TreeService.getTreeById(
      req.params.treeId,
      req.userId!
    );
    res.json(tree);
  } catch (err) {
    next(err);
  }
};
