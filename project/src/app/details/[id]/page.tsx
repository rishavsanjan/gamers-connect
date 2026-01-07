import { getGameDetails, getGameDlcs, getGameName } from '@/lib/igdb';
import React from 'react'
import { Game } from '@/app/types/game';
import LeftSide from '@/components/game-details/left';
import RightSide from '@/components/game-details/right';
import GameStreams from '@/components/GameStreams';
import Link from 'next/link';
import SimilarDlcGameList from '@/components/SimilarDlcGameList';
import { Metadata } from 'next';



export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { id } = params;
  const game: Game = await getGameName(id);

  return {
    title: game?.name
      ? `${game.name}`
      : "Game Details",
  };
}

const GameDetails = async ({ params }: { params: { id: string } }) => {

  const { id } = await params;
  const game: Game = await getGameDetails(id);
  const imgUrl = game.cover?.url
    ? `https:${game.cover.url.replace("t_thumb", "t_screenshot_med")}`
    : "/placeholder.jpg";
  const allGames = await getGameDlcs(id);
  let gamesInFranchise;
  let dlcs;
  if (allGames?.franchises?.length || 0 > 0) {
    gamesInFranchise = allGames?.franchises[0].games.filter((game: Game) =>
      game.game_type?.id === 0
    ) || [];

    dlcs = allGames.franchises[0].games.filter((game: Game) =>
      game.game_type?.id === 2
    );
  }


  return (
    <div className='flex flex-col'>
      {/* Hero Section with Background Image */}
      <div className='relative w-full flex flex-col justify-center items-center gap-4 sm:gap-6 z-0'>
        <img
          src={`${imgUrl}`}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/60 sm:bg-black/50 backdrop-blur-sm"></div>

        {/* Breadcrumb Navigation */}
        <nav className='text-xs sm:text-sm font-extralight text-gray-300 z-100 self-start ml-4 sm:ml-6 md:ml-8 mt-3 sm:mt-4 px-2 sm:px-0'>
          <Link href={'/'}>
            <span className='hover:cursor-pointer hover:text-white transition-colors'>HOME</span>
          </Link>
          <span className='mx-1'>/</span>
          <span className='hover:cursor-pointer hover:text-white transition-colors'>GAME</span>
          <span className='mx-1'>/</span>
          <span className='text-white truncate inline-block max-w-[150px] sm:max-w-none align-bottom'>
            {game.name}
          </span>
        </nav>

        {/* Main Content: Left and Right Sides */}
        <div className='flex flex-col md:flex-row justify-between w-full'>
          <LeftSide game={game} />
          <RightSide game={game} />
        </div>
      </div>

      {/* DLC Section */}
      {dlcs?.length > 0 && (
        <section className="px-2 py-6 sm:py-8 overflow-visible">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">DLC's</h2>
          <SimilarDlcGameList gamesList={dlcs} />
        </section>
      )}

      {/* Franchise Games Section */}
      {gamesInFranchise?.length > 0 && (
        <section className="px-2 py-6 sm:py-8 overflow-visible">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            More Games in the Franchise
          </h2>
          <SimilarDlcGameList gamesList={gamesInFranchise} />
        </section>
      )}

      {/* Similar Games Section */}
      {game.similar_games?.length > 0 && (
        <section className="px-2 py-6 sm:py-8 overflow-visible">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Similar Games</h2>
          <SimilarDlcGameList gamesList={game.similar_games} />
        </section>
      )}

      {/* Game Streams Section */}
      <section className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <GameStreams gameName={game.name} />
      </section>
    </div>
  )
}

export default GameDetails