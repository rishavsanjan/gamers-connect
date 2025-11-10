'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

interface Achievement {
    id: string;
    title: string;
    description?: string;
    xpReward: number;
    goalValue?: number;
    metric?: string;
    unlocked: boolean;
    currentValue?: number;
    progress?: number;
}

const ProfileAchievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await axios.get('/api/private/user_achievements');
                setAchievements(res.data.achievements);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <ClipLoader color="white" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Achievements Progress</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {achievements.map((a) => (
                    <div
                        key={a.id}
                        className={`p-4 rounded-xl border ${a.unlocked
                                ? 'border-purple-500/60 bg-purple-900/20'
                                : 'border-gray-700 bg-gray-900/40'
                            }`}
                    >
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold text-white text-sm">{a.title}</h3>
                            <p className="text-xs text-gray-400">{a.description}</p>

                            {/* Progress Section */}
                            {a.goalValue && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>
                                            {a.currentValue}/{a.goalValue}
                                        </span>
                                        <span>{Math.round(a.progress || 0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${a.unlocked
                                                    ? 'bg-gradient-to-r from-green-400 to-lime-500'
                                                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                }`}
                                            style={{ width: `${a.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* XP + Status */}
                            <p className="text-xs text-purple-400 mt-2">+{a.xpReward} XP</p>
                            {a.unlocked && (
                                <p className="text-xs text-green-400 mt-1">Unlocked!</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileAchievements;
