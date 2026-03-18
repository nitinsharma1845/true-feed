import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, username, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 },
      );
    }

    const existingUserWithEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exist" },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserWithEmail.password = hashedPassword;
        existingUserWithEmail.verifyCode = verifyCode;
        existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserWithEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expieryDate = new Date();
      expieryDate.setHours(expieryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expieryDate,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User register successfully. Please verify your email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error while registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error while registering user",
      },
      {
        status: 500,
      },
    );
  }
}
