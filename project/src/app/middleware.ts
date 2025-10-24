import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function middleware(req: Request) {
    const session = await auth();
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/private") && session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.next()
}

export const config = {
    matcher: ["/api/private/:path*"],
}