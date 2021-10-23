export const mapErrors = (errors: any) => {
    let mappedErrors: any = {}
    errors.message.map((err: any, index: number) => {
        if(err.includes("email")) {
            mappedErrors.email = "Email must be an email"
        }
        if(err.includes("firstName")) {
            mappedErrors.firstName = "First name must be longer than or equal to 3 characters"
        }
        if(err.includes("lastName")) {
            mappedErrors.lastName = "Last name must be longer than or equal to 3 characters"
        }
        if(err.includes("Display name")) {
            mappedErrors.displayName = "Display (nick) name must be longer than or equal to 3 characters"
        }
        if(err.includes("password")) {
            mappedErrors.password = "Password must be longer than or equal to 6 characters"
        }

    })
    return mappedErrors
}