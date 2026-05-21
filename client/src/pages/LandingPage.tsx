import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, Github, FileText, DollarSign, MessageSquare, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg">ShipDesk</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-24 pb-16 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-native client portal
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Stop writing status emails.<br />
            <span className="text-primary">Ship updates automatically.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            ShipDesk connects to your GitHub repositories and generates polished, plain-English weekly status reports for your clients — automatically, every Friday.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-8">
                Start for free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg">Sign in</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Github,
              title: "GitHub-powered reports",
              description: "Connect your repos. ShipDesk reads your commits, PRs, and releases and turns them into plain-English updates.",
            },
            {
              icon: FileText,
              title: "Branded client portal",
              description: "Every client gets a white-label portal at your subdomain with your logo and brand color. No code required.",
            },
            {
              icon: DollarSign,
              title: "Invoicing & scope changes",
              description: "Send invoices, handle scope change requests, and collect payments — all in one place.",
            },
            {
              icon: MessageSquare,
              title: "Async messaging",
              description: "No more scattered email chains. Keep all client communication in a per-project thread.",
            },
            {
              icon: Shield,
              title: "Magic link access",
              description: "Clients sign in with a single link — no passwords, no friction. Secure 30-day sessions.",
            },
            {
              icon: Zap,
              title: "AI-generated summaries",
              description: "Google Gemini transforms raw GitHub activity into executive-level summaries your clients actually read.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-lg p-6"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 text-center bg-primary/5 border-t border-b">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to save 7 hours a week?</h2>
          <p className="text-muted-foreground mb-8">Join developers who use ShipDesk to deliver professional client experiences without the admin overhead.</p>
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 px-8">
              Create your workspace <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-6 text-center text-sm text-muted-foreground border-t">
        <p>© 2026 ShipDesk. Built for freelance developers.</p>
      </footer>
    </div>
  );
}
