import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
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

    const userId = user._id;

    const { acceptMessage } = await req.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status of accept message",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Accepting message status updated succesfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to update user status of accept message : ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status of accept message",
      },
      { status: 401 },
    );
  }
}

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

    const userId = user._id;

    const userDoc = await UserModel.findById(userId);

    if (!userDoc) {
      return Response.json(
        {
          success: false,
          message: "Can not found user",
        },
        { status: 404 },
      );
    }
 
    return Response.json(
      {
        success: true,
        message: "Status of isAccepting message fetched successfully",
        user: userDoc,
        isAcceptingMessage: userDoc.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to fetch user status of accept message : ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status of accept message",
      },
      { status: 401 },
    );
  }
}
