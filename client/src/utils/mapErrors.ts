export const mapErrors = (errors: any) => {
    let mappedErrors: any = {}
        mappedErrors.email = errors.email || null
        mappedErrors.firstName = errors.firstName || null
        mappedErrors.lastName = errors.lastName || null
        mappedErrors.displayName = errors.displayName || null
        mappedErrors.password = errors.password || null
    return mappedErrors
}