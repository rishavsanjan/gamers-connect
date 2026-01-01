import axios from "axios"

interface Collection {
    id: string,
    name: string,
    description: string,
    hasGame: boolean
}

interface CollectionResponse {
    collections: Collection[]
}


export const fetchCollections = async ({
    queryKey,
}: {
    queryKey: [string, number | undefined]

}): Promise<CollectionResponse> => {
    const [, gameId] = queryKey

    const res = await axios.get<CollectionResponse>(
        `/api/private/getcollection?gameId=${gameId}`)

    return {
        collections: res.data.collections
    }
}