import GamesList from "@/components/GamesList";
import HeroHomepage from "@/components/HeroHomepage";
import { getTopGamesOfAllTime, getTrendingGames } from "@/lib/igdb";
import Image from "next/image";

export default async function Home() {

  const trendingGames = await getTrendingGames();
  const topRated = await getTopGamesOfAllTime();
  return (
    <div className="pb-32">
      <HeroHomepage />
      <div className="p-4 overflow-visible">
        <h1 className="text-3xl font-bold">Trending Games</h1>
        <GamesList gamesList={trendingGames} />
      </div>
      <div className="p-4 overflow-visible">
        <h1 className="text-3xl font-bold">Top Rated</h1>
        <GamesList gamesList={topRated} />
      </div>

    </div>
  );
}
