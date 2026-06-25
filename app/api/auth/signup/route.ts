import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { stringify } from "querystring";


type SignupErrors = {
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
}
function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const username = String(body.username ?? "").trim()
        const email = String(body.email ?? "").trim().toLocaleLowerCase()
        const password = String(body.password ?? "")
        const confirmPassword = String(body.confirmPassword ?? "")

        const errors: SignupErrors = {}

        if (!username) {
            errors.username = "ユーザー名を入力してください。"
        }

        if (!email) {
            errors.email = "メールアドレスを入力してください。"
        } else if (password.length < 8) {
            errors.password = "パスワードは8文字以上で入力してください。"
        }

        if (!confirmPassword) {
            errors.confirmPassword = "確認用パスワードを入力してください。"
        } else if (password && password !== confirmPassword) {
            errors.confirmPassword = "パスワードが一致しません。"
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

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { 
                    message: "入力内容を確認してください。",
                    errors: {
                        email: "このメールアドレスはすでに使われています。",
                    },
                 },
                { status: 409 }
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        })

        await createSession(user.id)

        return NextResponse.json(
            {
                message: "User created.",
                user,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { message: "ユーザー作成に失敗しました。" },
            { status: 500 }
        )
    }
}