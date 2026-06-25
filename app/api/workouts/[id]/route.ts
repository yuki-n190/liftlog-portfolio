import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateWorkoutInput } from "@/lib/validations/workout"
import { FieldError } from "@/components/ui/field"

export const dynamic = "force-dynamic"

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const existingWorkout = await prisma.workoutLog.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existingWorkout) {
      return NextResponse.json(
        { message: "Workout not found." },
        { status: 404 }
      )
    }

    await prisma.workoutLog.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      message: "Workout deleted.",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        message: "Failed to delete workout.",
        error: String(error),
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params
    const body = await request.json()

    const validation = validateWorkoutInput(body)

    if (!validation.ok) {
      return NextResponse.json(
        {
          messsage: validation.message,
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

    const existingWorkout = await prisma.workoutLog.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existingWorkout) {
      return NextResponse.json(
        { message: "Workout not found." },
        { status: 404 }
      )
    }

    const workout = await prisma.workoutLog.update({
      where: {
        id,
      },
      data: {
      exerciseName: validation.data.exerciseName,
      weight: validation.data.weight,
      reps: validation.data.reps,
      sets: validation.data.sets,
      rest: validation.data.rest,
      tag: validation.data.tag,
      memo: validation.data.memo,
      },
      })

    return NextResponse.json({
      message: "Workout updated.",
      workout,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        message: "Failed to update workout.",
        error: String(error),
      },
      { status: 500 }
    )
  }
}