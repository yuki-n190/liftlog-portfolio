"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [isSubnitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "ログインに失敗しました。")
        setFieldErrors(data.errors || {})
        return
      }

      router.push("/dashboard")
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
          <div className="text-center mb-16">
            <Link href="/" className="font-display text-3xl tracking-wider">
              LIFTLOG
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl md:text-6xl tracking-tight">
              WELCOME<br />BACK.
            </h1>
            <p className="mt-4 text-muted-foreground">
              The iron is waiting.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}
            
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

            {fieldErrors.email && (
              <p className= "text-xs text-red-500">
                {fieldErrors.email}
              </p>
            )}
          </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot?
                </Link>
              </div>

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

            <Button
              type="submit"
              disabled ={isSubnitting}
              className="w-full h-16 text-sm uppercase tracking-widest font-medium mt-8"
            >
              {isSubnitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-12 text-center text-sm text-muted-foreground">
            New to LiftLog?{" "}
            <Link
              href="/sign-up"
              className="uppercase tracking-widest text-foreground hover:underline underline-offset-4"
            >
              Create Account
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
