import { useUser } from '@/context/UserContext'
import axios from 'axios'
import { Check } from 'lucide-react'
import React, { SetStateAction } from 'react'
import { GoX } from 'react-icons/go'


interface Requests {
    id: string,
    name: string | null,
    username: string,
    avatar: string | null,
    xp: number,
    createdAt: Date
}


interface Props {
    senderId: string,
    setRequests: React.Dispatch<SetStateAction<Requests[]>>
}

const AcceptDeclineButton: React.FC<Props> = ({ senderId, setRequests }) => {

    const { user } = useUser();

    const handleRequestAccept = async (id: string) => {
        console.log(senderId, user?.id)
        try {
            const response = await axios({
                url: `/api/private/follow-group-requests/follow-request-accept`,
                method: 'post',
                data: {
                    senderId,
                    receiverId: user?.id
                }
            })
            console.log(response.data)

            setRequests(prev => prev.filter(req => req.id !== id));

        } catch (error) {
            console.log(error)
        }
    }

    const handleRequestDecline = async (id: string) => {
        console.log(senderId, user?.id)
        try {
            const response = await axios({
                url: `/api/private/follow-group-requests/follow-request-ignore`,
                method: 'post',
                data: {
                    senderId,
                    receiverId: user?.id
                }
            })
            console.log(response.data)

            setRequests(prev => prev.filter(req => req.id !== id));

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="flex items-center gap-3 sm:self-center shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <button
                onClick={() => { handleRequestDecline(senderId) }}
                className="flex-1 sm:flex-none h-10 px-4 rounded-lg border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <GoX size={18} />
                Decline
            </button>
            <button
                onClick={() => { handleRequestAccept(senderId) }}
                className="flex-1 sm:flex-none h-10 px-6 rounded-lg bg-[#3713ec] hover:bg-[#3713ec]/90 text-white font-bold text-sm shadow-lg shadow-[#3713ec]/20 transition-all flex items-center justify-center gap-2">
                <Check size={18} />
                Accept
            </button>
        </div>
    )
}

export default AcceptDeclineButton