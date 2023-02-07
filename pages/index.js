import Blob from '../public/images/blob.svg';
import styles from './Index.module.css';
import Rocket from '../public/images/rocket.svg';
import RocketShip from '../public/images/rocketship.svg';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import ExternalLinkIcon from '../public/images/externalLink.svg';
import { useEffect, useState, useRef } from 'react';
import { Octokit } from '@octokit/rest';
import StacksLogo from '../public/images/indexStxLogo.svg';
import StacksLogoSuccess from '../public/images/stacksModalLogoSuccess.svg';
import ConnectGithubSVG from '../public/images/indexGithubConnect.svg';
import { Login } from '../utils/ApiCalls';
import { saveToken } from '../utils/LocalStorage';

const Home = () => {
	const { data: session } = useSession();
	const [show, setShow] = useState(false);
	const [mobile, setMobile] = useState();
	const [highlightButton, setHighlightButton] = useState(false);
	const connectButton = useRef(null);
	
	useEffect(() => {
		async function refresh() {
			if (session) {
				const github = new Octokit({
					auth: session.accessToken
				});
				let user = await github.request('GET /user');
				let filteredData = {
					id: user?.data?.id,
					name: user?.data?.name,
					login: user?.data?.login,
				}
				const res = await Login(filteredData);
				if (res) {
					saveToken(res.user.token);
				}
			}
		}
		if (session) {
			refresh();
		}

		window.innerWidth >= 800 ? setMobile(false) : setMobile(true);
	});

	const truncateUsername = (ghUsername) => {
		if (ghUsername.length < 10) {
			return ghUsername;
		} else {
			return ghUsername.slice(0, 8) + '...';
		}
	};

	const Button = () => {
		if (mobile === true) {
			return (
				<button onClick={() => setShow(true)}>Submit your Application or Wishlist Idea!</button>
			);
		} else if (!session) {
			return (
				<button backgroundColor="grey" onClick={() => setHighlightButton(true)}>
					<a>Submit your Application or Wishlist Idea!</a>
				</button>
			);
		} else if (session) {
			return (
				<Link href="/application">
					<button>
						<a>Submit your Application or Wishlist Idea!</a>
					</button>
				</Link>
			);
		} else {
			return null;
		}
	};

	return (
		<div className={styles.indexParent}>
			<div>
				<style global jsx>{`
					html,
					body,
					body > div:first-child,
					div#__next,
					div#__next > div {
						height: 100%;
					}
				`}</style>

				<div className={styles.indexWrapper}>
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
							<button
								ref={connectButton}
								className={!highlightButton ? styles.connectGithub : styles.connectGithubFocus}
								style={session ? { fontSize: '14px' } : {}}
								onClick={() => (!session ? signIn('github') : signOut())}
							>
								{!session ? 'Connect Github' : `${truncateUsername(session.user.name)} (log out)`}{' '}
								<ConnectGithubSVG />
							</button>
							<p>Before you apply:</p>

							<a
								href="https://github.com/stacksgov/Stacks-Grant-Launchpad"
								target="_blank"
								rel="noopener noreferrer"
							>
								<button className={styles.secondSectionButton}>
									VISIT GITHUB REPO <ExternalLinkIcon className={styles.externalLinkIcon} />
								</button>
							</a>
						</div>
						<div className={styles.firstSection}>
							<div>
								<p>Funding Available from:</p>
								<p>One-thousand to two-hundred and fifty thousand dollars.</p>
								<Button />
							</div>
						</div>
						<div className={styles.thirdSection}>
							<p>Already have an active grant?</p>

							<a
								href="https://grantsdashboard.stacks.org"
								target="_blank"
								rel="noopener noreferrer"
							>
								<button>
									OLD DASHBOARD <ExternalLinkIcon className={styles.externalLinkIcon} />
								</button>
							</a>
						</div>
						<RocketShip className={styles.rocketShip} />
					</div>

					<Blob className={styles.blobSVG} />
				</div>
				<Link href="/utilities">
					<a>
						<button className={styles.utilities}>Utilities</button>
					</a>
				</Link>
				<StacksLogo className={styles.stxLogo} />
			</div>
			{show === true ? (
				<div className={styles.mobileModal}>
					<StacksLogoSuccess className={styles.stxLogoModal} />

					<p>
						Looks like you are on a mobile device. For the best experience and to submit a grant
						please use a computer.
					</p>
					<p onClick={() => setShow(false)}>Dismiss</p>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Home;
