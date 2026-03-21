"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendMessage } from "@/services/message.service";
import { messageSchema } from "@/schemas/messageSchema";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Send,
  UserPlus,
  Sparkles,
  ShieldCheck,
  AtSign,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MessagePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "";

  const { mutate: sendMessage, isPending } = useSendMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: z.infer<typeof messageSchema>) => {
    if (!username) {
      toast.error("Invalid user");
      return;
    }

    sendMessage(
      { username, message: data.content },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center overflow-hidden font-sans">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-40"></div>
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-primary/5 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-6xl px-6 py-12 md:py-24 z-10 grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border text-secondary-foreground text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Hear what people <br />
              <span className="text-primary font-black italic">
                really
              </span>{" "}
              think.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Send an encrypted, anonymous message to this user. No logs, no
              tracking, just honest feedback.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-muted/40 border border-primary/5 backdrop-blur-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">
                Ready for your turn?
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your own link and start receiving anonymous messages
                today.
              </p>
            </div>
            <Link href="/signup" className="block">
              <Button
                variant="default"
                className="w-full rounded-xl h-12 font-bold group"
              >
                Get Your Own Link
                <UserPlus className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="flex items-center gap-3 mb-6 bg-background/50 border w-fit px-4 py-2 rounded-2xl shadow-sm backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <AtSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground leading-none mb-1">
                Sending to
              </p>
              <h2 className="text-lg font-bold tracking-tight leading-none">
                @{username}
              </h2>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-chart-1/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative bg-card border border-primary/10 rounded-[28px] shadow-2xl overflow-hidden p-1">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-10 space-y-8"
              >
                <Field>
                  <FieldContent>
                    <div className="relative">
                      <Textarea
                        placeholder="Type your anonymous message here..."
                        className="min-h-62.5 bg-muted/20 border-none focus-visible:ring-0 text-xl p-0 shadow-none resize-none placeholder:text-muted-foreground/40 font-medium"
                        {...register("content")}
                      />
                    </div>
                  </FieldContent>
                  {errors.content && (
                    <FieldError className="text-sm mt-4 text-destructive font-bold flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-destructive" />
                      {errors.content?.message}
                    </FieldError>
                  )}
                </Field>

                <div className="flex items-center justify-between gap-4 pt-6 border-t border-primary/5">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground/60 uppercase">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Honesty is appreciated
                  </div>
                  <Button
                    type="submit"
                    className="px-10 py-5 font-bold rounded-lg shadow-xl shadow-primary/20 transition-all"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}
                    {isPending ? "Sending..." : "Send Secretly"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-10 w-full text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
        &copy; 2026 True-Feed &bull; All Rights Reserved
      </footer>
    </div>
  );
}
