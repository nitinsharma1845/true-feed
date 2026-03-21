"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col gap-2">
        <Loader2 className="animate-spin w-10 h-10" /> Loading..
      </div>
    );
  }
  return <div className="pt-20">{children}</div>;
};

export default ProtectLayout;
