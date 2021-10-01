export interface User {
    id: string
    createdAt: string
    updatedAt: string
    provider: string
    providerId: string | number
    email: string
    firstName: string
    lastName: string
    displayName: string
}