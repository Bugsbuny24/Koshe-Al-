import Link from 'next/link'
import { Zap, ArrowRight, Sparkles, LayoutList, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Sparkles,
    title: 'Smart Ad Copy',
    description: 'Generate ad copy tailored to your brand, audience, and campaign goals in seconds.',
  },
  {
    icon: LayoutList,
    title: 'One Brief, Multiple Variations',
    description: 'Turn one campaign input into multiple angles, headlines, and messaging options instantly.',
  },
  {
    icon: Target,
    title: 'Performance-Focused Creation',
    description: 'Create headlines, descriptions, calls to action, and creative ideas designed for better results.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Add your campaign brief',
    description: 'Enter your product, audience, goal, and message in a simple guided flow.',
  },
  {
    number: '02',
    title: 'Generate your ad package',
    description: 'AI prepares ad copy, creative directions, and multiple campaign-ready variations.',
  },
  {
    number: '03',
    title: 'Review and move faster',
    description: 'Review your outputs, refine what you need, and move forward with a clearer campaign package.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">AdGenius</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered ad creation
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Create high-converting ads in minutes
          </h1>
          <p className="mb-8 text-xl text-slate-500 leading-relaxed">
            Enter your product details and let AI generate ad copy, creative angles, and campaign
            variations tailored to your brand and audience.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="px-8">
              <Link href="/signup">
                Start creating ads
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>Fast setup</span>
            <span>·</span>
            <span>Smarter messaging</span>
            <span>·</span>
            <span>More variations</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900">
              Everything you need to build stronger campaigns
            </h2>
            <p className="text-lg text-slate-500">
              From a single brief to ready-to-use ad ideas, manage your creative workflow in one place.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                  <feature.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-start">
                <span className="mb-3 text-3xl font-bold text-indigo-200">{step.number}</span>
                <h3 className="mb-2 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Built for faster campaign execution
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Whether you are launching a new offer, testing new messaging, or preparing campaign
            ideas at scale, AdGenius helps you move from idea to execution faster.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to speed up your ad creation workflow?
          </h2>
          <p className="mb-8 text-lg text-indigo-200">
            Use AI to generate better campaign ideas, stronger messaging, and more ad variations in
            less time.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8"
          >
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-8 text-center text-sm text-slate-400">
        <p>© 2024 AdGenius. Built with AI for modern marketers.</p>
      </footer>
    </div>
  )
}
