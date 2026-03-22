"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGenerateMessages,
  useSendMessage,
} from "@/services/message.service";
import { messageSchema } from "@/schemas/messageSchema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Sparkles,
  ShieldCheck,
  AtSign,
  Wand2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const DEFAULT_SUGGESTIONS = [
  "What is one thing you'd change about your work routine?",
  "If you could give your younger self one piece of advice, what would it be?",
  "What’s a project you’re working on that you’re secretly proud of?",
];

export default function MessagePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "User";
  const [msgStr, setMsgStr] = useState<string>("");

  const { mutate: sendMessage, isPending } = useSendMessage();
  const suggest = useGenerateMessages();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
    mode: "onChange",
  });
  useEffect(() => {
    document.title = "New message | True-Feed";
  }, []);

  const messageContent = watch("content");

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

  const handleAiMessages = () => {
    suggest.mutate(undefined, { onSuccess: (res) => setMsgStr(res) });
  };

  const handleSelectSuggestion = (msg: string) => {
    setValue("content", msg);
    trigger("content");
  };

  const displaySuggestions = msgStr ? msgStr.split("||") : DEFAULT_SUGGESTIONS;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-indigo-100 selection:text-primary font-sans transition-colors duration-500">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center">
        <section className="text-center space-y-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-widest shadow-sm hover:border-primary/30 transition-colors cursor-default">
            <ShieldCheck className="h-3 w-3 text-primary" />
            Verified Secure & Private
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.85] text-slate-950">
              Pure honesty. <br />
              <span className="text-slate-400">No footprints.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Share your thoughts with{" "}
              <span className="text-primary font-semibold italic">
                @{username}
              </span>
              . Everything you send is completely anonymous.
            </p>
          </div>
        </section>

        <div className="w-full max-w-2xl group/card">
          <div className="relative bg-white border border-slate-200 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover/card:scale-110 transition-transform">
                  <AtSign className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-tight text-slate-700">
                  Message to @{username}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
                  Live Session
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              <div className="min-h-40">
                <Textarea
                  placeholder="What would you like to say? Don't hold back..."
                  className="min-h-40 bg-transparent border-none focus-visible:ring-0 text-2xl p-0 shadow-none resize-none placeholder:text-slate-300 font-medium leading-relaxed text-slate-800 transition-all"
                  {...register("content")}
                />
              </div>

              {errors.content && (
                <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-in shake duration-300">
                  {errors.content?.message}
                </p>
              )}

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Wand2 className="h-3 w-3" /> AI Prompts
                  </label>
                  <button
                    type="button"
                    onClick={handleAiMessages}
                    disabled={suggest.isPending}
                    className="text-[10px] font-black text-primary hover:text-indigo-700 transition-all flex items-center gap-1 group/btn active:scale-95 disabled:opacity-50"
                  >
                    {suggest.isPending ? "Analysing..." : "Refresh Ideas"}
                    <Sparkles className="h-3 w-3 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="grid gap-2">
                  {displaySuggestions.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSuggestion(msg)}
                      className="text-left text-xs p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 text-slate-600 hover:text-primary line-clamp-1 font-medium active:scale-[0.98]"
                    >
                      &quot;{msg}&quot;
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {messageContent?.length || 0} characters
                </span>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-slate-950 text-white hover:bg-primary px-10 py-7 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 disabled:bg-slate-200 disabled:translate-y-0"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send Secretly
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup">
              <p className="text-sm text-slate-500 hover:text-primary transition-all cursor-pointer font-medium group/link">
                Start receiving your own messages.{" "}
                <span className="text-slate-950 font-bold underline decoration-primary underline-offset-4 group-hover/link:text-primary transition-colors">
                  Create your profile
                </span>
              </p>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center opacity-60">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          &copy; 2026 True-Feed &bull; Built with Privacy
        </p>
      </footer>
    </div>
  );
}
