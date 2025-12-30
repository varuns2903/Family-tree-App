import { Tree } from "./tree.model";
import mongoose from "mongoose";

export const TreeService = {
  async createTree(ownerId: string, name: string, description?: string) {
    const tree = await Tree.create({
        name,
        description,
        ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    return {
        id: tree._id.toString(),
        name: tree.name,
        description: tree.description,
        hasRootMember: tree.hasRootMember,
        ownerId: tree.ownerId.toString(),
    };
  },

  async getTreesForUser(userId: string) {
    const ownedTrees = await Tree.find({ ownerId: userId });

    return {
      ownedTrees: ownedTrees.map(t => ({
        id: t._id.toString(),
        name: t.name,
        description: t.description,
        hasRootMember: t.hasRootMember,
      })),
      sharedTrees: [], // will be populated in Step 7 (Sharing)
    };
  },

  async getTreeById(treeId: string, userId: string) {
    const tree = await Tree.findById(treeId);
    if (!tree) {
      const err: any = new Error("Tree not found");
      err.statusCode = 404;
      err.code = "TREE_NOT_FOUND";
      throw err;
    }

    // For now only owner has access; RBAC comes later
    if (tree.ownerId.toString() !== userId) {
      const err: any = new Error("Forbidden");
      err.statusCode = 403;
      err.code = "FORBIDDEN";
      throw err;
    }

    return {
      id: tree._id.toString(),
      name: tree.name,
      description: tree.description,
      hasRootMember: tree.hasRootMember,
      ownerId: tree.ownerId.toString(),
      role: "owner",
    };
  },
};
