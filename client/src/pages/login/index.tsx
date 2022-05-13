import Head from 'next/head'
import { Container } from '../../components/Container'
import { AuthOption, withAuth } from '../../utils/withAuth'

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login or create account" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <div>
                    <h1 className="text-6xl">Hello world</h1>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lorem orci, pretium id feugiat volutpat, finibus vulputate sapien. Donec ac odio et nisl lobortis consequat. Aliquam vel lectus non erat egestas commodo non a neque. Nulla tempus vestibulum nunc eget sagittis. Donec semper ipsum ac magna sollicitudin, vel egestas augue auctor. Phasellus eget ultricies diam. Nunc lobortis vulputate diam, et ultricies augue varius dictum. Vivamus quis sagittis dui. Vivamus venenatis ornare lacus non accumsan. Suspendisse urna ligula, sollicitudin ut semper ac, ultricies in justo. Nullam volutpat condimentum purus ut ultricies. Aliquam cursus velit sit amet sapien vulputate fringilla. Sed luctus ut leo mollis rhoncus. Nullam nec sapien odio. Nulla finibus turpis quam, quis euismod ligula iaculis a.
                    </p>
                    <br />
                    <p>
                    Vestibulum mattis viverra mi, at fermentum sem accumsan et. Suspendisse sagittis congue molestie. Praesent lobortis est ac risus rutrum efficitur. In a rhoncus ligula. Fusce efficitur, diam in ultricies suscipit, nunc turpis mattis tellus, ac rutrum sapien nisi nec urna. Nam fermentum lacinia nibh, at ultricies erat luctus ut. Suspendisse egestas risus vel condimentum sodales.
                    </p>
                </div>
            </Container>
        </>
    )
}

export default withAuth(AuthOption.FORBIDDEN, Login)