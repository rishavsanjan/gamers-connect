import React, { useState, useEffect, useRef } from 'react';
import { Search, X, UserPlus, Check } from 'lucide-react';
import axios from 'axios';
import { useGroupDetails } from '@/context/GroupsContext';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

interface User {
    id: string, name: string, username: string, avatar: string
}

const InviteMembers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [people, setPeople] = useState<Array<{ id: string, name: string, username: string, avatar: string }>>([]);
    const [invitedMembers, setInvitedMembers] = useState<Array<{ id: string, name: string, username: string, avatar: string }>>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchDropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownModel, setDropdownModel] = useState(false)
    const { groupState } = useGroupDetails();
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
                setDropdownModel(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsSearching(true);
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
            setIsSearching(false);
            return;
        }

        try {
            setIsSearching(true);
            const response = await axios({
                url: `/api/private/group/group-invite-members`,
                method: 'post',
                data: {
                    query: debouncedQuery,
                    groupId:groupState.id
                }
            });

            setPeople(response.data.users || []);
            setDropdownModel(true)
        } catch (error) {
            console.error('Search error:', error);
            setPeople([]);
        } finally {
            setIsSearching(false);
        }
    }

    useEffect(() => {
        getResults();
    }, [debouncedQuery])

    const handleInvite = (user: User) => {
        if (!invitedMembers.find(m => m.id === user.id)) {
            setInvitedMembers([...invitedMembers, user]);
        }
    };

    const handleRemoveInvite = (userId: string) => {
        setInvitedMembers(invitedMembers.filter(m => m.id !== userId));
    };

    const isInvited = (userId: string) => {
        return invitedMembers.some(m => m.id === userId);
    };

    const handleSendInvites = async () => {
        setSending(true)
        try {
            const response = await axios({
                url: `/api/private/group/group-send-invite`,
                method: 'post',
                data: {
                    groupId: groupState.id,
                    invitedPersons: invitedMembers.map(member => member.id)
                }
            })

            if (response.data.success) {
                toast.success('Invitations send successfully!')
            }
            setInvitedMembers([]);

        } catch (error) {
            console.log(error)
        } finally {
            setSending(false)
        }
    };

    return (
        <div className="sm:max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg ">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Invite Members</h2>

            {/* Search Input */}
            <div className="relative mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onFocus={() => { setDropdownModel(true) }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-black"
                    />
                </div>

                {/* Search Results Dropdown */}

                {searchQuery.trim().length > 0 && dropdownModel && (

                    <div ref={searchDropdownRef} className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {isSearching ? (
                            <div className="p-4 text-center text-gray-500">
                                <ClipLoader color='blue' className='' />
                            </div>
                        ) : people.length > 0 ? (
                            people.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`${user?.avatar ? '' : 'bg-purple-500  w-18 h-18 rounded-full  flex flex-row justify-center'}  `}>
                                            {
                                                user?.avatar ?
                                                    <>
                                                        <img src={user.avatar} alt="" className='rounded-full w-12 h-12' />
                                                    </>
                                                    :
                                                    <>
                                                        <h1 className='text-4xl text-center self-center'>{user?.username[0].toUpperCase()}</h1>
                                                    </>
                                            }

                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{user.username}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { isInvited(user.id) ? handleRemoveInvite(user.id) : handleInvite(user) }}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${isInvited(user.id)
                                            ? 'bg-green-100 text-green-700 '
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        {isInvited(user.id) ? (
                                            <span className="flex items-center gap-1">
                                                <Check className="w-4 h-4" />
                                                Invited
                                            </span>
                                        ) : (
                                            'Invite'
                                        )}

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
                                    <div className={`${member?.avatar ? '' : 'bg-purple-500  w-18 h-18 rounded-full flex flex-row justify-center'}  `}>
                                        {
                                            member?.avatar ?
                                                <>
                                                    <img src={member.avatar} alt="" className='rounded-full w-12 h-12' />
                                                </>
                                                :
                                                <>
                                                    <h1 className='text-4xl text-center self-center'>{member?.username[0].toUpperCase()}</h1>
                                                </>
                                        }

                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{member.username}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { handleRemoveInvite(member.id) }}
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
                onClick={() => { handleSendInvites() }}
                disabled={invitedMembers.length === 0 || sending}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${invitedMembers.length > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {
                    sending ?
                        <ClipLoader color='white' size={23}/>
                        :
                        <>
                            <UserPlus className="w-5 h-5" />
                            Send Invitations
                            {invitedMembers.length > 0 && ` (${invitedMembers.length})`}
                        </>
                }

            </button>
        </div>
    );
};

export default InviteMembers;