import { NextResponse } from "next/server";
import axios from 'axios';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TOKEN = process.env.TWITCH_ACCESS_TOKEN!;

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query");
    console.log(query)
    if (!query || query.trim() === "") {
        return NextResponse.json([], { status: 200 });
    }

    try {
        const response = await axios.post(
            "https://api.igdb.com/v4/games",
            `
      search "${query}";
      fields name, cover.url, first_release_date, total_rating, genres.name;
      limit 10;
      `,
            {
                headers: {
                    "Client-ID": CLIENT_ID,
                    Authorization: `Bearer ${TOKEN}`,
                    "Accept": "application/json",
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
    }
}