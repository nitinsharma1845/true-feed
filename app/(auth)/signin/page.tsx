"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/loginSchema";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

function Singin() {
  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    if (res?.ok) {
      toast.success("Login successful");
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight lg:text-3xl mb-3">
            Welcome back!
          </h1>
          <p className="mb-4">Signin to get the anonymous feedback</p>
        </div>
        <form onSubmit={form.handleSubmit(handleLogin)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                    Username or Email
                  </FieldLabel>
                  <Input
                    {...form.register("identifier")}
                    id="checkout-7j9-card-number-uw1"
                    placeholder="johndoe@gmail.com"
                  />
                  {form.formState.errors.identifier && (
                    <FieldError>
                      {form.formState.errors.identifier.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw2">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...form.register("password")}
                      id="checkout-7j9-card-number-uw2"
                      placeholder="*******"
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      className="h-4 w-4 absolute bottom-2.5 right-2 cursor-pointer"
                      variant={"ghost"}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeClosed /> : <Eye />}
                    </Button>
                  </div>

                  {form.formState.errors.password && (
                    <FieldError>
                      {form.formState.errors.password.message}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet></FieldSet>
            <FieldSet></FieldSet>
            <Field orientation="horizontal">
              <Button type="submit" className="w-full cursor-pointer">
                Sign In
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}

export default Singin;
