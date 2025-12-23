import React, { useState, useEffect, useRef } from 'react';
import { Search, X, UserPlus, Check } from 'lucide-react';
import axios from 'axios';

const InviteMembers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [people, setPeople] = useState<Array<{ id: string, name: string, username: string, avatar: string }>>([]);
    const [invitedMembers, setInvitedMembers] = useState<Array<{ id: string, name: string, username: string, avatar: string }>>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false)
    const searchBarDropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchBarDropDownRef.current && !searchBarDropDownRef.current.contains(e.target as Node)) {
                setSearchQuery('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setLoading(true);
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 200);

        return () => {
            clearTimeout(handler)
        }
    }, [searchQuery])

    const getResults = async () => {
        if (!debouncedQuery.trim()) {
            setPeople([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios({
                url: `/api/community-search`,
                method: 'post',
                data: {
                    query: debouncedQuery
                }
            });

            setPeople(response.data.users || []);
        } catch (error) {
            console.error('Search error:', error);
            setPeople([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getResults();
    }, [debouncedQuery])

    // const handleInvite = (user) => {
    //     if (!invitedMembers.find(m => m.id === user.id)) {
    //         setInvitedMembers([...invitedMembers, user]);
    //     }
    // };

    // const handleRemoveInvite = (userId) => {
    //     setInvitedMembers(invitedMembers.filter(m => m.id !== userId));
    // };

    // const isInvited = (userId) => {
    //     return invitedMembers.some(m => m.id === userId);
    // };

    // const handleSendInvites = () => {
    //     if (invitedMembers.length > 0) {
    //         alert(`Invitations sent to ${invitedMembers.length} member(s)!`);
    //         setInvitedMembers([]);
    //         setSearchQuery('');
    //         setPeople([]);
    //     }
    // };

    return (
        <div ref={searchBarDropDownRef} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Invite Members</h2>

            {/* Search Input */}
            <div className="relative mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Search Results Dropdown */}
                {searchQuery.trim().length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {isSearching ? (
                            <div className="p-4 text-center text-gray-500">Searching...</div>
                        ) : people.length > 0 ? (
                            people.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{user.name}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { '' }}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${(user.id)
                                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >

                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">No users found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Invited Members List */}
            {invitedMembers.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        Invited Members ({invitedMembers.length})
                    </h3>
                    <div className="space-y-2">
                        {invitedMembers.map(member => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{member.name}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { '' }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Send Invites Button */}
            <button
                onClick={() => { '' }}
                disabled={invitedMembers.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${invitedMembers.length > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <UserPlus className="w-5 h-5" />
                Send Invitations
                {invitedMembers.length > 0 && ` (${invitedMembers.length})`}
            </button>
        </div>
    );
};

export default InviteMembers;