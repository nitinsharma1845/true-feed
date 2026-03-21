import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await params;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 },
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: {
          messages: {
            _id: new mongoose.Types.ObjectId(messageId),
          },
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in delete route:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting message" },
      { status: 500 },
    );
  }
}
