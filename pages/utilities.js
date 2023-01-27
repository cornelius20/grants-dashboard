import styles from './Utilities.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import StacksLogo from '../public/images/stacks-logo.svg';
import { Octokit } from '@octokit/rest';
import { useEffect } from 'react';

const Utilities = () => {
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
		<div style={{background: '#000',height: '100vh'}}>
			<Link href="/">
				<a>
					<div className={styles.close}>
						<p>
							<CloseIcon />
							Close
						</p>
						<span></span>
					</div>
				</a>
			</Link>
			<div className={styles.utilitiesWrapper}>
				
				<h2>I. Stacks Community Tools</h2>
				<div className={styles.buttonWrapper}>
					<div>
						<p>I.a. Want to verify your payment amount?</p>
						<Link href="/stacks-payment-converter">
							<a>
								<button style={{background: '#171923'}}>STX Payment Converter</button>
							</a>
						</Link>
					</div>
					<div>
						<p>I.b. Want to export data from grants database?</p>
						{!session && (
							<Link href="/grant-csv-exporter">
								<a>
									<button style={{background: '#171923'}}>Grants Database Exporter</button>
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
						<p>I.c. Was your Grant approved? Onboard here</p>
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
				<h2>II. Grant Review Commitee Tools</h2>

				<div className={styles.buttonWrapper}>
					<div>
						<p>II.a. Have you been asked to review grant application?</p>
						<Link href="/stacks-payment-converter">
							<a>
								<button>Application Review Form</button>
							</a>
						</Link>
					</div>
					<div>
						<p>II.b. Have you been asked to review a milestone or final deliverable?</p>
						{!session && (
							<Link href="/grant-data-exporter">
								<a>
									<button onClick={() => signIn('github')}>Deliverable Review Form</button>
								</a>
							</Link>
						)}
						{session && (
							<Link href="/grant-data-exporter">
								<a>
									<button>Grant Data Exporter</button>
								</a>
							</Link>
						)}
					</div>
					
				</div>
				<h2>III. Grant Admin Tools</h2>

				<div className={styles.buttonWrapper}>
					<div>
						<p>III.a. Need to adjust permission settings?</p>
						{!session && (
							<Link href="/admin-dashboard">
								<a>
									<button onClick={() => signIn('github')}>Admin Dashboard</button>
								</a>
							</Link>
						)}
						{session && (
							<Link href="/admin-dashboard">
								<a>
								    <button>Admin Dashboard</button>
							    </a>
							</Link>
						)}
					</div>
					<div>
						<p>III.b Need to document a payment made to grant recepient?</p>
						{!session && (
							<Link href="/payments-dashboard">
								<a>
									<button onClick={() => signIn('github')}>Payment Dashboard</button>
								</a>
							</Link>
						)}
						{session && (
							<Link href="/payments-dashboard">
								<a>
									<button>Payments Dashboard</button>
								</a>
							</Link>
						)}
					</div>
					
				</div>
			</div>
			<StacksLogo className={styles.stacksSVG} />
		</div>
	);
};

export default Utilities;
