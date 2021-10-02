import React, { CSSProperties } from 'react'

interface ContainerProps {
    style?: CSSProperties | undefined
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
    return (
        <div className="container flex flex-wrap justify-center" style={style}>
            {children}
        </div>
    )
}