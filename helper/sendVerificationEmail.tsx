import { resend } from "@/lib/resend";
import VerificationEmail from "@/email/SignupEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "trueFeed | Verification code",
      react: <VerificationEmail username={username} otp={verificationCode} />,
    });

    return {
      message: `Veirification code sned to the ${email}`,
      success: true,
    };
  } catch (error) {
    console.log("Error while sending verification email : ", error);
    return {
      message: "Failed to send Verification Email",
      success: false,
    };
  }
}
