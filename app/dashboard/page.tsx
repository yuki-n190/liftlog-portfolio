"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Dumbbell, ChevronRight, Flame, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Show up. Lift clean. Leave stronger.",
  "Small reps become big changes.",
  "Discipline beats motivation.",
  "The iron keeps receipts.",
  "Train like your future self is watching.",
  "Progress is built one set at a time.",
  "No wasted reps. No fake effort.",
  "Strength is logged before it is noticed.",
  "Earn the next session.",
]

type DashboardWorkout = {
  id: string
  name: string
  weight: string
  weightValue: number
  reps: number
  setsCount: number
  sets: string
  rest: number | null
  volume: number
  tag: string
  memo: string
  createdAt: string
  date: string
}

function formatRest(rest: number | null | undefined) {
  if (rest === null || rest === undefined) {
    return "Rest not set"
  }

  if (rest >= 60 && rest % 60 === 0) {
    return `Rest ${rest / 60} min`
  }

  return `Rest ${rest} sec`
}

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export default function DashboardPage() {
  const router = useRouter()

  const [exercise, setExercise] = useState("")
  const [weight, setWeight] = useState("")
  const [reps, setReps] = useState("")
  const [sets, setSets] = useState("")
  const [rest, setRest] = useState("")
  const [restUnit, setRestUnit] = useState<"seconds" | "minutes">("seconds")
  const [tag, setTag] = useState("")
  const [memo, setMemo] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSuccessVisible, setIsSuccessVisible] = useState(false)
  const [workouts, setWorkouts] = useState<DashboardWorkout[]>([])
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts", {
          cache: "no-store",
        })

        if (!response.ok) {
          setError("ワークアウトの取得に失敗しました")
          return
        }

        const data = await response.json()

        const formattedWorkouts = data.workouts.map((workout: any) => ({
          id: workout.id,
          name: workout.exerciseName,
          weight: `${workout.weight}kg`,
          weightValue: workout.weight,
          reps: workout.reps,
          setsCount: workout.sets,
          sets: `${workout.reps}×${workout.sets}`,
          rest: workout.rest,
          volume: workout.weight * workout.reps * workout.sets,
          tag: workout.tag || "",
          memo: workout.memo || "",
          createdAt: workout.createdAt,
          date: new Date(workout.createdAt).toLocaleDateString("ja-JP"),
        }))

        setWorkouts(formattedWorkouts)
      } catch (error) {
        console.error(error )
        setError("ワークアウトの取得中にエラーが発生しました")
      }
    }

    fetchWorkouts()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        })

        if (!response.ok) {
          router.push("/sign-in")
          router.refresh()
          return
        }


        setIsCheckingAuth(false)
      } catch (error) {
        console.error(error)
        router.push("/sign-in")
        router.refresh()
      }
    }

    checkAuth()
  }, [router])

  //APIでRDSに保存処理
  const handleSaveWorkout = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  // 入力チェック
  if (exercise.trim() === "") {
    setError("エクササイズ名を入力してください！")
    return
  }

  if (weight.trim() === "") {
    setError("重量を入力してください！")
    return
  }

  if (reps.trim() === "") {
    setError("レップ数を入力してください！")
    return
  }

  if (sets.trim() === "") {
    setError("セット数を入力してください！")
    return
  }

  setError("")

  try {
    const restInSeconds = 
      rest.trim() === ""
        ? ""
        : restUnit === "minutes"
          ? String(Number(rest) * 60)
          : rest

    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exerciseName: exercise,
        weight,
        reps,
        sets,
        rest: restInSeconds,
        tag,
        memo,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      setError(data.message || "保存に失敗しました")
      return
    }

    const data = await response.json()

    const savedWorkout = data.workout

    const newWorkout = {
      id: savedWorkout.id,
      name: savedWorkout.exerciseName,
      weight: `${savedWorkout.weight}kg`,
      weightValue: savedWorkout.weight,
      reps: savedWorkout.reps,
      setsCount: savedWorkout.sets,
      sets: `${savedWorkout.reps}×${savedWorkout.sets}`,
      rest: savedWorkout.rest,
      volume: savedWorkout.weight * savedWorkout.reps * savedWorkout.sets,
      tag: savedWorkout.tag || "",
      memo: savedWorkout.memo || "",
      createdAt: savedWorkout.createdAt,
      date: "Today",
    }

    setWorkouts([
      newWorkout,
      ...workouts,
    ])

    setExercise("")
    setWeight("")
    setReps("")
    setSets("")
    setRest("")
    setRestUnit("seconds")
    setTag("")
    setMemo("")
    setSuccessMessage("Workout saved!")
    setIsSuccessVisible(true)

    setTimeout(() => {
      setIsSuccessVisible(false)

      setTimeout(() => {
        setSuccessMessage("")
      }, 300)
    }, 2500)
  } catch (error) {
    console.error(error)
    setError("予期しないエラーが発生しました")
  }
}

  //記録削除機能
  //指定されたID以外のworkoutだけ残して、一覧を更新する
//ダッシュボードページから削除は違和感なのでhandledeleteworkoutは削除

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error(error)
      setError("ログアウトに失敗しました")
    }
  }

  const today = new Date()
  const quoteIndex =
    today.getFullYear() +
    today.getMonth() +
    today.getDate()
  
  const todayQuote = motivationalQuotes[quoteIndex % motivationalQuotes.length]
  
  const totalWorkouts = workouts.length

  const recentVisibleWorkouts = workouts.slice(0, 5)

  const now = new Date()

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  
  const thisWeekWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.createdAt)
    return workoutDate >= startOfWeek
  })

  const thisWeekCount = thisWeekWorkouts.length

  const workoutDateKeys = new Set(
    workouts.map((workout) => getDateKey(new Date(workout.createdAt)))
  )

  let currentStreak = 0
  const streakDate = new Date()

  while (workoutDateKeys.has(getDateKey(streakDate))) {
    currentStreak += 1
    streakDate.setDate(streakDate.getDate() - 1)
  }

  const personalRecords = Object.values(
    workouts.reduce<Record<string, DashboardWorkout>>((records, workout) => {
      const currentRecord = records[workout.name]

      if (!currentRecord || workout.weightValue > currentRecord.weightValue) {
        records[workout.name] = workout
      }

      return records
    }, {})
  )
    .sort((a, b) => b.weightValue - a.weightValue)
    .slice(0, 3)

  if (isCheckingAuth) {
    return (
      <main className="min-h-screed flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Checking authentication...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="font-display text-xl tracking-wider">
            LIFTLOG
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/workouts"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              My Workouts
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5"/>
            </button>   
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Welcome back</p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">
            TIME TO WORK.
          </h1>
        </section>

        {/* Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quote & AI Coach */}
          <div className="space-y-6 lg:col-span-1">
            {/* Motivational Quote Card */}
            <div className="bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Daily Fuel</p>
              </div>
              <blockquote className="font-display text-2xl md:text-3xl leading-tight tracking-tight">
                &quot;{todayQuote}&quot;
              </blockquote>
            </div>

            {/* AI Coach Card */}
            <div className="bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI Coach</p>
              </div>
              <p className="font-display text-2xl tracking-tight">
                Coming Soon
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Personalized feedback based on your workout history.
              </p>

              <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                Planned Feature
              </p>
            </div>

            {/* Progress Summary Card */}
            <div className="bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Training Summary</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <span className="font-display text-3xl md:text-4xl">
                    {thisWeekCount}
                  </span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    Workouts
                  </p>
                </div>

                <div className="text-center">
                  <span className="font-display text-3xl md:text-4xl">
                    {currentStreak}
                  </span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    Streak
                  </p>
                </div>

                <div className="text-center">
                  <span className="font-display text-3xl md:text-4xl">
                    {totalWorkouts}
                  </span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    Total Logs
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Quick Log */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Log Workout</p>
              </div>

              <form className="space-y-5" onSubmit={handleSaveWorkout} noValidate>
                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}
                {successMessage && (
                  <div
                    className={`rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 transition-opacity duration-300 ${
                      isSuccessVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {successMessage}
                  </div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="exercise"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Exercise
                  </Label>
                  <Input
                    id="exercise"
                    type="text"
                    placeholder="Bench Press"
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                    className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="weight"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      Weight
                    </Label>
                    <Input
                      id="weight"
                      type="text"
                      inputMode="decimal"
                      placeholder="185"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="reps"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      Reps
                    </Label>
                    <Input
                      id="reps"
                      type="text"
                      inputMode="numeric"
                      placeholder="8"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="sets"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      Sets
                    </Label>
                    <Input
                      id="sets"
                      type="text"
                      inputMode="numeric"
                      placeholder="4"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                      className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_120px] gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="rest"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      Rest
                    </Label>
                    <Input
                      id="rest"
                      type="text"
                      inputMode="numeric"
                      placeholder="180"
                      value={rest}
                      onChange={(e) => setRest(e.target.value)}
                      className="h-14 bg-input border-border text-base px-4 placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Unit
                    </Label>
                    <Select
                      value={restUnit}
                      onValueChange={(value) =>
                        setRestUnit(value as "seconds" | "minutes")
                      }
                    >
                      <SelectTrigger className="h-14 bg-input border-border text-base px-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="seconds">sec</SelectItem>
                        <SelectItem value="minutes">min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tag"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Tag
                  </Label>
                  <Select value={tag} onValueChange={setTag}>
                    <SelectTrigger className="h-14 bg-input border-border text-base px-4">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="chest">Chest</SelectItem>
                      <SelectItem value="back">Back</SelectItem>
                      <SelectItem value="legs">Legs</SelectItem>
                      <SelectItem value="shoulders">Shoulders</SelectItem>
                      <SelectItem value="arms">Arms</SelectItem>
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="memo"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Notes
                  </Label>
                  <Textarea
                    id="memo"
                    placeholder="How did it feel?"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="min-h-[80px] bg-input border-border text-base px-4 py-3 placeholder:text-muted-foreground/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-sm uppercase tracking-widest font-medium"
                >
                  Save Workout
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column - Recent Workouts */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Recent Workouts</p>
                <Link
                  href="/workouts"
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {workouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No workouts yet. Log your first workout.
                  </p>
                ) : (
                  recentVisibleWorkouts.map((workout) => (
                    <Link
                      key={workout.id}
                      href={`/workouts/${workout.id}`}
                      className="group flex items-center justify-between py-4 border-b border-border last:border-0 hover:text-foreground transition-colors"
                    >
                      <div>
                        <h3 className="font-display text-xl tracking-tight">
                          {workout.name}
                        </h3>
              
                        <p className="text-sm text-muted-foreground mt-1">
                          {workout.weight} · {workout.sets}
                          {workout.rest !== null && workout.rest !== undefined
                            ? ` · ${formatRest(workout.rest)}`
                            : ""}
                        </p>
                      </div>
              
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                          {workout.date}
                        </span>
              
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Quick Stats Below Workouts */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                  Personal Records
                </p>
              
                {personalRecords.length === 0 ? (
                  <div className="rounded-md border border-border bg-background/40 p-4">
                    <p className="font-display text-xl tracking-tight">
                      No records yet
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Log workouts to track your best lifts.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {personalRecords.map((record) => (
                      <Link
                        key={record.id}
                        href={`/workouts/${record.id}`}
                        className="flex justify-between items-center rounded-md border border-border bg-background/40 p-3 hover:border-muted-foreground/40 transition-colors"
                      >
                        <span className="text-sm text-muted-foreground">
                          {record.name}
                        </span>
                        <span className="font-display text-lg">
                          {record.weightValue}kg
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
