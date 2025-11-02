import { NextResponse } from "next/server";
import axios from "axios";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TOKEN = process.env.TWITCH_ACCESS_TOKEN!;

export async function POST(req: Request) {
    const { page = 1, limit = 10 } = await req.json();
    const offset = (page - 1) * limit;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const endOfWeek = Math.floor(sunday.getTime() / 1000);
    const nextWeekStart = endOfWeek + 1;
    const nextWeekEnd = endOfWeek + 7 * 86400;

    const body = `
            fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;

        sort hypes desc; 
        where first_release_date >= ${nextWeekStart} & first_release_date <= ${nextWeekEnd};
        limit ${limit};
        offset ${offset};
  `;

    try {
        const response = await axios.post("https://api.igdb.com/v4/games", body, {
            headers: {
                "Client-ID": CLIENT_ID,
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json",
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
