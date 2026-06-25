"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type DeleteWorkoutButtonProps = {
  workoutId: string
}

export function DeleteWorkoutButton({ workoutId }: DeleteWorkoutButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    const confirmed = window.confirm("このワークアウトを削除しますか？")

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        setError("削除に失敗しました")
        return
      }

      router.push("/workouts")
      router.refresh()
    } catch (error) {
      console.error(error)
      setError("削除中にエラーが発生しました")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex-1">
      <Button
        type="button"
        variant="outline"
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-14 w-full text-xs uppercase tracking-widest gap-2 border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:text-red-200 hover:border-red-400/50 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>

      {error && (
        <p className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}