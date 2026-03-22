"use client";

import React, { useState, useEffect } from "react";
import {
  useChangeStatus,
  useFetchActiveStatus,
  useGetMessage,
} from "@/services/message.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, MessageSquareOff, Share2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import DeleteMessageDialog from "@/components/common/DeleteMessageDialog";

export default function Dashboard() {
  const { data: session } = useSession();
  const { data, isLoading } = useGetMessage();
  const isAcceptingMessage = useFetchActiveStatus();
  const changeStatus = useChangeStatus();

  const [copied, setCopied] = useState(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(true);
  const [profileUrl, setProfileUrl] = useState<string>("");

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    document.title = "Dashboard | True-Feed";
  }, []);

  useEffect(() => {
    if (isAcceptingMessage.isSuccess && isAcceptingMessage.data) {
      setIsAccepting(isAcceptingMessage.data.isAcceptingMessage);
    }
  }, [isAcceptingMessage.isSuccess, isAcceptingMessage.data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = session?.user?.username || "username";
      const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      setProfileUrl(`${base}/u/${username}`);
    }
  }, [session]);

  const copyToClipboard = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckedChange = (checked: boolean) => {
    changeStatus.mutate(
      { acceptMessage: checked },
      {
        onSuccess: (res) => {
          const st = res.user.isAcceptingMessage;
          setIsAccepting(st);
          toast.success(
            st === true
              ? "You are now accepting anonymous messages"
              : "You are not accepting messages anymore",
          );
        },
      },
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl min-h-screen mt-16">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
        User Dashboard
      </h1>

      <Card className="mb-10 border-primary/20 shadow-sm overflow-hidden bg-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Copy Your Unique Link
          </CardTitle>
          <CardDescription>
            Share this link to start receiving anonymous messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background border rounded-lg px-4 py-2.5 font-mono text-sm truncate select-all">
              {profileUrl || "Loading link..."}
            </div>
            <Button
              onClick={copyToClipboard}
              size="icon"
              variant={copied ? "default" : "outline"}
              className="shrink-0 transition-all"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-8 p-4 bg-background border rounded-xl shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-sm sm:text-base">
            Accepting Messages
          </span>
        </div>
        <Switch
          checked={isAccepting}
          onCheckedChange={handleCheckedChange}
          disabled={isAcceptingMessage.isLoading || changeStatus.isPending}
        />
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Your Messages</h2>
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 rounded-full text-primary">
            Total: {data?.messages?.length || 0}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-40">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.messages?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.messages.map((message: { content: string; _id: string }) => (
              <Card
                key={message._id}
                className="group hover:border-primary/50 transition-all duration-300 shadow-sm relative overflow-hidden"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Anonymous Message
                    </CardTitle>
                    <Button
                      onClick={() => setSelectedMessageId(message._id)}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-medium leading-relaxed italic text-foreground/90">
                    "{message.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-3xl flex flex-col items-center justify-center py-20 bg-muted/5">
            <div className="bg-muted p-5 rounded-full mb-4">
              <MessageSquareOff className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No messages yet</h3>
            <p className="text-muted-foreground text-center max-w-xs mt-2 text-sm">
              Your inbox is empty. Once you share your link, messages will
              appear here.
            </p>
          </div>
        )}
      </div>

      <DeleteMessageDialog
        open={!!selectedMessageId}
        setOpen={(isOpen) => !isOpen && setSelectedMessageId(null)}
        messageId={selectedMessageId || ""}
      />

      <footer className="py-12 text-center opacity-60">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          &copy; 2026 True-Feed &bull; Dashboard
        </p>
      </footer>
    </div>
  );
}
