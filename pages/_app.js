import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import Head from 'next/head';
import { ClientProvider } from '@micro-stacks/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<>
			<Head>
				<title>Stacks Grant Launchpad</title>
				<meta name="description" content="Funding for open-source development on Stacks." />

				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta property="og:title" content="Stacks Foundation Grant Launchpad" key="title" />
				<meta name="theme-color" content="#05030A"></meta>
				<meta
					property="og:description"
					content="Funding for open-source development on Stacks."
					key="description"
				/>
				<meta property="og:image" content="/images/og-image.png" />
				<meta name="google-site-verification" content="eMDVMqU3p4Fbsjy3UqAlQ_P3yqRf6l8BEk4cphihZ5M" />
			</Head>
			<ClientProvider
				appName="Stacks Foundation"
				appIconUrl="https://thumb.tildacdn.com/tild3931-3038-4632-b063-313631343738/-/resize/220x/-/format/webp/Foundation_Logo_Blac.png"
			>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</ClientProvider>

		</>
	);
}

export default MyApp;
