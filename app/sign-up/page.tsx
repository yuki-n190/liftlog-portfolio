"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "アカウント作成に失敗しました。")
        setFieldErrors(data.errors || {})
        return
      }

      router.push("./dashboard")
      router.refresh()
    } catch (error) {
      console.error(error)
      setError("予期しないエラーが発生しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <Link href="/" className="font-display text-3xl tracking-wider">
              LIFTLOG
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl md:text-6xl tracking-tight">
              START YOUR<br />JOURNEY.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Every rep counts. Every day matters.
            </p>
          </div>

          {/* Form */}
          <form  onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p> 
            )}

            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs uppercase tracking-widest text-muted-foreground"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="ironwarrior"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                required
              />
              {fieldErrors.username && (
                <p className="text-xs text-red-500">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-widest text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-500">
                {fieldErrors.email}
              </p>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-widest text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                required
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-xs uppercase tracking-widest text-muted-foreground"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 text-sm uppercase tracking-widest font-medium mt-6"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Already lifting?{" "}
            <Link
              href="/sign-in"
              className="uppercase tracking-widest text-foreground hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Built for lifters. By lifters.
          </p>
        </div>
      </footer>
    </main>
  )
}
