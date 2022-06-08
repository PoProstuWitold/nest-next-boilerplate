interface ErrorFieldProps {
    error: string | null
}

export const ErrorField: React.FC<ErrorFieldProps> = ({ error }) => {
    return (
        <span className="italic font-bold label-text-alt text-error">{error}</span>
    )
}