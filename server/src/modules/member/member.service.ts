import mongoose from "mongoose";
import { Member } from "./member.model";
import { Tree } from "../tree/tree.model";

type Gender = "male" | "female" | "other";

interface MemberInput {
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
  /* ======================================================
     CREATE FIRST MEMBER
  ====================================================== */
  async createFirstMember(
    treeId: string,
    userId: string,
    memberData: MemberInput
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

      const [member] = await Member.create(
        [
          {
            treeId: tree._id,
            ...memberData,
            isAlive: memberData.isAlive ?? true,
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
  
  /* ======================================================
     ADD CHILD (single parent / couple / unknown)
  ====================================================== */
  async addChild(
    primaryParentId: string,
    userId: string,
    options: {
      secondaryParentId?: string | null;
      childData: MemberInput;
    }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const primaryParent = await Member.findById(primaryParentId).session(session);
      if (!primaryParent) {
        const err: any = new Error("Primary parent not found");
        err.statusCode = 404;
        err.code = "MEMBER_NOT_FOUND";
        throw err;
      }

      const tree = await Tree.findById(primaryParent.treeId).session(session);
      if (!tree) {
        const err: any = new Error("Tree not found");
        err.statusCode = 404;
        err.code = "TREE_NOT_FOUND";
        throw err;
      }

      if (tree.ownerId.toString() !== userId) {
        const err: any = new Error("Forbidden");
        err.statusCode = 403;
        err.code = "FORBIDDEN";
        throw err;
      }

      const parents: mongoose.Types.ObjectId[] = [primaryParent._id];

      if (options.secondaryParentId) {
        const secondaryParent = await Member.findById(
          options.secondaryParentId
        ).session(session);

        if (!secondaryParent) {
          const err: any = new Error("Secondary parent not found");
          err.statusCode = 404;
          err.code = "MEMBER_NOT_FOUND";
          throw err;
        }

        // must be spouse
        if (
          !primaryParent.spouses.some(
            s => s.toString() === secondaryParent._id.toString()
          )
        ) {
          const err: any = new Error("Secondary parent is not spouse");
          err.statusCode = 400;
          err.code = "INVALID_SECONDARY_PARENT";
          throw err;
        }

        parents.push(secondaryParent._id);
      }

      const [child] = await Member.create(
        [
          {
            treeId: primaryParent.treeId,
            ...options.childData,
            isAlive: options.childData.isAlive ?? true,
            parents,
            children: [],
            spouses: [],
          },
        ],
        { session }
      );

      // bidirectional links
      primaryParent.children.push(child._id);
      await primaryParent.save({ session });

      if (parents.length === 2) {
        const secondaryParent = await Member.findById(parents[1]).session(session);
        if (secondaryParent) {
          secondaryParent.children.push(child._id);
          await secondaryParent.save({ session });
        }
      }

      await session.commitTransaction();
      session.endSession();

      return {
        childId: child._id.toString(),
        parentIds: parents.map(p => p.toString()),
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  /* ======================================================
     ADD PARENT (optionally apply to siblings)
  ====================================================== */
  async addParent(
    childId: string,
    userId: string,
    options: {
      parentData: MemberInput;
      applyToSiblings?: string[];
    }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const child = await Member.findById(childId).session(session);
      if (!child) {
        const err: any = new Error("Child not found");
        err.statusCode = 404;
        err.code = "MEMBER_NOT_FOUND";
        throw err;
      }

      if (child.parents.length >= 2) {
        const err: any = new Error("Max parents exceeded");
        err.statusCode = 400;
        err.code = "MAX_PARENTS_EXCEEDED";
        throw err;
      }

      const tree = await Tree.findById(child.treeId).session(session);
      if (!tree) {
        const err: any = new Error("Tree not found");
        err.statusCode = 404;
        err.code = "TREE_NOT_FOUND";
        throw err;
      }

      if (tree.ownerId.toString() !== userId) {
        const err: any = new Error("Forbidden");
        err.statusCode = 403;
        err.code = "FORBIDDEN";
        throw err;
      }

      // Create the new parent
      const [newParent] = await Member.create(
        [
          {
            treeId: child.treeId,
            ...options.parentData,
            isAlive: options.parentData.isAlive ?? true,
            parents: [],
            children: [child._id],
            spouses: [],
          },
        ],
        { session }
      );

      // Link parent ↔ child
      child.parents.push(newParent._id);
      await child.save({ session });

      // 🔑 MISSING LOGIC — LINK EXISTING PARENT AS SPOUSE
      if (child.parents.length === 2) {
        const existingParentId = child.parents.find(
          p => p.toString() !== newParent._id.toString()
        );

        if (existingParentId) {
          const existingParent = await Member.findById(existingParentId).session(session);

          if (existingParent) {
            // Bidirectional spouse linking
            if (!existingParent.spouses.includes(newParent._id)) {
              existingParent.spouses.push(newParent._id);
            }
            if (!newParent.spouses.includes(existingParent._id)) {
              newParent.spouses.push(existingParent._id);
            }

            await existingParent.save({ session });
            await newParent.save({ session });
          }
        }
      }

      // Apply parent to selected siblings (if provided)
      if (options.applyToSiblings?.length) {
        for (const siblingId of options.applyToSiblings) {
          const sibling = await Member.findById(siblingId).session(session);
          if (
            sibling &&
            sibling.parents.some(p => p.toString() === child.parents[0].toString())
          ) {
            sibling.parents.push(newParent._id);
            newParent.children.push(sibling._id);
            await sibling.save({ session });
          }
        }
        await newParent.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return {
        parentId: newParent._id.toString(),
        spouseLinked: child.parents.length === 2,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  /* ======================================================
     ADD SIBLING
  ====================================================== */
  async addSibling(
    memberId: string,
    userId: string,
    siblingData: MemberInput
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const member = await Member.findById(memberId).session(session);
      if (!member) {
        const err: any = new Error("Member not found");
        err.statusCode = 404;
        err.code = "MEMBER_NOT_FOUND";
        throw err;
      }

      if (member.parents.length === 0) {
        const err: any = new Error("Cannot add sibling without parents");
        err.statusCode = 400;
        err.code = "NO_PARENTS_DEFINED";
        throw err;
      }

      const tree = await Tree.findById(member.treeId).session(session);
      if (!tree) {
        const err: any = new Error("Tree not found");
        err.statusCode = 404;
        err.code = "TREE_NOT_FOUND";
        throw err;
      }

      if (tree.ownerId.toString() !== userId) {
        const err: any = new Error("Forbidden");
        err.statusCode = 403;
        err.code = "FORBIDDEN";
        throw err;
      }

      const parents = member.parents;

      const [sibling] = await Member.create(
        [
          {
            treeId: member.treeId,
            ...siblingData,
            isAlive: siblingData.isAlive ?? true,
            parents,
            children: [],
            spouses: [],
          },
        ],
        { session }
      );

      for (const parentId of parents) {
        const parent = await Member.findById(parentId).session(session);
        if (parent) {
          parent.children.push(sibling._id);
          await parent.save({ session });
        }
      }

      await session.commitTransaction();
      session.endSession();

      return {
        siblingId: sibling._id.toString(),
        parentIds: parents.map(p => p.toString()),
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  /* ======================================================
     ADD SPOUSE
  ====================================================== */
  async addSpouse(
    memberId: string,
    userId: string,
    spouseData: MemberInput
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const member = await Member.findById(memberId).session(session);
      if (!member) {
        const err: any = new Error("Member not found");
        err.statusCode = 404;
        err.code = "MEMBER_NOT_FOUND";
        throw err;
      }

      const tree = await Tree.findById(member.treeId).session(session);
      if (!tree) {
        const err: any = new Error("Tree not found");
        err.statusCode = 404;
        err.code = "TREE_NOT_FOUND";
        throw err;
      }

      if (tree.ownerId.toString() !== userId) {
        const err: any = new Error("Forbidden");
        err.statusCode = 403;
        err.code = "FORBIDDEN";
        throw err;
      }

      const [spouse] = await Member.create(
        [
          {
            treeId: member.treeId,
            ...spouseData,
            isAlive: spouseData.isAlive ?? true,
            parents: [],
            children: [],
            spouses: [member._id],
          },
        ],
        { session }
      );

      member.spouses.push(spouse._id);
      await member.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        memberId: member._id.toString(),
        spouseId: spouse._id.toString(),
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },
};
