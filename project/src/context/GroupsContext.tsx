'use client'

import { createContext, SetStateAction, useContext, useState } from "react"
import { GroupsExtended } from '@/app/types/groups'

type Role = 'owner' | 'admin' | 'member'

interface Member {
    id: string
    name: string | null
    username: string
    avatar: string | null
    role: Role
}

interface Requests {
    id: string,
    name: string | null,
    username: string,
    avatar: string | null,
    xp: number,
    createdAt: Date

}

interface GroupDetailsContextType {
    groupState: GroupsExtended

    memberCount: number
    membersState: Member[]
    setMemberCount: React.Dispatch<React.SetStateAction<number>>
    setMembersState: React.Dispatch<React.SetStateAction<Member[]>>
    groupRequests: Requests[]
    setGroupRequests: React.Dispatch<React.SetStateAction<Requests[]>>
}

const GroupDetailsContext = createContext<GroupDetailsContextType | null>(null);

export function GroupDetailsProvider({ group, members, totalMembers, requests, children }: any) {
    const [groupState, setGroupState] = useState<GroupsExtended>(group);
    const [membersState, setMembersState] = useState(members);
    const [memberCount, setMemberCount] = useState(totalMembers);
    const [groupRequests, setGroupRequests] = useState(requests);


    return (
        <GroupDetailsContext.Provider value={{ groupState, memberCount, membersState, setMemberCount, setMembersState, groupRequests, setGroupRequests }}>
            {children}
        </GroupDetailsContext.Provider>
    );
}

export const useGroupDetails = () => {
    const ctx = useContext(GroupDetailsContext);
    if (!ctx) throw new Error("useGroupDetails must be used inside GroupDetailsProvider");
    return ctx;
};