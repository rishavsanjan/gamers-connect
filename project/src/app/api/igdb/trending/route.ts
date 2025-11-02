import { NextResponse } from "next/server";
import axios from "axios";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TOKEN = process.env.TWITCH_ACCESS_TOKEN!;

export async function POST(req: Request) {
    const { page = 1, limit = 10 } = await req.json();
    const offset = (page - 1) * limit;

    const url = "https://api.igdb.com/v4/games";
    const nowInSeconds = Math.floor(Date.now() / 1000);


    const body = `
    fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;
    sort hypes desc;
    where hypes > 0 & first_release_date <= ${nowInSeconds};
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
    } catch (err) {
        console.error("IGDB API Error:", err);
        return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
    }
}
