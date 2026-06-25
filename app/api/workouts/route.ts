import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateWorkoutInput } from "@/lib/validations/workout"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = validateWorkoutInput(body)

    if (!validation.ok) {
      return NextResponse.json(
        {
          message: validation.message,
          fieldErrors: validation.fieldErrors,
        },
        { status: 400 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const workout = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        exerciseName: validation.data.exerciseName,
        weight: validation.data.weight,
        reps: validation.data.reps,
        sets: validation.data.sets,
        rest: validation.data.rest,
        tag: validation.data.tag,
        memo: validation.data.memo,
      },
    })

    return NextResponse.json(
      {
        message: "Workout created.",
        workout,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        message: "Failed to create workout.",
        error: String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const workouts = await prisma.workoutLog.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ workouts })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        message: "Failed to fetch workouts.",
        error: String(error),
      },
      { status: 500 }
    )
  }
}