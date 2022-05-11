import React, { CSSProperties } from 'react'

interface ContainerProps {
    children: React.ReactNode
    style?: CSSProperties | undefined
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
    return (
            <div className="flex flex-col items-center p-5 bg-base-100" style={style}>
                {children}
            </div>
    )
}