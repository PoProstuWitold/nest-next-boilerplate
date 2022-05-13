import { CSSProperties } from 'react'

interface ContainerProps {
    children: React.ReactNode
    style?: CSSProperties | undefined
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
    return (
        <div className="min-h-screen px-4 my-8 md:container md:mx-auto" style={style}>
            {children}
        </div>
    )
}