import { signupSchema } from "@/schemas/signupSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
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
