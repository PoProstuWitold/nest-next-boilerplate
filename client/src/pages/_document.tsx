import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import NavBar from '../components/NavBar'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                </Head>
                <body>
                    <NavBar />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument