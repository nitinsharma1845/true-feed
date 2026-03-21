"use client";

import { useParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Controller, useForm } from "react-hook-form";
import { useVerifyEmail } from "@/services/auth.service";

function Verify() {
  const { username } = useParams<{ username: string }>();
  const verify = useVerifyEmail();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<{ otp: string }>({
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  async function verifyEmail(data: { otp: string }) {
    verify.mutate({ verifyCode: data.otp, username });
  }

  return (
    <div className="bg-secondary flex justify-center items-center w-full h-screen">
      <div className="w-full md:w-lg bg-white shadow-md rounded-lg p-20 ">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold">Verify your email address</h1>
          <p className="text-xs text-muted-foreground">
            we have sent a 6 digit verification code to your registered email.
            enter the code to verify yourself.
          </p>
        </div>
        <div className="flex justify-center">
          <form
            className="space-y-8 flex flex-col"
            onSubmit={handleSubmit(verifyEmail)}
          >
            <div>
              <Controller
                name="otp"
                control={control}
                rules={{
                  required: "Otp is required",
                  minLength: { value: 6, message: "Otp must of 6 digits" },
                }}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              {errors.otp && (
                <p className="text-xs text-destructive mt-4">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <Button type="submit">Verify</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Verify;
