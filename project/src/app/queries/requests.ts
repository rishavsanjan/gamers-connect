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




