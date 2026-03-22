import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "resend";
import { toast } from "sonner";

export const useGetMessage = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await axios.get("/api/messages");
      return data;
    },
    retry: false,
  });
};

export const useFetchActiveStatus = () => {
  return useQuery({
    queryKey: ["iasAcceptingMessage"],
    queryFn: async () => {
      const { data } = await axios.get("/api/accept-messages");
      return data;
    },
  });
};

export const useChangeStatus = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post("/api/accept-messages", payload);
      return data;
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId) => {
      const { data } = await axios.delete(`/api/messages/${messageId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || "Failed to delete message";

      toast.error(message);
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (payload: { message: string; username: string }) => {
      const { data } = await axios.post("/api/messages", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || "Failed to send message";

      toast.error(message);
    },
  });
};

export const useGenerateMessages = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/suggest-messages");
      return data;
    },
  });
};
