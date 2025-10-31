import { Game } from "@prisma/client";
export interface RatingTab {
    id: string;
    userId: string;
    gameId: string;
    user_rating: number | null;
    game: Game;
}

export interface MyGameTab {
    id: string;
    userId: string;
    gameId: string;
    game: Game;
    owned_platform: string | null,
    status: string

}

export interface PlaylistTab {
    id: string;
    userId: string;
    gameId: string;
    game: Game;
}

export interface CollectionTab {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
    games: Game[];
}

export interface Stats {
    owned_platform: string,
    status: string
    game: Game
}




export interface ProfileTabsData {
    ratings: RatingTab[];
    mygames: MyGameTab[];
    playlist: PlaylistTab[];
    collection: CollectionTab[];
    stats: Stats[];
    currentlyPlaying:MyGameTab[]
}

