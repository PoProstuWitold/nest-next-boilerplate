import { CSSProperties } from 'react'

interface ContainerProps {
    children: React.ReactNode
    style?: CSSProperties | undefined
    className?: string
    defaultHeight?: boolean
}

export const Container: React.FC<ContainerProps> = ({ children, style, className, defaultHeight = true }) => {
    return (
        <div className={`px-4 my-8 md:container md:mx-auto ${defaultHeight ? 'min-h-screen' : ''} ${className}`} style={style}>
            {children}
        </div>
    )
}