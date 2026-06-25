import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose"

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "liftlog_session"

function getAuthSecret() {
    const secret = process.env.AUTH_SECRET

    if (!secret) {
        throw new Error("AUTH_SECRET is not set")
    }

    return new TextEncoder().encode(secret)
}

export async function createSession(userId: string) {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getAuthSecret())
    
    const cookieStore = await cookies()

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV ==="production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()

    cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
        return null
    }

    try {
        const { payload } = await jwtVerify(token, getAuthSecret())
        const userId = payload.userId

        if (typeof userId !== "string") {
            return null
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
            },
        })

        return user
    } catch {
        return null
    }
}