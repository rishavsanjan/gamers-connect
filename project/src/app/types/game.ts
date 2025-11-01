export interface Game {
    id: number,
    hypes: number,
    name: string,
    total_rating: number,
    first_release_date: number,
    platforms: Array<{
        id: number,
        platform: string,
        name: string,
        platform_logo: {
            id: number,
            url: string
        }
    }>,
    cover: {
        id: number,
        url: string
    },
    storyline: string
    summary: string
    genres: Array<{
        id: number
        name: string
    }>
    rating_count: number
    involved_companies: Array<{
        id: number,
        company: {
            id: number,
            name: string
        }
    }>
    language_supports: Array<{
        id: number,
        language: {
            name: string
        }
    }>
    videos: Array<{
        id: number,
        video_id: string
    }>
    screenshots: Array<{
        id: number,
        url: string
    }>
    websites: Array<{
        id: number,
        url: string
        type: number
    }>
    similar_games: Game[],
    franchises: Array<{
        games: Game[]
    }>
    game_type: {
        id: number,
        type: string
    }
    owned_platform: string
    hours_played: number
    status: string
}

export interface ProfileGame {
    id: number,
    name: string,
    first_release_date: number,
    storyline: string
    summary: string
    genres: Array<{
        id: number
        name: string
    }>,
    total_rating: number,
    cover: string
    platforms: Array<{
        id: string,
        name: string,
    }>
    igdb_id: number

}