import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import Group from "../models/GroupModel.js";
import crypto from "crypto";
import { StreamChat } from "stream-chat";
import { upsertStreamUser } from "../lib/stream.js";
const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export const createGroupChannel = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const { name, members } = req.body;

    if (!name || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ message: "Invalid group data" });
    }

    // Step 1: Validate friend relationships
    const currentUser = await User.findById(currentUserId).select("friends");
    const friendIds = currentUser.friends.map((id) => id.toString());
    const isAllFriends = members.every((id) => friendIds.includes(id));

    if (!isAllFriends) {
      return res
        .status(403)
        .json({ message: "Can only add your friends to group" });
    }

    const fullMembers = [currentUserId, ...members];

    // Step 2: Upsert all users into Stream
    await Promise.all(
      fullMembers.map(async (id) => {
        const user = await User.findById(id).select("fullName profilePic");
        return upsertStreamUser({
          id: id.toString(),
          name: user.fullName,
          image: user.profilePic || "",
        });
      })
    );

    // Step 3: Create the Stream channel
    const channel = streamClient.channel("messaging", crypto.randomUUID(), {
      name,
      members: fullMembers,
      created_by_id: currentUserId,
    });

    await channel.create();

    // Step 4: Save group in MongoDB
    const group = await Group.create({
      name,
      members: fullMembers,
      createdBy: currentUserId,
      streamChannelId: channel.id,
    });

    res.status(201).json(group);
  } catch (err) {
    console.error("Error creating group channel:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const  = async (req, res) => {};
export const getGroupChannel = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const groups = await Group.find({ members: currentUserId })
      .populate("members", "fullName profilePic") // optional for frontend display
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching user groups:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getMyFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic location nativeLanguage learningLanguage"
      );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // check if a req already exists Prevents Duplicate friend requests.
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const acceptFriendRequest = async (req, res) => {
  const { id: recipientId } = req.params;

  const existingRequest = await FriendRequest.findById(recipientId);

  if (!existingRequest) {
    return res.status(404).json({ message: "Friend request not found" });
  }

  if (existingRequest.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not authorized to accept this friend request",
    });
  }

  // ✅ Correctly update the document
  existingRequest.status = "accepted";
  await existingRequest.save();

  // ✅ Update both users' friends list
  await User.findByIdAndUpdate(existingRequest.sender, {
    $addToSet: { friends: existingRequest.recipient },
  });

  await User.findByIdAndUpdate(existingRequest.recipient, {
    $addToSet: { friends: existingRequest.sender },
  });

  res.status(200).json({ message: "Friend request accepted" });
};

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
