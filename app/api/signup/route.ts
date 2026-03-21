import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/sendEmail";
import { verificationTemplate } from "@/email/SignupEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, username, password } = await request.json();

    const existingUserByUsername = await UserModel.findOne({ username });

    if (existingUserByUsername && existingUserByUsername.isVerified) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 },
      );
    }

    const existingUserWithEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 3600000);

    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exist with the email" },
          { status: 400 },
        );
      }

      existingUserWithEmail.username = username;
      existingUserWithEmail.password = hashedPassword;
      existingUserWithEmail.verifyCode = verifyCode;
      existingUserWithEmail.verifyCodeExpiry = expiryDate;

      await existingUserWithEmail.save();
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });

      await newUser.save();
    }

    const html = verificationTemplate({ username, otp: verifyCode });

    await sendEmail({
      to: email,
      subject: "Your verification code",
      html,
    });

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
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
      { status: 500 },
    );
  }
}
