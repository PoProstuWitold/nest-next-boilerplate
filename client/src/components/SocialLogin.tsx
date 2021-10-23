import { useRouter } from "next/router";
import axios from 'axios'
import { useAuthDispatch } from "../context/auth";

interface SocialLoginProps {
    provider: 'Google' | 'Facebook'
    url: string
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ provider, url }) => {
    const dispatch = useAuthDispatch()
    const router = useRouter()

    const fetchAuthUser = async () => {
        const response = await axios.get('/auth/me')
          .catch((err) => {
            console.log('Not properly authenticated')
            router.push('/login/error')
          });
    
        if (response && response.data) {
            dispatch('LOCAL_LOGIN', response.data)
            router.push('/me')
        }
      }

    const centerWindowPopup = (myURL: string, title: string, myWidth: number, myHeight: number) => {
        const left = (screen.width - myWidth) / 2
        const top = (screen.height - myHeight) / 4
        return window.open(
            myURL, 
            title,  
            `_blank toolbar=no, location=no, directories=no, status=no, menubar=no,
            scrollbars=no, resizable=no, copyhistory=no, 
            width=${myWidth}, height=${myHeight}, top=${top}, left=${left}`
        )
    }

    const redirectTo = async () => {
        let timer: NodeJS.Timeout | null = null;
        const socialLoginUrl = url;
        // const newWindow = window.open(
        //   googleLoginURL,
        //   "_blank",
        //   "width=500,height=600,position=absolute,top=400",
        // );
        const newWindow = centerWindowPopup(socialLoginUrl, 'GoogleLogin', 500, 600)
        if (newWindow) {
          timer = setInterval(() => {
            if (newWindow.closed) {
              console.log("Yay we're authenticated");
              fetchAuthUser();
              if (timer) clearInterval(timer);
            }
          }, 500);
        }
    }


    return (
        <button 
            onClick={redirectTo}
            className={`mb-4 p-3 font-bold text-white border-0 w-full btn focus:outline-none focus:shadow-outline 
                        ${provider === 'Facebook' ? 'bg-blue-800 hover:bg-blue-900 ' : ''}
                        ${provider === 'Google' ? 'bg-red-700 hover:bg-red-800 ' : ''}
            `}
        >
            Continue with {provider}
        </button>
    )
}