"use client";

import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import LogoutDialog from "./LogoutDialog";
import { useState } from "react";

export default function Navbar() {
  const { status } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <nav className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="bg-primary p-1.5 rounded-lg">
            <MessageSquareQuote className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">True-Feed</span>
        </Link>

        {status === "authenticated" ? (
          <Button
            variant="destructive"
            className="cursor-pointer px-10"
            onClick={() => setOpen(true)}
          >
            Logout
          </Button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="px-4 sm:px-6 h-9 text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        )}
        <LogoutDialog open={open} setOpen={setOpen} />
      </div>
    </nav>
  );
}
