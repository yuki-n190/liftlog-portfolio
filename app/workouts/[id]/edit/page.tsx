import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { WorkoutEditForm } from "@/components/workout-edit-form"

type EditWorkoutPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EditWorkoutPage({
    params,
}: EditWorkoutPageProps) {
    const { id } = await params
    
    const user = await getCurrentUser()

    if (!user) {
      redirect("/sign-in")
    }

    const workout = await prisma.workoutLog.findFirst({
        where: {
            id,
            userId: user.id
        },
    })

    if (!workout) {
        notFound()
    }

    return (
    <main className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="font-display text-xl tracking-wider">
            LIFTLOG
          </Link>

          <Link
            href={`/workouts/${workout.id}`}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Detail
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-6 pt-12">
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Edit Workout
          </p>

          <h1 className="font-display text-5xl md:text-7xl tracking-tight">
            {workout.exerciseName}
          </h1>
        </section>

        <WorkoutEditForm workout={workout} />
      </div>
    </main>
  )
}