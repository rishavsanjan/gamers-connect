import { Group } from "@prisma/client";

export interface GroupsExtended extends Group {
    hasJoined: boolean
}