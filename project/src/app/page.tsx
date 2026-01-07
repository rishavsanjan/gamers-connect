

import CTA from "@/components/CTA";
import HeroHomepage from "@/components/HeroHomepage";

export const metadata = {
  title : 'Gamers Connect'
}

export default async function Home() {

 
  return (
    <div className="pb-8">
      <HeroHomepage />
        <CTA/>


    </div>
  );
}