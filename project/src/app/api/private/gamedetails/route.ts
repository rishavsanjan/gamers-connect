import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import axios from "axios";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TOKEN = process.env.TWITCH_ACCESS_TOKEN!;

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();
        const response = await axios.post(
            "https://api.igdb.com/v4/games",
            `fields name, summary, storyline, total_rating, cover.url, genres.name, platforms.name, first_release_date, rating_count, game_type.type, game_type.id;
            where id = ${id};`,
            {
                headers: {
                    "Client-ID": CLIENT_ID!,
                    "Authorization": `Bearer ${TOKEN}`,
                },
            }
        );

        return NextResponse.json({ game: response.data[0] });


    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}