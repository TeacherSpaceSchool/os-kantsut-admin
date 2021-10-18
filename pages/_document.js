import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import theme from '../src/theme';
import { urlMain } from '../redux/constants/other'
import ReactGA from 'react-ga';
ReactGA.initialize('UA-154348779-1');

class MyDocument extends Document {
    render() {
        return (
            <html lang="en">
            <Head>
                  <meta charSet="utf-8" />
                  <meta
                      name="viewport"
                      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                  />
                  <meta name="theme-color" content='"#009ADC' />
                  <link
                      rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                  />
                <meta property="fb:app_id" content="257953674358265" />
                <meta name="format-detection" content="telephone=no" />
                <meta httpEquiv="x-dns-prefetch-control" content="on"/>
                <link rel="shortcut icon" href={`/static/favicon.ico`} type="image/x-icon" />
                <link rel="manifest" href="/static/manifest.json"/>
                <link rel="icon" sizes="192x192" href="/static/192x192.png"/>
                <link rel="apple-touch-icon" href="/static/192x192.png"/>
                <meta name="msapplication-square310x310logo" content="/static/192x192.png"/>
                <meta name="google" content="notranslate"/>
            </Head>
            <body>
            <noscript>
                Пожалуйста включить JS для запуска приложения
            </noscript>
            <Main />
            <NextScript />
            </body>
            </html>
        );
    }
}

MyDocument.getInitialProps = async ctx => {

    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
          <React.Fragment key="styles">
              {initialProps.styles}
              {sheets.getStyleElement()}
          </React.Fragment>,
        ],
    };
};

export default MyDocument;
