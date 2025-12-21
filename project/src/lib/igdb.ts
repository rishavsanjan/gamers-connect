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
        `fields name, summary, storyline, total_rating, cover.url, genres.name, platforms.name, screenshots.url, videos.video_id, first_release_date, rating_count, involved_companies.company.name, language_supports.language.name, videos, platforms.url, websites.url, websites.type, similar_games, similar_games.name, similar_games.summary, similar_games.total_rating,similar_games.total_rating_count,similar_games.rating,similar_games.rating_count,similar_games.cover.url,similar_games.first_release_date,similar_games.platforms.name,similar_games.platforms.platform_logo.url, similar_games.summary,similar_games.genres.name, game_type.type, game_type.id, similar_games.videos, similar_games.videos.video_id;
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

export async function getGameDlcs(id: string) {
    const response = await axios.post(
        "https://api.igdb.com/v4/games",
        `fields franchises.games.name, franchises.games.summary, franchises.games.total_rating, franchises.games.total_rating_count, franchises.games.rating, franchises.games.rating_count, franchises.games.cover.url, franchises.games.first_release_date, franchises.games.platforms.name, franchises.games.platforms.platform_logo.url, franchises.games.summary, franchises.games.genres.name, franchises.games.game_type.type, franchises.games.videos, franchises.games.videos.video_id;
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

export async function anticipatedGames() {
    const now = Math.floor(Date.now() / 1000);
    const threeDaysLater = now + 3 * 24 * 60 * 60;

    const query = `
    fields name, cover.url, first_release_date, hypes, follows, total_rating, total_rating_count, summary, genres.name, platforms.name;
    sort hypes desc;
    where hypes != null 
      & first_release_date >= ${now} 
      & first_release_date <= ${threeDaysLater};
    limit 4;
  `;

    const response = await axios.post("https://api.igdb.com/v4/games", query, {
        headers: {
            "Client-ID": CLIENT_ID,
            "Authorization": `Bearer ${TOKEN}`,
            "Accept": "application/json",
        },
    });

    return response.data;
}


export async function getUpcomingEvents() {
    const now = Math.floor(Date.now() / 1000);

    const query = `
    fields checksum,created_at,description,end_time,event_logo,event_networks,games,live_stream_url,name,slug,start_time,time_zone,updated_at,videos, event_logo.url, event_networks.url;
    sort start_time asc;
    where start_time >= ${now};
    limit 10;
  `;

    const response = await axios.post("https://api.igdb.com/v4/events", query, {
        headers: {
            "Client-ID": CLIENT_ID,
            "Authorization": `Bearer ${TOKEN}`,
            "Accept": "application/json",
        },
    });

    return response.data;
}

export async function getPopularRightNow() {
    const now = Math.floor(Date.now() / 1000);

    const query = `
    fields checksum,created_at,description,end_time,event_logo,event_networks,games,live_stream_url,name,slug,start_time,time_zone,updated_at,videos, event_logo.url, event_networks.url;
    sort start_time asc;
    where start_time >= ${now};
    limit 10;
  `;

    const response = await axios.post("https://api.igdb.com/v4/events", query, {
        headers: {
            "Client-ID": CLIENT_ID,
            "Authorization": `Bearer ${TOKEN}`,
            "Accept": "application/json",
        },
    });

    return response.data;
}

export async function getFranchises() {
    const now = Math.floor(Date.now() / 1000);

    const query = `
    fields checksum,created_at,games,name,slug,updated_at,url;
    
  `;

    const response = await axios.post("https://api.igdb.com/v4/franchises", query, {
        headers: {
            "Client-ID": CLIENT_ID,
            "Authorization": `Bearer ${TOKEN}`,
            "Accept": "application/json",
        },
    });

    return response.data;
}


export async function getCollections() {
    const now = Math.floor(Date.now() / 1000);

    const query = `
   fields as_child_relations,as_parent_relations,checksum,created_at,games,name,slug,type,updated_at,url;
  `;

    const response = await axios.post("https://api.igdb.com/v4/collections", query, {
        headers: {
            "Client-ID": CLIENT_ID,
            "Authorization": `Bearer ${TOKEN}`,
            "Accept": "application/json",
        },
    });

    return response.data;
}






