import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const userNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = userNameQuerySchema.safeParse(queryParam);

    console.log("Result of username validation :", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    console.log(username, "Username ");

    const isExist = await UserModel.findOne({ username, isVerified: true });

    if (isExist) {
      return Response.json({
        success: false,
        message: "Username already exists",
      });
    }

    return Response.json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      { status: 500 },
    );
  }
}
