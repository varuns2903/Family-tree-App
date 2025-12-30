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
    return members.map((m) => ({
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

      parents: (m.parents || []).map((p) => p.toString()),
      children: (m.children || []).map((c) => c.toString()),
      spouses: (m.spouses || []).map((s) => s.toString()),

      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  },

  async getMemberById(treeId: string, memberId: string, userId: string) {
    const tree = await Tree.findById(treeId);
    if (!tree) {
      const err: any = new Error("Tree not found");
      err.statusCode = 404;
      err.code = "TREE_NOT_FOUND";
      throw err;
    }

    // RBAC (owner only for now)
    if (tree.ownerId.toString() !== userId) {
      const err: any = new Error("Forbidden");
      err.statusCode = 403;
      err.code = "FORBIDDEN";
      throw err;
    }

    const member = await Member.findOne({
      _id: memberId,
      treeId: tree._id,
    }).lean();

    if (!member) {
      const err: any = new Error("Member not found");
      err.statusCode = 404;
      err.code = "MEMBER_NOT_FOUND";
      throw err;
    }

    return {
      id: member._id.toString(),
      treeId: member.treeId.toString(),

      firstName: member.firstName,
      lastName: member.lastName,
      gender: member.gender,

      dateOfBirth: member.dateOfBirth,
      birthPlace: member.birthPlace,
      isAlive: member.isAlive,
      deathDate: member.deathDate,
      contactNo: member.contactNo,

      parents: member.parents.map((p) => p.toString()),
      children: member.children.map((c) => c.toString()),
      spouses: member.spouses.map((s) => s.toString()),

      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  },
};
