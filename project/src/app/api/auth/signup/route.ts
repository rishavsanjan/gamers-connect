import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = body;

        const existigUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existigUser) {
            return NextResponse.json({ error: 'User already exits' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = await prisma.user.create({
            data: {
                username, email, password: hashedPassword
            }
        })

        return NextResponse.json({ createUser });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}