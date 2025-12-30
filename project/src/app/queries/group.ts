import axios from "axios"

export const handleKickMember = async ({ memberId, groupId }: { memberId: string, groupId: string }) => {
    await axios.post(`/api/private/group/group-kick-member`, { memberId, groupId })
}

export const handleAdminCreate = async ({ memberId, groupId }: { memberId: string, groupId: string }) => {
    await axios.post(`/api/private/group/group-admin-create`, { memberId, groupId })
}

export const handleAdminRemove = async ({ memberId, groupId }: { memberId: string, groupId: string }) => {
    await axios.post(`/api/private/group/group-admin-remove`, { memberId, groupId })
}