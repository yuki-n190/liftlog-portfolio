"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type HeaderProps = {
  ctaHref: string
  isSignedIn: boolean
}

function Header({ ctaHref, isSignedIn }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl tracking-wider">
          LIFTLOG
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href={isSignedIn ? "/workouts" : "/sign-in"}
            className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignedIn ? "My Workouts" : "Sign In"}
          </Link>
          <Button asChild className="h-12 px-8 text-sm uppercase tracking-widest font-medium">
            <Link href={ctaHref}>
              {isSignedIn ? "Dashboard" : "Get Started"}
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

type HeroSectionProps = {
  ctaHref: string
}

function HeroSection({ ctaHref }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-athlete.png"
          alt="Athlete preparing to lift"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-20">
        <div className="max-w-3xl">
          <h1 className="font-display text-7xl leading-[0.9] tracking-tight md:text-[10rem] lg:text-[12rem]">
            EARN<br />IT.
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
            No shortcuts. No excuses.<br />
            Just you and the iron.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-16 px-12 text-sm uppercase tracking-widest font-medium">
              <Link href={ctaHref}>
                Start Training
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#philosophy"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div className="h-16 w-px bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </a>
    </section>
  )
}

function ManifestoSection() {
  return (
    <section id="philosophy" className="relative py-32 md:py-48 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">The Philosophy</p>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
              DISCIPLINE<br />
              OVER<br />
              MOTIVATION.
            </h2>
          </div>
          <div className="lg:pl-12">
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
              Motivation fades. Discipline remains. LiftLog is built for those who show up 
              every single day, whether they feel like it or not.
            </p>
            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-muted-foreground">
              Track every rep. Measure every gain. Become undeniable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ImageSection() {
  return (
    <section className="relative h-screen">
      <Image
        src="/images/athlete-training.jpg"
        alt="Athlete training intensely"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
        <div className="mx-auto max-w-7xl">
          <blockquote className="max-w-2xl">
            <p className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              &quot;THE IRON NEVER LIES. IT WILL ALWAYS TELL YOU WHERE YOU STAND.&quot;
            </p>
            <footer className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              — Every lifter who earned it
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      number: "01",
      title: "TRACK",
      description: "Log exercise, weight, reps, sets, rest time, tags, and notes in seconds.",
    },
    {
      number: "02",
      title: "REVIEW",
      description: "Open recent workouts, revisit every session, and keep your training history clean.",
    },
    {
      number: "03",
      title: "PROGRESS",
      description: "Track personal records, weekly workouts, streaks, and total logs without guesswork.",
    },
  ]
  return (
    <section className="py-32 md:py-48 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="mb-24">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">The System</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight max-w-4xl">
            SIMPLE.<br />
            EFFECTIVE.<br />
            RELENTLESS.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-16">
          {features.map((feature, i) => (
          <div key={i}>
            <span className="font-display text-6xl md:text-7xl text-muted-foreground/30">
              {feature.number}
            </span>
              <h3 className="mt-6 font-display text-3xl md:text-4xl tracking-tight">{feature.title}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type CTASectionProps = {
  ctaHref: string
}

function CTASection({ ctaHref }: CTASectionProps) {
  return (
    <section className="py-32 md:py-48 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tight">
          STOP<br />
          THINKING.<br />
          START<br />
          LIFTING.
        </h2>
        <div className="mt-16">
          <Button asChild size="lg" className="h-20 px-16 text-base uppercase tracking-widest font-medium">
            <Link href={ctaHref}>
              Begin Now
              <ArrowRight className="ml-4 h-6 w-6" />
            </Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground uppercase tracking-widest">
          Free forever. No credit card.
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="font-display text-2xl tracking-wider">LIFTLOG</span>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Built for lifters. By lifters.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function LiftLogLanding() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        })

        setIsSignedIn(response.ok)
      } catch (error) {
        console.error(error)
        setIsSignedIn(false)
      }
    }

    checkAuth()
  }, [])

  const ctaHref = isSignedIn ? "/dashboard" : "/sign-up"

  return (
    <main className="min-h-screen">
      <Header ctaHref={ctaHref} isSignedIn={isSignedIn} />
      <HeroSection ctaHref={ctaHref} />
      <ManifestoSection />
      <ImageSection/>
      <FeaturesSection />
      <CTASection ctaHref={ctaHref} />
      <Footer />
    </main>
  )
}
