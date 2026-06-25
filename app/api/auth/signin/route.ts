import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

type SigninErrors = {
    email?: string
    password?: string
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const email = String(body.email ?? "").trim().toLowerCase()
        const password = String(body.password ?? "")

        const errors: SigninErrors = {}

        if (!email) {
            errors.email = "メールアドレスを入力してください。"
        } else if (!isValidEmail(email)) {
            errors.email = "メールアドレスの形式が正しくありません。"
        }

        if (!password) {
            errors.password = "パスワードを入力してください。"
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json(
                {
                    message: "入力内容を確認してください。",
                    errors,
                },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return NextResponse.json(
                {
                    message: "メールアドレスまたはパスワードが違います。",
                },
                { status: 401 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
        
        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    message: "メールアドレスまたはパスワードが違います。",
                },
                { status: 401}
            )
        }

        await createSession(user.id)

        return NextResponse.json({
            message: "Signed in.",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                message: "ログインに失敗しました。",
            },
            { status: 500 }
        )
    }
}