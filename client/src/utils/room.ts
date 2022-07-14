export const isRoomOwner = (room: any, user: any) => {
    const isOwner = room.owner.id === user.id
    return isOwner
}

export const isRoomMod = (room: any, user: any) => {
    let isMod: boolean
    for(const mod of room.mods) {
        if(mod.id === user.id) {
            return isMod = true
        }
    }
}

export const isRoomMember = (room: any, user: any) => {
    let isMember: boolean
    for(const member of room.users) {
        if(member.id === user.id) {
            return isMember = true
        }
    }
}