    import React, { SetStateAction } from 'react'
    import { Twitch, Twitter, Youtube, Facebook, Instagram, Trash2 } from 'lucide-react';
    import { BsDiscord, BsSteam } from 'react-icons/bs';

    type socialLinks = {
        twitch: string
        x: string
        steam: string
        youtube: string
        discord: string
        facebook: string
        instagram: string
    }

    interface Props {
        socialLinks: socialLinks,
        setSocialLinks: React.Dispatch<SetStateAction<socialLinks>>
    }

    const SocialOptions: React.FC<Props> = ({ socialLinks, setSocialLinks }) => {
        return (
            <div>
                <h2 className="text-white text-xl font-bold tracking-tight mb-4">Social Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative flex items-center">
                        <Twitch size={20} className="absolute left-4 text-[#9a90cb]" />
                        <input
                            type="text"
                            value={socialLinks.twitch}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, twitch: e.target.value }))}
                            placeholder="twitch.tv/username"
                            className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                        />
                    </div>
                    <div className="relative flex items-center">
                        <Twitter size={20} className="absolute left-4 text-[#9a90cb]" />
                        <input
                            type="text"
                            value={socialLinks.x}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, x: e.target.value }))}
                            placeholder="x.com/username"
                            className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                        />
                    </div>
                    <div className="relative flex items-center">
                        <BsSteam size={20} className="absolute left-4 text-[#9a90cb]" />
                        <input
                            type="text"
                            value={socialLinks.steam}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, steam: e.target.value }))}
                            placeholder="steam.com/username"
                            className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                        />
                    </div>
                    <div className="relative flex items-center">
                        <Youtube size={20} className="absolute left-4 text-[#9a90cb]" />
                        <input
                            type="text"
                            value={socialLinks.youtube}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                            placeholder="youtube.com/username"
                            className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                        />
                    </div>
                    <div className="relative flex items-center">
                        <BsDiscord size={20} className="absolute left-4 text-[#9a90cb]" />
                        <input
                            type="text"
                            value={socialLinks.discord}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, discord: e.target.value }))}
                            placeholder="discord.com/username"
                            className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                        />
                    </div>
                    <div className="relative flex items-center">
                        <Facebook size={20} className="absolute left-4 text-[#9a90cb]" />
                        <input
                            type="text"
                            value={socialLinks.facebook}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                            placeholder="facebook.com/username"
                            className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                        />
                    </div>
                    <div className="relative flex items-center">
                        <Instagram size={20} className="absolute left-4 text-[#9a90cb]" />
                        <input
                            type="text"
                            value={socialLinks.instagram}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                            placeholder="instagram.com/username"
                            className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                        />
                    </div>
                </div>
            </div>
        )
    }

    export default SocialOptions