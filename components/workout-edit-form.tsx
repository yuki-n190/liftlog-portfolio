"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type WorkoutEditFormProps = {
  workout: {
    id: string
    exerciseName: string
    weight: number
    reps: number
    sets: number
    rest: number | null
    tag: string | null
    memo: string | null
  }
}

export function WorkoutEditForm({ workout }: WorkoutEditFormProps) {
  const router = useRouter()

  const initialRestUnit =
    workout.rest !== null && workout.rest % 60 === 0
      ? "minutes"
      : "seconds"

  const initialRest =
    workout.rest === null
      ? ""
      : initialRestUnit === "minutes"
        ? String(workout.rest / 60)
        : String(workout.rest)

  const [exerciseName, setExerciseName] = useState(workout.exerciseName)
  const [weight, setWeight] = useState(String(workout.weight))
  const [reps, setReps] = useState(String(workout.reps))
  const [sets, setSets] = useState(String(workout.sets))
  const [rest, setRest] = useState(initialRest)
  const [restUnit, setRestUnit] = useState<"seconds" | "minutes">(
    initialRestUnit
  )
  const [tag, setTag] = useState(workout.tag || "")
  const [memo, setMemo] = useState(workout.memo || "")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (exerciseName.trim() === "") {
      setError("エクササイズ名を入力してください")
      return
    }

    if (weight.trim() === "") {
      setError("重量を入力してください")
      return
    }

    if (reps.trim() === "") {
      setError("レップ数を入力してください")
      return
    }

    if (sets.trim() === "") {
      setError("セット数を入力してください")
      return
    }

    const restInSeconds =
      rest.trim() === ""
        ? ""
        : restUnit === "minutes"
          ? String(Number(rest) * 60)
          : rest

    setError("")
    setSuccessMessage("")
    setIsSaving(true)

    try {
      const response = await fetch(`/api/workouts/${workout.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseName,
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
        setError(data.message || "更新に失敗しました")
        return
      }

      setSuccessMessage("Workout updated!")

      router.push(`/workouts/${workout.id}`)
      router.refresh()
    } catch (error) {
      console.error(error)
      setError("更新中にエラーが発生しました")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="text-sm text-green-500">
          {successMessage}
        </p>
      )}

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Exercise
        </label>
        <Input
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="Bench Press"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Weight
          </label>
          <Input
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="67.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Reps
          </label>
          <Input
            type="text"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Sets
          </label>
          <Input
            type="text"
            inputMode="numeric"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="4"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_120px] gap-3">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Rest
          </label>
          <Input
            type="text"
            inputMode="numeric"
            value={rest}
            onChange={(e) => setRest(e.target.value)}
            placeholder="180"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Unit
          </label>
          <Select
            value={restUnit}
            onValueChange={(value) =>
              setRestUnit(value as "seconds" | "minutes")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">sec</SelectItem>
              <SelectItem value="minutes">min</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Tag
        </label>
        <Input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Chest"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Memo
        </label>
        <Textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="今日のメモ"
        />
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="h-14 w-full text-xs uppercase tracking-widest"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}