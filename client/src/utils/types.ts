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