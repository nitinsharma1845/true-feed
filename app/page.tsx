"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  UserRoundSearch,
  Zap,
  ArrowRight,
  Link as LinkIcon,
  MessageSquareQuote,
  UserPlus,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <section className="w-full py-24 px-4 text-center relative flex items-center justify-center min-h-[90vh]">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-chart-1/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-chart-2/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-background/60 backdrop-blur-sm shadow-sm transition-all hover:bg-background/80">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
            Beta version now live
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
            Honest Feedback. <br />
            <span className="text-primary">No Filters.</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-xl leading-relaxed">
            True-Feed lets you receive anonymous feedback from friends,
            colleagues, and your audience — safely and privately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="px-8 h-12 text-md shadow-lg shadow-primary/20"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              Why choose True-Feed?
            </h2>
            <p className="text-muted-foreground">
              Built for privacy and simplicity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: UserRoundSearch,
                title: "100% Anonymous",
                desc: "No identity revealed. We prioritize anonymity so you get the raw truth.",
              },
              {
                icon: ShieldCheck,
                title: "Safe & Secure",
                desc: "End-to-end encryption ensures your data and messages stay protected.",
              },
              {
                icon: Zap,
                title: "Easy to Use",
                desc: "No complex setup. Just share your link and start receiving feedback.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-background/60 backdrop-blur-md border rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-transparent via-muted to-transparent -z-10"></div>
            {[
              {
                icon: UserPlus,
                title: "1. Create Account",
                desc: "Sign up in seconds with minimal info.",
              },
              {
                icon: LinkIcon,
                title: "2. Share Your Link",
                desc: "Post your unique URL on social media.",
              },
              {
                icon: MessageSquareQuote,
                title: "3. Get Feedback",
                desc: "Read and manage your anonymous messages.",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-background border shadow-sm flex items-center justify-center mb-6 transition-transform hover:scale-110">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 mx-4 my-10 relative overflow-hidden bg-foreground rounded-3xl group">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-background tracking-tight">
            Ready to hear the truth?
          </h2>
          <p className="mb-10 text-muted/60 max-w-lg mx-auto text-lg">
            Join thousands of users who use True-Feed for personal and
            professional growth.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="px-10 h-12 font-semibold shadow-xl"
            >
              Create Your Link Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
