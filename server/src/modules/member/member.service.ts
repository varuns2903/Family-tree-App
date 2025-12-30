import mongoose from "mongoose";
import { Member } from "./member.model";
import { Tree } from "../tree/tree.model";

type Gender = "male" | "female" | "other";

interface FirstMemberInput {
  firstName: string;
  lastName?: string;
  gender: Gender;
  dateOfBirth?: Date;
  birthPlace?: string;
  isAlive?: boolean;
  deathDate?: Date;
  contactNo?: string;
}

export const MemberService = {
  async createFirstMember(
    treeId: string,
    userId: string,
    memberData: FirstMemberInput
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const tree = await Tree.findById(treeId).session(session);
      if (!tree) {
        const err: any = new Error("Tree not found");
        err.statusCode = 404;
        err.code = "TREE_NOT_FOUND";
        throw err;
      }

      // Owner-only for now (RBAC later)
      if (tree.ownerId.toString() !== userId) {
        const err: any = new Error("Forbidden");
        err.statusCode = 403;
        err.code = "FORBIDDEN";
        throw err;
      }

      if (tree.hasRootMember) {
        const err: any = new Error("Tree already initialized");
        err.statusCode = 400;
        err.code = "TREE_ALREADY_INITIALIZED";
        throw err;
      }

      const createdMembers = await Member.create(
        [
          {
            treeId: tree._id,
            firstName: memberData.firstName,
            lastName: memberData.lastName,
            gender: memberData.gender,
            dateOfBirth: memberData.dateOfBirth,
            birthPlace: memberData.birthPlace,
            isAlive: memberData.isAlive ?? true,
            deathDate: memberData.deathDate,
            contactNo: memberData.contactNo,
            parents: [],
            children: [],
            spouses: [],
          },
        ],
        { session }
      );

      tree.hasRootMember = true;
      await tree.save({ session });

      await session.commitTransaction();
      session.endSession();

      const member = createdMembers[0];

      return {
        id: member._id.toString(),
        firstName: member.firstName,
        lastName: member.lastName,
        gender: member.gender,
        isAlive: member.isAlive,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },
};
