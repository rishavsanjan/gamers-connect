import { getGameDetails, getGameDlcs } from '@/lib/igdb';
import React from 'react'
import { Game } from '@/app/types/game';
import LeftSide from '@/components/game-details/left';
import RightSide from '@/components/game-details/right';
import GamesList from '@/components/GamesList';
import { getStreamsByGameName } from '@/lib/streams';
import GameStreams from '@/components/GameStreams';
interface GameDetailProps {
  params: { id: string };

}



const GameDetails: React.FC<GameDetailProps> = async ({ params }) => {
  const { id } = params;
  const game: Game = await getGameDetails(id);
  const imgUrl = game.cover?.url
    ? `https:${game.cover.url.replace("t_thumb", "t_screenshot_med")}`
    : "/placeholder.jpg";
  const allGames = await getGameDlcs(id);
  const gamesInFranchise = allGames.franchises[0].games.filter((game: Game) =>
    game.game_type?.id === 0
  );

  const dlcs = allGames.franchises[0].games.filter((game: Game) =>
    game.game_type?.id === 2
  );

  console.log(dlcs)
  return (
    <div className='flex flex-col'>
      <div className='relative md:h-screen w-full flex flex-col justify-center items-center gap-6 z-0'>
        <img
          src={`${imgUrl}`}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0 md:flex hidden"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <span className='text-xs font-extralight text-gray-300 z-100 self-start ml-8 mt-4'> <span className='hover:cursor-pointer hover:text-white'>HOME</span> / <span className='hover:cursor-pointer hover:text-white'>GAME</span> / {game.name}</span>
        <div className='flex md:flex-row flex-col justify-between '>
          <LeftSide game={game} />
          <RightSide game={game} />

        </div>


      </div>
      <div className="p-4 overflow-visible pt-8">

        {
          dlcs?.length > 0 &&
          <>
            <h1 className="text-3xl font-bold text-white">DLC's</h1>
            <GamesList gamesList={dlcs} />
          </>

        }

      </div>
      <div className="p-4 overflow-visible pt-8">

        {
          gamesInFranchise?.length > 0 &&
          <>
            <h1 className="text-3xl font-bold text-white">More Games in the franchise</h1>
            <GamesList gamesList={gamesInFranchise} />
          </>

        }

      </div>
      <div className="p-4 overflow-visible pt-8">
        <h1 className="text-3xl font-bold text-white">Similar Games</h1>
        <GamesList gamesList={game.similar_games} />
      </div>
      <div>
        <GameStreams gameName={game.name} />
      </div>
    </div>



  )
}

export default GameDetails