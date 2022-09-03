export enum AccountStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    BANNED = 'banned',
}

export enum Role {
    USER = 'user',
    PREMIUM = 'premium',
    MODERATOR = 'moderator',
    ADMIN = 'admin',
}

export enum Providers {
    Google = 'google',
    Facebook = 'facebook',
    Local = 'local'
}

export interface User {
    id: string
    createdAt: string
    updatedAt: string
    provider: Providers
    providerId: string | number
    email: string
    firstName: string
    lastName: string
    displayName: string
    image: string
    role: Role
    accountStatus: AccountStatus
}

export interface Room {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    description: string
    isPublic: boolean
    users: User[]
    mods: User[]
    owner: User
    messages: Message[]
    invitations: Invitation[]
}

export interface Message {
    id: string
    createdAt: string
    updatedAt: string
    text: string
    edited: boolean
    author: {
        id: string
        displayName: string
    }
    room: {
        id: string
        name: string
    }
}

export interface Invitation {
    id: string
    createdAt: string
    updatedAt: string
}