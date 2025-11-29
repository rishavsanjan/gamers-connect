'use client'
import React, { useState } from 'react'

interface Props {

}

const GroupTabs: React.FC<Props> = ({ }) => {
    const [activeTab, setActiveTab] = useState('Discussion');

    const tabs = ['Discussion', 'Featured', 'Members', 'Media'];
    return (
        <nav className="border-b border-[#3a3b3c] mb-5">
            <ul className="flex gap-0">
                {tabs.map((tab) => (
                    <li
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-4 cursor-pointer text-[15px] font-semibold transition-all relative ${activeTab === tab
                            ? 'text-[#2374e1]'
                            : 'text-[#b0b3b8] hover:bg-white/5 hover:text-[#e4e6eb]'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#2374e1]" />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default GroupTabs