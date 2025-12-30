import mongoose from "mongoose";

export interface ITree extends mongoose.Document {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  hasRootMember: boolean;
}

const TreeSchema = new mongoose.Schema<ITree>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hasRootMember: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export const Tree = mongoose.model<ITree>("Tree", TreeSchema);
