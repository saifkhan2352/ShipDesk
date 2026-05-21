import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Zap, Github, FileText, DollarSign, MessageSquare, Shield,
  ArrowRight, CheckCircle, Clock, Users, BarChart3, ChevronRight,
  Mail, Star, TrendingUp, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Github,
    title: "GitHub-powered reports",
    description: "Connect your repos. ShipDesk reads your commits, PRs, and releases and turns them into plain-English updates your clients actually understand.",
  },
  {
    icon: FileText,
    title: "Branded client portal",
    description: "Every client gets a white-label portal at your subdomain with your logo and brand color. Looks like your own product — not a third-party tool.",
  },
  {
    icon: DollarSign,
    title: "Invoicing & payments",
    description: "Create milestone invoices and collect payment through an embedded checkout. Clients pay directly from the portal — no PayPal links in emails.",
  },
  {
    icon: MessageSquare,
    title: "Async messaging",
    description: "Keep all client communication in a per-project thread. No more scattered email chains, Slack DMs, and WhatsApp messages to dig through.",
  },
  {
    icon: Shield,
    title: "Magic link access",
    description: "Clients sign in with a single email link — no passwords, no friction. Secure 30-day sessions with a single click.",
  },
  {
    icon: TrendingUp,
    title: "Scope change flow",
    description: "Clients submit change requests through a structured form. You quote, they approve, and a payment link is generated automatically.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect your GitHub",
    description: "Link your repositories with OAuth in seconds. ShipDesk automatically syncs commits, pull requests, and releases every week.",
    icon: Github,
  },
  {
    step: "02",
    title: "AI writes the update",
    description: "Every Friday at 9AM, Google Gemini transforms your raw GitHub activity into a polished, plain-English status report.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Client reads it in their portal",
    description: "Your client receives a branded email, clicks one link, and sees their report in a professional portal — no password required.",
    icon: Users,
  },
];

const TESTIMONIALS = [
  {
    quote: "I used to spend Sunday evenings writing status emails. Now I just check that the report looks good and hit publish. Saves me 3+ hours every week.",
    name: "Marcus T.",
    title: "Freelance Full-Stack Developer",
    initials: "MT",
  },
  {
    quote: "My clients love the portal. One of them told me I 'seemed more professional than agencies he'd worked with.' That was worth the subscription alone.",
    name: "Priya K.",
    title: "Independent Web Developer",
    initials: "PK",
  },
  {
    quote: "The scope change flow has been a game-changer. Clients submit a request, I send a quote, they approve and pay. Zero informal scope creep.",
    name: "Daniel R.",
    title: "Dev Agency Owner",
    initials: "DR",
  },
];

const STATS = [
  { value: "7.4h", label: "saved per week, per developer" },
  { value: "$12k+", label: "in scope creep captured annually" },
  { value: "60%", label: "fewer client 'status check' emails" },
  { value: "2 min", label: "average client portal setup" },
];

function MockDashboard() {
  return (
    <div className="w-full bg-card border rounded-xl shadow-2xl overflow-hidden text-left">
      <div className="bg-muted/60 border-b px-4 py-2.5 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="flex-1 mx-4">
          <div className="bg-background/80 rounded px-3 py-1 text-xs text-muted-foreground font-mono w-48">
            acme.portal.shipdesk.io
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-44 border-r bg-card/80 p-3 hidden sm:block">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">S</span>
            </div>
            <span className="text-xs font-semibold">ShipDesk</span>
          </div>
          {["Dashboard", "Invoices", "Scope Changes", "Settings"].map((item, i) => (
            <div key={item} className={`px-2 py-1.5 rounded text-xs mb-0.5 ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}>
              {item}
            </div>
          ))}
        </div>
        <div className="flex-1 p-4 bg-background/50">
          <div className="text-xs font-semibold mb-3">Active Projects</div>
          <div className="space-y-2">
            {[
              { name: "Acme Corp Website", repo: "acme/website", badge: "Active", color: "bg-green-100 text-green-700" },
              { name: "Mobile App v2", repo: "acme/mobile", badge: "Active", color: "bg-green-100 text-green-700" },
              { name: "Admin Dashboard", repo: "acme/admin", badge: "Paused", color: "bg-amber-100 text-amber-700" },
            ].map((p) => (
              <div key={p.name} className="bg-card border rounded-md p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{p.repo}</div>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${p.color}`}>{p.badge}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-primary/5 border border-primary/20 rounded-md p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">New report generated</span>
            </div>
            <div className="text-xs text-muted-foreground">Acme Corp Website · Week of May 19</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">ShipDesk</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="gap-1.5">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium mb-6">
                <Zap className="h-3.5 w-3.5" />
                AI-native client portal for developers
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
                Stop writing
                <br />
                status emails.
                <br />
                <span className="text-primary">Ship updates automatically.</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                ShipDesk connects to GitHub, generates polished weekly reports with AI, and gives every client a branded portal for files, invoices, and messaging. All without touching an email client.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2 w-full sm:w-auto px-6 h-11">
                    Start for free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-11">
                    Sign in to your workspace
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                No credit card required · Set up in under 2 minutes
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-xl" />
              <MockDashboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium mb-4">
              <Layers className="h-3.5 w-3.5" />
              How it works
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Set up once. Run automatically.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect GitHub, invite your clients, and ShipDesk handles the rest — every week, forever.
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-border" />
            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="text-center"
                  >
                    <div className="relative inline-flex mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-card border-2 border-border shadow-sm flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-muted/20 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium mb-4">
              <BarChart3 className="h-3.5 w-3.5" />
              Everything you need
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              One tool. Every client touchpoint.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Replace your email client, Google Drive, PayPal, and Notion with one professional portal.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium mb-4">
              <Star className="h-3.5 w-3.5" />
              Developer reviews
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Loved by freelancers
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Developers billing $3K–$15K/month use ShipDesk to look bigger than they are.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature checklist CTA */}
      <section className="py-20 px-4 sm:px-6 bg-primary/5 border-y">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything in one workspace
              </h2>
              <p className="text-muted-foreground mb-8">
                Stop juggling 6 different tools. ShipDesk replaces your client communication stack with one professional portal.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 h-11 px-6">
                  Create your workspace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">Free to start · No credit card needed</p>
            </div>
            <div className="space-y-3">
              {[
                "AI-generated weekly status reports",
                "Branded white-label client portal",
                "GitHub integration & webhook sync",
                "Invoice creation with payment links",
                "Scope change request & approval flow",
                "Per-project async messaging thread",
                "File sharing with Cloudinary CDN",
                "Magic link client authentication",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">S</span>
                </div>
                <span className="font-bold">ShipDesk</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-native client portal for freelance developers and small dev agencies.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <p className="font-semibold mb-3">Product</p>
                <div className="space-y-2 text-muted-foreground">
                  <a href="#features" className="block hover:text-foreground transition-colors">Features</a>
                  <a href="#how-it-works" className="block hover:text-foreground transition-colors">How it works</a>
                  <a href="#testimonials" className="block hover:text-foreground transition-colors">Reviews</a>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-3">Account</p>
                <div className="space-y-2 text-muted-foreground">
                  <Link href="/sign-up" className="block hover:text-foreground transition-colors">Sign up free</Link>
                  <Link href="/sign-in" className="block hover:text-foreground transition-colors">Sign in</Link>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-3">Built with</p>
                <div className="space-y-2 text-muted-foreground">
                  <span className="block">Google Gemini AI</span>
                  <span className="block">GitHub API</span>
                  <span className="block">Clerk Auth</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© 2026 ShipDesk. Built for freelance developers.</p>
            <p>Made with ♥ by developers, for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
