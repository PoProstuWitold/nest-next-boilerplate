import React, { useEffect } from 'react'

interface LoginSuccessProps {

}

const LoginSuccess: React.FC<LoginSuccessProps> = ({}) => {
    
    useEffect(() => {
        setTimeout(() => {
          window.close()
        }, 1000)
    }, [])

    return (
        <div className="center">
            Login success, closing page
        </div>
    );
}

export default LoginSuccess