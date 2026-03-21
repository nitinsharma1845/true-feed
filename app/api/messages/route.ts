import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { Message } from "@/models/User.model";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const userDoc = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);

    if (!userDoc || userDoc.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "messages fetched successfully",
        messages: userDoc[0].messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error while getting messages :", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get messages",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { message, username } = await req.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        { status: 403 },
      );
    }

    const newMessage = { content: message, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: false,
        message: "Message send successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error while posting messages :", error);
    return Response.json(
      {
        success: false,
        message: "Failed to post messages",
      },
      { status: 500 },
    );
  }
}

