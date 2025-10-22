import axios from "axios";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TOKEN = process.env.TWITCH_ACCESS_TOKEN;

export async function getTrendingGames() {
    const url = "https://api.igdb.com/v4/games";
    const nowInSeconds = Math.floor(Date.now() / 1000);


    const body = `
    fields name, total_rating, hypes, follows, cover.url, first_release_date, rating_count	, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name, videos, videos.video_id;
    sort hypes desc;
    where hypes > 0 & first_release_date <= ${nowInSeconds};
    limit 10;

  `;

    try {
        const response = await axios.post(url, body, {
            headers: {
                "Client-ID": CLIENT_ID!,
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("IGDB API Error:", error);
        return [];
    }
}


export async function getTopGamesOfAllTime() {
    const url = "https://api.igdb.com/v4/games";

    const body = `
    fields name, total_rating, total_rating_count, rating, rating_count, cover.url, first_release_date, platforms.name, platforms.platform_logo.url, storyline, summary, genres.name ,videos, videos.video_id;
    sort total_rating desc;
    where total_rating_count > 50 & total_rating != null;
    limit 10;
  `;

    try {
        const response = await axios.post(url, body, {
            headers: {
                "Client-ID": CLIENT_ID!,
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("IGDB API Error:", error);
        return [];
    }
}

export async function getGameDetails(id: string) {
    const response = await axios.post(
        "https://api.igdb.com/v4/games",
        `fields name, summary, storyline, total_rating, cover.url, genres.name, platforms.name, screenshots.url, videos.video_id, first_release_date, rating_count, involved_companies.company.name, language_supports.language.name, videos, platforms.url, websites.url, websites.type, similar_games, similar_games.name, similar_games.summary, similar_games.total_rating,similar_games.total_rating_count,similar_games.rating,similar_games.rating_count,similar_games.cover.url,similar_games.first_release_date,similar_games.platforms.name,similar_games.platforms.platform_logo.url, similar_games.summary,similar_games.genres.name, franchises.games.name, franchises.games.summary, franchises.games.total_rating,franchises.games.total_rating_count,franchises.games.rating,franchises.games.rating_count,franchises.games.cover.url,franchises.games.first_release_date,franchises.games.platforms.name,franchises.games.platforms.platform_logo.url, franchises.games.summary,franchises.games.genres.name;
     where id = ${id};`,
        {
            headers: {
                "Client-ID": CLIENT_ID!,
                "Authorization": `Bearer ${TOKEN}`,
            },
        }
    );
    return response.data[0];
}

