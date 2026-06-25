type WorkoutFieldErrors = {
  exerciseName?: string
  weight?: string
  reps?: string
  sets?: string
  rest?: string
}

type ValidWorkoutInput = {
  exerciseName: string
  weight: number
  reps: number
  sets: number
  rest: number | null
  tag: string | null
  memo: string | null
}

type ValidateWorkoutResult =
  | {
      ok: true
      data: ValidWorkoutInput
    }
  | {
      ok: false
      message: string
      fieldErrors: WorkoutFieldErrors
    }

function normalizeNumberInput(value: unknown) {
  if (value === null || value === undefined) {
    return ""
  }

  return String(value)
    .trim()
    .replace(/[０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    )
    .replace(/[－ー−]/g, "-")
    .replace(/[．]/g, ".")
}

function toNumber(value: unknown) {
  const normalizedValue = normalizeNumberInput(value)

  if (normalizedValue === "") {
    return null
  }

  const numberValue = Number(normalizedValue)

  if (Number.isNaN(numberValue)) {
    return NaN
  }

  return numberValue
}

export function validateWorkoutInput(body: any): ValidateWorkoutResult {
  const fieldErrors: WorkoutFieldErrors = {}

  const exerciseName = String(body.exerciseName || "").trim()
  const weight = toNumber(body.weight)
  const reps = toNumber(body.reps)
  const sets = toNumber(body.sets)
  const rest = toNumber(body.rest)

  const tag = String(body.tag || "").trim()
  const memo = String(body.memo || "").trim()

  if (!exerciseName) {
    fieldErrors.exerciseName = "種目名を入力してください。"
  }

  if (weight === null) {
    fieldErrors.weight = "重量を入力してください。"
  } else if (Number.isNaN(weight)) {
    fieldErrors.weight = "重量は数字で入力してください。"
  }

  if (reps === null) {
    fieldErrors.reps = "回数を入力してください。"
  } else if (Number.isNaN(reps)) {
    fieldErrors.reps = "回数は数字で入力してください。"
  } else if (!Number.isInteger(reps) || reps < 1) {
    fieldErrors.reps = "回数は1以上の整数で入力してください。"
  }

  if (sets === null) {
    fieldErrors.sets = "セット数を入力してください。"
  } else if (Number.isNaN(sets)) {
    fieldErrors.sets = "セット数は数字で入力してください。"
  } else if (!Number.isInteger(sets) || sets < 1) {
    fieldErrors.sets = "セット数は1以上の整数で入力してください。"
  }

  if (rest !== null) {
    if (Number.isNaN(rest)) {
      fieldErrors.rest = "休憩時間は数字で入力してください。"
    } else if (!Number.isInteger(rest) || rest < 0) {
      fieldErrors.rest = "休憩時間は0以上の整数で入力してください。"
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: "入力内容を確認してください。",
      fieldErrors,
    }
  }

  return {
    ok: true,
    data: {
      exerciseName,
      weight: weight as number,
      reps: reps as number,
      sets: sets as number,
      rest: rest === null ? null : (rest as number),
      tag: tag || null,
      memo: memo || null,
    },
  }
}