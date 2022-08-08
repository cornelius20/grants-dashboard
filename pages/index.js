import Blob from '../public/images/blob.svg';
import styles from './Index.module.css';
import Rocket from '../public/images/rocket.svg';
import RocketShip from '../public/images/rocketship.svg';
import Link from 'next/link';
import IndexGithub from '../public/images/indexGithub.svg';
import { useSession, signIn, signOut } from 'next-auth/react';
import ExternalLinkIcon from '../public/images/externalLink.svg';
import Head from 'next/head';
import { useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import StacksLogo from '../public/images/indexStxLogo.svg';

const Home = () => {
	const { data: session } = useSession();

	useEffect(() => {
		async function refresh() {
			if (session) {
				const github = new Octokit({
					auth: session.accessToken
				});
				await github.request('GET /user');
			}
		}
		if (session) {
			refresh();
		}
	});

	return (
		<div>
			<div className={styles.indexWrapper}>
				<Head>
					<title>Stacks Grant Dashboard</title>
				</Head>

				<div className={styles.leftWrapper}>
					<p className={styles.foundation}>Stacks Foundation</p>

					<h1>Grants Launchpad</h1>
					<p>
						Committed to helping developers, designers, community leaders, artists, entrepreneurs,
						and more build a more...
					</p>
					<div className={styles.mainBodyText}>
						<p>User-owned & open-source internet powered by the </p>
						<div className={styles.highlightedWords}>Stacks</div> blockchain,{' '}
						<div className={styles.highlightedWords}>Clarity</div> smart contracts, and secured by{' '}
						<div className={styles.highlightedWords}>Bitcoin.</div>
					</div>
				</div>
				<div className={styles.rightWrapper}>
					<div className={styles.secondSection}>
						<p>Before you apply:</p>

						<a
							href="https://github.com/stacksgov/Stacks-Grant-Launchpad"
							target="_blank"
							rel="noopener noreferrer"
						>
							<button>
								VISIT GITHUB REPO <ExternalLinkIcon className={styles.externalLinkIcon} />
							</button>
						</a>
					</div>
					<div className={styles.firstSection}>
						<div>
							<p>Funding Available from:</p>
							<p>One-thousand to two-hundred and fifty thousand dollars.</p>
							{!session && (
								<button backgroundColor="grey" onClick={() => signIn('github')}>
									<a>Connect Github</a>
									<IndexGithub />
								</button>
							)}
							{session && (
								<>
									<Link href="/application">
										<button>
											<a>Submit Your Application</a>
											<Rocket />
										</button>
									</Link>
								</>
							)}
						</div>
					</div>
					<div className={styles.thirdSection}>
						<p>Already have an active grant?</p>

						<a href="https://grantsdashboard.stacks.org" target="_blank" rel="noopener noreferrer">
							<button>
								OLD DASHBOARD <ExternalLinkIcon className={styles.externalLinkIcon} />
							</button>
						</a>
					</div>
					<RocketShip className={styles.rocketShip} />
				</div>

				<Link href="/utilities">
					<a>
						<button className={styles.utilities}>Utilities</button>
					</a>
				</Link>
				<Blob className={styles.blobSVG} />
			</div>
			<StacksLogo className={styles.stxLogo} />
		</div>
	);
};

export default Home;
