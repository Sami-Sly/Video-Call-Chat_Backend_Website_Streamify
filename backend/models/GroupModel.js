import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    streamChannelId: {
      type: String,
      required: true, // ID returned from Stream when creating the channel
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
