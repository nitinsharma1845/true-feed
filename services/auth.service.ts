import { signupSchema } from "@/schemas/signupSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "resend";
import { toast } from "sonner";
import z from "zod";

const checkUsername = async (username: string) => {
  const { data } = await axios.get(
    `/api/auth/check-username?username=${username}`,
  );
  return data;
};

export const useValidateUsername = (username: string) => {
  return useQuery({
    queryKey: ["username", username],
    queryFn: () => checkUsername(username),
    enabled: username.length > 2,
    staleTime: 1000 * 60,
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (payload: z.infer<typeof signupSchema>) => {
      const { data } = await axios.post("/api/signup", payload);
      return data;
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({
      username,
      verifyCode,
    }: {
      username: string;
      verifyCode: string;
    }) => {
      const { data } = await axios.post("/api/verify-code", {
        username,
        verifyCode,
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully.Login to get messages");
      router.replace("/signin");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || "Failed to verify email";

      toast.error(message);
    },
  });
};
