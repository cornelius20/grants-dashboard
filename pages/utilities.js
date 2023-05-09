import styles from './Utilities.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import StacksLogo from '../public/images/stacks-logo.svg';
import { Octokit } from '@octokit/rest';
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import BackButton from '../components/BackButton';

const Utilities = () => {
	const { data: session } = useSession();
	const router = useRouter()

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
		<div style={main}>
			{/* <Link href="/">
				<div className={styles.close}>
						<p>
							<CloseIcon />
							<span style={{color: '#fff'}}>Close</span>
						</p>
				</div>
			</Link> */}
			
			<div className={styles.utilitiesWrapper}>
				<BackButton title={'Close'} link={'/'}/>
				<h2>Stacks Community Tools</h2>
				<div className={styles.buttonWrapper}>
					<div>
						<p>Want to verify your payment amount?</p>
						<Link href="/stacks-payment-converter">
							<a>
								<button className={styles.buttonBackgroundColor}>STX Payment Converter</button>
							</a>
						</Link>
					</div>
					<div>
						<p>Want to export data from grants database?</p>
						{!session && (
							<Link href="/grant-csv-exporter">
								<a>
									<button className={styles.buttonBackgroundColor}>Grants Database Exporter</button>
								</a>
							</Link>
						)}
						{session && (
							<Link href="/grant-csv-exporter">
								<a>
									<button>Grant Data Exporter</button>
								</a>
							</Link>
						)}
					</div>
					<div>
						<p>Was your Grant approved? Onboard here</p>
						{!session && (
							<Link href="/grant-onboarding">
								<a>
									<button onClick={() => signIn('github')}>Grant Onboarding</button>
								</a>
							</Link>
						)}
						{session && (
							<Link href="/grant-onboarding">
								<a>
									<button>Grant Onboarding</button>
								</a>
							</Link>
						)}
					</div>
				</div>

				{
					session?.user?.name.toLowerCase().startsWith('cor') || session?.user?.name.toLowerCase().startsWith('will') || session?.user?.name.toLowerCase().startsWith('ivo') || session?.user?.name.toLowerCase().startsWith('shakti') ?
						<>
							<h2>Grant Admin Tools</h2>
							<div className={styles.buttonWrapper}>
								{
									session?.user?.name.toLowerCase().startsWith('cor') || session?.user?.name.toLowerCase().startsWith('will') || session?.user?.name.toLowerCase().startsWith('ivo') ?
										<div>
											<p>Need to adjust permission settings?</p>
											<Link href="/admin-dashboard">
												<a>
													<button>Admin Dashboard</button>
												</a>
											</Link>

										</div>
										: null
								}
								<div style={pb2}>
									<p>Need to document a payment made to grant recepient?</p>
									<Link href="/payments-dashboard">
										<a>
											<button>Payments Dashboard</button>
										</a>
									</Link>

								</div>

							</div>
						</>
						: null
				}
			</div>
			<StacksLogo className={styles.stacksSVG} />
		</div>
	);
};

const main = {
	background: '#000',
	height: '100vh'
}

const pb2 = {
	paddingBottom: 20
}

export default Utilities;

const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: 26,
    paddingTop: 38,
    position: 'relative'
}

const bar = {
    height: 2,
    width: 30,
    borderRadius: 3,
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: '#fff'
}

export async function getServerSideProps(context) {
	const session = await unstable_getServerSession(context.req, context.res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	session.user.email = '';
	return {
		props: {
			session
		}
	};
}