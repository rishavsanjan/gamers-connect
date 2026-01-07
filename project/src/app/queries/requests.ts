import axios from "axios";


export const acceptFollowRequest = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  await axios.post(
    "/api/private/follow-group-requests/follow-request-accept",
    { senderId, receiverId }
  );
};

export const declineFollowRequest = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  await axios.post(
    "/api/private/follow-group-requests/follow-request-ignore",
    { senderId, receiverId }
  );
};


export const acceptGroupInvite = async ({
  groupId,
}: {
  groupId: string;
}) => {
  await axios.post(
    "/api/private/group/group-invite-accept",
    { groupId }
  );
};

export const declineGroupInvite = async ({
  groupId,
}: {
  groupId: string;
}) => {
  await axios.post(
    "/api/private/group/group-invite-decline",
    { groupId }
  );
};

export const handleAddFollow = async ({
  followerId,
  followingId
}: {
  followerId: string,
  followingId: string
}) => {
  await axios.post(
    "/api/private/addfollow",
    { followerId, followingId }
  );
}

export const handleAddRequest = async ({
  senderId,
  receiverId
}: {
  senderId: string,
  receiverId: string
}) => {
  await axios.post(
    `/api/private/follow-request`,
    { senderId, receiverId }
  );
}


interface Requests {
  id: string,
  name: string | null,
  username: string,
  avatar: string | null,
  xp: number,
  createdAt: Date

}

interface RequestsResponse {
  requests: Requests[],
  nextPage?: number
}


export const fetchRequests = async ({
  pageParam = 1,
  queryKey
}: {
  pageParam?: number,
  queryKey: string[]
}): Promise<RequestsResponse> => {

  const res = await axios.post<RequestsResponse>(`/api/private/follow-group-requests/fetch-follow-requests?page=${pageParam}`)

  return {
    requests: res.data.requests,
    nextPage: res.data.requests.length > 0 ? pageParam + 1 : undefined
  }
}

interface Invites {
  id: string,
  name: string,
  coverImage: string | null,
  createdAt: Date

}

interface InviteResponse {
  invites: Invites[],
  nextPage?: number

}

export const fetchInvites = async ({
  pageParam = 1,
  queryKey
}: {
  pageParam?: number,
  queryKey: string[]
}): Promise<InviteResponse> => {

  const res = await axios.post<InviteResponse>(`/api/private/follow-group-requests/fetch-user-invite?page=${pageParam}`)

  return {
    invites: res.data.invites,
    nextPage: res.data.nextPage
  }
}




