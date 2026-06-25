import Link from "next/link"
import { ArrowLeft, Pencil, Dumbbell } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { DeleteWorkoutButton } from "@/components/delete-workout-button"

type WorkoutDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
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

  const volume = workout.weight * workout.sets * workout.reps

  // Sticky header reused across both states for consistency
  const header = (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="font-display text-xl tracking-wider">
          LIFTLOG
        </Link>
        <Link
          href="/workouts"
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          My Workouts
        </Link>
      </nav>
    </header>
  )

  function formatRest(rest: number | null) {
    if (rest === null) {
      return "Not set"
    }
  
    if (rest >= 60 && rest % 60 === 0) {
      return `${rest / 60} min`
    }
  
    return `${rest} sec`
  }

  const stats = [
    { label: "Weight", value: `${workout.weight}kg` },
    { label: "Sets", value: workout.sets },
    { label: "Reps", value: workout.reps },
    { label: "Rest", value: formatRest(workout.rest) },
    { label: "Total Volume", value: `${volume}kg` },
  ]

  return (
    <main className="min-h-screen pb-24">
      {header}

      <div className="mx-auto max-w-3xl px-6 pt-12">
        {/* Title block */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            {workout.tag && (
              <Badge
                variant="secondary"
                className="uppercase tracking-widest text-[10px]"
              >
                {workout.tag}
              </Badge>
            )}

            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {workout.createdAt.toLocaleDateString("ja-JP")}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl tracking-tight">
            {workout.exerciseName}
          </h1>
        </section>

        {/* Main stats */}
        <section className="grid grid-cols-2 gap-px bg-border border border-border mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={
                stat.label === "Total Volume"
                  ? "bg-card p-6 col-span-2 text-center"
                  : "bg-card p-6"
              }
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                {stat.label}
              </p>
        
              <p className="font-display text-4xl md:text-5xl tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Memo / Notes */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Notes
          </p>

          <div className="bg-card border border-border p-6">
            <p className="text-lg leading-relaxed text-foreground">
              {workout.memo || "No memo added."}
            </p>
          </div>
        </section>

        {/* Actions - UI only for now */}
        <section className="flex flex-col sm:flex-row gap-4">
          <Button
           asChild
           className="h-14 flex-1 text-xs uppercase tracking-widest gap-2"
           >
            <Link href={`/workouts/${workout.id}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit Workout
            </Link>
          </Button>

          <DeleteWorkoutButton workoutId={workout.id} />
        </section>
      </div>
    </main>
  )
}