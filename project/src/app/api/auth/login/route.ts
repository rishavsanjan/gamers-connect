import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { error } from "console";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!;
export async function POST(req: any) {
    try {
        const body = await req.json();
        const { email, password } = body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        console.log(email)

        if (!user) {
            return NextResponse.json({ error: 'User does not exist' })
        }

        const isValid = await bcrypt.compare(password, user.password!);
        if (!isValid) {
            return NextResponse.json({ error: 'Inavalid password!' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET
        )

        if (user) {
            return NextResponse.json({ user, token , success:true});
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}