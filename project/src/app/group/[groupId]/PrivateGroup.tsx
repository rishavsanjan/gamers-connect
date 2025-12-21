'use client'
import React, { useState } from 'react';
import { Lock, Share2, Eye, X, Users, Shield } from 'lucide-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { Group } from '@prisma/client';

interface Props {
    group: Group
    isRequestSent: boolean
}

export default function PrivateGroupPage({ group, isRequestSent }: Props) {
    const [activeTab, setActiveTab] = useState('posts');
    const [joinRequested, setJoinRequested] = useState(isRequestSent);
    const [loading, setLoading] = useState(false);
    const handleJoinRequest = async () => {
        const oldState = joinRequested;
        setJoinRequested(prev => !prev);
        setLoading(true)
        try {

            await axios({
                url: `/api/private/follow-group-requests/group-request-send`,
                method: 'post',
                data: {
                    groupId: group.id
                }
            })

        } catch (error) {
            console.log(error)
            setJoinRequested(oldState);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-20 w-32 h-8 bg-red-500/30 blur-2xl rounded-full animate-float"></div>
                <div className="absolute top-20 right-40 w-24 h-6 bg-orange-500/30 blur-2xl rounded-full animate-float-delayed"></div>
                <div className="absolute top-40 left-1/3 w-28 h-7 bg-blue-500/30 blur-2xl rounded-full animate-float"></div>
                <div className="absolute top-32 right-1/4 w-20 h-5 bg-green-500/30 blur-2xl rounded-full animate-float-delayed"></div>
                <div className="absolute top-24 left-2/3 w-26 h-6 bg-purple-500/30 blur-2xl rounded-full animate-float"></div>
                <div className="absolute top-60 right-1/3 w-24 h-6 bg-pink-500/30 blur-2xl rounded-full animate-float-delayed"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{group.name}</h1>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                        <Lock size={16} />
                        <span>Private Group · {group.memberCount} member</span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-8">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                            <Share2 size={18} />
                            <span className="font-medium">Share</span>
                        </button>

                        <button
                            onClick={handleJoinRequest}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all font-medium  cursor-pointer disabled:cursor-not-allowed ${joinRequested
                                ? 'bg-gray-700 text-gray-400 '
                                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/30'
                                }`}
                        >
                            <Users size={18} />
                            <span>{joinRequested ? 'Request Sent' : 'Request to Join'}</span>

                        </button>

                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-800">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`pb-3 px-1 font-medium transition-colors relative cursor-pointer ${activeTab === 'posts'
                                ? 'text-blue-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Posts
                            {activeTab === 'posts' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`pb-3 px-1 font-medium transition-colors relative cursor-pointer ${activeTab === 'members'
                                ? 'text-blue-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Members
                            {activeTab === 'members' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`pb-3 px-1 font-medium transition-colors relative cursor-pointer ${activeTab === 'media'
                                ? 'text-blue-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Media
                            {activeTab === 'media' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">

                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-12 border border-gray-800 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                                    <Lock size={40} className="text-gray-400" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-3">This Group is Private</h2>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                {joinRequested
                                    ? 'Your request to join has been sent. The group admin will review your request.'
                                    : 'You need to join this group to see posts and interact with members. Click "Request to Join" above to send a join request.'}
                            </p>
                            {joinRequested && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                    <Shield size={18} />
                                    <span className="text-sm font-medium">Pending Approval</span>
                                </div>
                            )}
                            {!joinRequested && (
                                <button
                                    disabled={loading}
                                    onClick={handleJoinRequest}
                                    className="inline-flex items-center gap-2 px-6 py-3 cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg font-bold transition-all shadow-lg shadow-pink-500/30"
                                >
                                    <Users size={20} />
                                    Request to Join
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* About Section */}
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-bold mb-4">About</h2>
                            <p className="text-gray-400 text-sm mb-6">{group.description?.length !== undefined ? group.description : 'No description!'}</p>

                            {/* Privacy Settings */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                                        <Lock size={20} className="text-pink-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Private</h3>
                                        <p className="text-sm text-gray-400">Only those who joined can see the posts.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                                        <Eye size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Visible</h3>
                                        <p className="text-sm text-gray-400">Anyone can find this group.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Media Section */}
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-bold mb-4">Recent Media</h2>

                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Lock size={16} />
                                <span>Join to view media</span>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            {/* Issues Badge */}
            <div className="fixed bottom-4 left-4 z-50">
                <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 cursor-pointer rounded-full flex items-center shadow-lg transition-colors">
                    <span className="w-4 h-4 bg-white text-red-500 rounded-full flex items-center justify-center text-[10px] mr-2 font-bold">
                        N
                    </span>
                    2 Issues
                    <X size={12} className="ml-2 opacity-70" />
                </button>
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(15px) translateX(-15px);
          }
          66% {
            transform: translateY(-10px) translateX(15px);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}