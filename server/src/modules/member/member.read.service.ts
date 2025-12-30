import { Member } from "./member.model";
import { Tree } from "../tree/tree.model";

export const MemberReadService = {
  async getMembersByTree(treeId: string, userId: string) {
    const tree = await Tree.findById(treeId);
    if (!tree) {
      const err: any = new Error("Tree not found");
      err.statusCode = 404;
      err.code = "TREE_NOT_FOUND";
      throw err;
    }

    // RBAC: owner only for now (sharing will extend this)
    if (tree.ownerId.toString() !== userId) {
      const err: any = new Error("Forbidden");
      err.statusCode = 403;
      err.code = "FORBIDDEN";
      throw err;
    }

    const members = await Member.find({ treeId: tree._id }).lean();

    // Normalize & sanitize
    return members.map(m => ({
      id: m._id.toString(),
      treeId: m.treeId.toString(),

      firstName: m.firstName,
      lastName: m.lastName,
      gender: m.gender,

      dateOfBirth: m.dateOfBirth,
      birthPlace: m.birthPlace,
      isAlive: m.isAlive,
      deathDate: m.deathDate,
      contactNo: m.contactNo,

      parents: (m.parents || []).map(p => p.toString()),
      children: (m.children || []).map(c => c.toString()),
      spouses: (m.spouses || []).map(s => s.toString()),

      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  },
};
