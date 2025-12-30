import mongoose from "mongoose";

export interface IMember extends mongoose.Document {
  treeId: mongoose.Types.ObjectId;

  firstName: string;
  lastName?: string;

  gender: "male" | "female" | "other";

  dateOfBirth?: Date;
  birthPlace?: string;

  isAlive: boolean;
  deathDate?: Date;

  contactNo?: string;

  parents: mongoose.Types.ObjectId[];
  children: mongoose.Types.ObjectId[];
  spouses: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}


const MemberSchema = new mongoose.Schema<IMember>(
  {
    treeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree",
      required: true,
      index: true,
    },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    dateOfBirth: { type: Date },
    birthPlace: { type: String, trim: true },

    isAlive: { type: Boolean, default: true },

    deathDate: { type: Date },

    contactNo: { type: String, trim: true },

    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
    spouses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  },
  { timestamps: true }
);

/**
 * Optional safety rule:
 * If isAlive is true, deathDate should not exist
 */
MemberSchema.pre("save", function (next) {
  if (this.isAlive && this.deathDate) {
    this.deathDate = undefined;
  }
});

export const Member = mongoose.model<IMember>("Member", MemberSchema);
