import axios from "axios";
export async function getStreamsByGameName(gameName: string, limit: number = 10) {
    try {
        const token = process.env.TWITCH_ACCESS_TOKEN;
        const clientId = process.env.TWITCH_CLIENT_ID;

        // First, search for the game on Twitch
        const gameSearchResponse = await axios(
            `https://api.twitch.tv/helix/search/categories?query=${encodeURIComponent(gameName)}&first=1`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${token}`,
                },
            }
        );


        const gameData =  gameSearchResponse.data;

        if (!gameData.data || gameData.data.length === 0) {
            return [];
        }

        const gameId = gameData.data[0].id;

        // Get streams for this game
        const streamsResponse = await axios(
            `https://api.twitch.tv/helix/streams?game_id=${gameId}&first=${limit}`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        console.log(streamsResponse.data)


        const streamsData =  streamsResponse.data;

        // Get user info for each stream
        if (streamsData.data.length > 0) {
            const userIds = streamsData.data.map((stream: any) => stream.user_id);
            const usersResponse = await axios(
                `https://api.twitch.tv/helix/users?${userIds.map((id: string) => `id=${id}`).join('&')}`,
                {
                    headers: {
                        'Client-ID': clientId,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const usersData =  usersResponse.data;
            const usersMap = new Map(usersData.data.map((user: any) => [user.id, user]));

            // Combine stream and user data
            return streamsData.data.map((stream: any) => ({
                ...stream,
                user: usersMap.get(stream.user_id),
            }));
        }

        return streamsData.data;
    } catch (error) {
        console.error('Error fetching Twitch streams:', error);
        return [];
    }
}