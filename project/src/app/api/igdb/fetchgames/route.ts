// /app/api/igdb/fetchgames/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TOKEN = process.env.TWITCH_ACCESS_TOKEN!;

export async function POST(req: Request) {
    const agent = new https.Agent({
        rejectUnauthorized: false, // bypass SSL verification
    });
    const { page, genreId, category, limit = 10 } = await req.json();

    const offset = (page - 1) * 10;
    let query;
    //let query = `
    //fields name, cover.url, rating, first_release_date, genres.name;
    //limit 10;
    //offset ${offset};
    //sort popularity desc;
    //`;

    if (category === 'last30days') {
        const now = Math.floor(Date.now() / 1000);
        const thirtyDays = 86400 * 30;
        const lastMonth = now - thirtyDays;
        query = `fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;
        sort hypes desc; 
        where first_release_date >= ${lastMonth} & first_release_date <= ${now};
        limit ${limit};
        offset ${offset};`
    } else if (category === 'nextweek') {
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

        query = `
            fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;

        sort hypes desc; 
        where first_release_date >= ${nextWeekStart} & first_release_date <= ${nextWeekEnd};
        limit ${limit};
        offset ${offset};
        `;
    } else if (category === 'thisweek') {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7)); // last Monday
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const startOfWeek = Math.floor(monday.getTime() / 1000);
        const endOfWeek = Math.floor(sunday.getTime() / 1000);

        query = `
       fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;

      sort hypes desc; 
      where first_release_date >= ${startOfWeek} & first_release_date <= ${endOfWeek};
      limit ${limit};
      offset ${offset};
    `;
    } else if (category === 'top250') {
        query = `
          fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;    sort total_rating desc;
          where total_rating_count > 50 & total_rating != null;
          limit ${limit};
          offset ${offset};
        `;
    } else if (category === 'trending') {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        query = `
          fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;
          sort hypes desc;
          where hypes > 0 & first_release_date <= ${nowInSeconds};
         limit ${limit};
          offset ${offset};

        `;
    }

    if (genreId) {
        query = `
          fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;
          sort hypes desc;
          where genres = (${genreId});
          limit 10;
          offset ${offset};
          sort popularity desc;
        `;
    }

    const response = await axios.post(
        "https://api.igdb.com/v4/games",
        query,
        {
            headers: {
                "Client-ID": CLIENT_ID,
                "Authorization": `Bearer ${TOKEN}`,
            },
            httpsAgent: agent,
            timeout: 15000,
        }
    );

    return NextResponse.json(response.data);
}
