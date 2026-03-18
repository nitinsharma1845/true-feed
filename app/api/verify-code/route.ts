import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, verifyCode } = await request.json();

    const isUesrExists = await UserModel.findOne({ username });

    if (!isUesrExists) {
      return Response.json(
        {
          success: false,
          message: "User not foundr",
        },
        { status: 404 },
      );
    }

    const isCodeValid = isUesrExists.verifyCode === verifyCode;
    const isCodeNotExpired =
      new Date(isUesrExists.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      isUesrExists.isVerified = true;
      await isUesrExists.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Verification code is invalid",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message:
            "Verification code is expired, please signup agin to get a new verification code",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.log("Error in verifying user :", error);
    return Response.json(
      {
        success: false,
        message: "Error while verifying user",
      },
      { status: 500 },
    );
  }
}
