import Link from "next/link"
import { ArrowLeft, Dumbbell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default async function WorkoutsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const workouts = await prisma.workoutLog.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-display text-xl tracking-wider">
            LIFTLOG
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-6 pt-12">
        {/* Page Title */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Your History
          </p>

          <h1 className="font-display text-5xl md:text-6xl tracking-tight">
            MY WORKOUTS
          </h1>

          <p className="mt-3 text-lg text-muted-foreground">
            Log every set. Build visible progress.
          </p>
        </section>

        {/* Workout List */}
        {workouts.length > 0 ? (
          <div className="space-y-4">
            {workouts.map((workout) => {
              const volume = workout.weight * workout.sets * workout.reps

              return (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className="group block bg-card border border-border p-6 transition-colors hover:border-foreground"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Name + Stats */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="font-display text-2xl md:text-3xl tracking-tight truncate">
                          {workout.exerciseName}
                        </h2>

                        {workout.tag && (
                          <Badge
                            variant="secondary"
                            className="uppercase tracking-widest text-[10px] shrink-0"
                          >
                            {workout.tag}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span>
                          <span className="text-foreground font-medium">
                            {workout.weight}kg
                          </span>{" "}
                          weight
                        </span>

                        <span>
                          <span className="text-foreground font-medium">
                            {workout.sets}x{workout.reps}
                          </span>{" "}
                          sets/reps
                        </span>

                        <span>
                          <span className="text-foreground font-medium">
                            {volume}kg
                          </span>{" "}
                          volume
                        </span>
                      </div>

                      {workout.memo && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {workout.memo}
                        </p>
                      )}
                    </div>

                    {/* Right: Date */}
                    <span className="text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap shrink-0">
                      {workout.createdAt.toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border">
            <Dumbbell className="h-10 w-10 text-muted-foreground mb-4" />

            <p className="font-display text-2xl tracking-tight mb-2">
              NO WORKOUTS FOUND
            </p>

            <p className="text-sm text-muted-foreground">
              There are no workout logs in the database yet.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}