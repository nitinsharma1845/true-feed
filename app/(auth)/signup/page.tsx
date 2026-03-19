"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import z from "zod";
import { signupSchema } from "@/schemas/signupSchema";
import { useSignup, useValidateUsername } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CircleCheck, CircleX, Eye, EyeClosed, Loader2 } from "lucide-react";

function Signup() {
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [debouncedUsername] = useDebounceValue(username, 500);
  const signup = useSignup();
  const { data: isValidUsername, isFetching } =
    useValidateUsername(debouncedUsername);

  console.log(isValidUsername);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    const isValid = await form.trigger("username");
    if (!isValid) return;
    signup.mutate(data, {
      onSuccess: (res) => {
        console.log("Res of mutation function : ", res);
        if (res?.success) {
          toast.success(res?.message || "Account created successfully");
          router.replace(`/verify/${username}`);
        } else {
          toast.error("Faild to create account.");
        }
      },
    });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight lg:text-3xl mb-3">
            Join Truefeed
          </h1>
          <p className="mb-4">Signup to start your anonymous adventure</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Username
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...form.register("username")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      id="checkout-7j9-card-name-43j"
                      placeholder="Evil_Rabbit"
                    />
                    {isFetching && (
                      <Loader2 className="h-4 w-4 absolute bottom-2.5 right-2 animate-spin" />
                    )}
                  </div>
                  {isValidUsername && (
                    <div>
                      {isValidUsername?.success === true ? (
                        <FieldDescription className="flex items-center gap-1 text-green-600">
                          {isValidUsername.message}{" "}
                          <CircleCheck className="w-3 h-3" />
                        </FieldDescription>
                      ) : (
                        <FieldError className="flex items-center gap-1 text-destructive">
                          {isValidUsername.message}{" "}
                          <CircleX className="w-3 h-3" />
                        </FieldError>
                      )}
                    </div>
                  )}

                  {form.formState.errors.username && (
                    <FieldError>
                      {form.formState.errors.username.message}
                    </FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                    Email
                  </FieldLabel>
                  <Input
                    {...form.register("email")}
                    id="checkout-7j9-card-number-uw1"
                    placeholder="johndoe@gmail.com"
                  />
                  {form.formState.errors.email && (
                    <FieldError>
                      {form.formState.errors.email.message}
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
            <FieldSet>
              <FieldDescription>
                By clicking countinue you are agree to our term & conditiona and
                privacy & policy
              </FieldDescription>
            </FieldSet>
            <FieldSet></FieldSet>
            <Field orientation="horizontal">
              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}

export default Signup;
