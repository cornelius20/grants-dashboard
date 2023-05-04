import styles from './GrantData.module.css';
import Link from 'next/link';
import CloseIcon from '../public/images/close.svg';
import StacksLogo from '../public/images/stacks-logo.svg';
import { useState, useEffect } from 'react';
import CalendarDropdown from '../components/CalendarDropdown';
import { CSVLink, CSVDownload } from 'react-csv';
import { Octokit } from '@octokit/rest';
import { useSession, signIn } from 'next-auth/react';
import LoadingSpinner from '../public/images/loading-spinner.svg';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Head from 'next/head';
import BackButton from '../components/BackButton';

const GrantDataExporter = () => {
	const [CSVData, setCSVData] = useState([
		[
			'Date Submitted',
			'Issue Number',
			'Application Type',
			'Grant Lead',
			'Previous Grants',
			'Other Ecosytem Programs',
			'Grant Name',
			'Grant Budget',
			'Grant Duration',
			'Grant Type',
			'Grant Track',
			'Grant Goal',
			'Grant Audience',
			'Final Deliverable',
			'Review Status',
			'Grant Phase',
			'Predicted Impact Score',
			'Commented GH Usernames',
			'Reacted GH Usernames'
		]
	]);

	const { data: session } = useSession();

	const [endDate, setEndDate] = useState(new Date());
	const [grantType, setGrantType] = useState('');
	const [grantPhase, setGrantPhase] = useState('');
	let pastSevenDays = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
	const [startDate, setStartDate] = useState(pastSevenDays);
	const [grantTracks, setGrantTracks] = useState('');
	const [grantsFound, setGrantsFound] = useState(0);
	const [loadingSpinner, setLoadingSpinner] = useState(false);
	const [exportButton, setExportButton] = useState(false);

	useEffect(() => {
		setExportButton(false);
		setGrantsFound(0);
		setCSVData([
			[
				'Date Submitted',
				'Issue Number',
				'Application Type',
				'Grant Lead',
				'Previous Grants',
				'Other Ecosytem Programs',
				'Grant Name',
				'Grant Budget',
				'Grant Duration',
				'Grant Type',
				'Grant Track',
				'Grant Goal',
				'Grant Audience',
				'Final Deliverable',
				'Review Status',
				'Grant Phase',
				'Predicted Impact Score',
				'Commented GH Usernames',
				'Reacted GH Usernames'
			]
		]);
	}, [endDate, grantType, grantPhase, startDate, grantTracks, startDate, grantTracks]);

	let issues = [];
	const applicationTypeArr = ['Direct Application', 'Wishlist Submission', 'Wishlist Request'];
	const grantTypeArr = [
		'Open Source First Time',
		'Open Source Repeat',
		'Community Builder',
		'Education',
		'Events',
		'Chapter',
		'ALEX Lab Foundation Grant',
		'Resident Program',
		'Direct Investment'
	];
	const grantTrackArr = [
		'Stacks Protocol',
		'Stacks Interface',
		'Stacks dApps & Clarity',
		'Stacks Education & Community',
		'Stacks Developer Experience',
		'Stacks User Experience',
		'Cross-Chain & Off-Chain',
		'Bitcin Utility via Stacks'
	];
	const grantStatusArr = [
		'Initial Review in Progress',
		'Review in Progress',
		'Revisions in Progress',
		'Onboarding in Progress',
		'Milestone in Progress',
		'Final Deliverable in Progress',
		'Grant Complete',
		'Grant Now Stale',
		'Grant Closed'
	];
	const grantPhaseArr = [
		'Application Phase',
		'Onboarding Phase',
		'Milestone 1',
		'Milestone 2',
		'Milestone 3',
		'Milestone 4',
		'Milestone 5',
		'Milestone 6',
		'Milestone 7',
		'Milestone 8',
		'Milestone 9',
		'Milestone 10',
		'Final Deliverable'
	];

	const predictedImpactScoreArr = ['6', '5', '4', '3', '2', '1'];

	async function getIssues() {
		issues = [];
		const github = new Octokit({
			auth: session.accessToken,
		});;
		setLoadingSpinner(true);

		let labels = [];
		grantTracks != '' ? labels.push(grantTracks) : null;
		grantPhase != '' ? labels.push(grantPhase) : null;
		grantType != '' ? labels.push(grantType) : null;

		let req = await github.rest.issues.listForRepo({
			owner: 'stacksgov',
			repo: 'Stacks-Grant-Launchpad',
			state: 'all',
			labels: labels,
			since: `${startDate}`
		});

		let res = req.data;

		res.map((issue) => {
			let teamMembers = issue.assignees.map((assignee) => assignee.login);

			issues.push({
				dateSubmitted: issue.created_at,
				number: issue.number,
				grantLead: issue.user.login,
				grantName: issue.title,
				teamMembers: teamMembers,
				url: issue.html_url,
				labels: issue.labels,
				body: issue.body
			});
		});

		const relevantIssues = issues.filter(
			(issue) =>
				Date.parse(issue.dateSubmitted) <= Date.parse(endDate) &&
				issue.url.includes('issues') &&
				Date.parse(issue.dateSubmitted) > Date.parse('2022-08-06T20:14:41Z')
		);

		relevantIssues.map((issue) => {
			issue.labels.map((label) => {
				if (applicationTypeArr.includes(label.name)) {
					issue.applicationType = label.name;
				}

				if (grantTypeArr.includes(label.name)) {
					issue.grantType = label.name;
				}

				if (grantTrackArr.includes(label.name)) {
					issue.grantTrack = label.name;
				}
				if (grantStatusArr.includes(label.name)) {
					issue.grantStatus = label.name;
				}
				if (grantPhaseArr.includes(label.name)) {
					issue.grantPhase = label.name;
				}
				if (predictedImpactScoreArr.includes(label.name)) {
					issue.predictedImpactScore = label.name;
				}
			});
		});

		await Promise.all(
			relevantIssues.map(async (issue) => {
				let req = await github.rest.issues.listComments({
					owner: 'stacksgov',
					repo: 'Stacks-Grant-Launchpad',
					issue_number: `${issue.number}`
				});
				let res = req.data;
				const commentSet = new Set();
				res.map((commenter) => commentSet.add(commenter.user.login));
				issue.commentName = Array.from(commentSet).join(', ');
			})
		);

		await Promise.all(
			relevantIssues.map(async (issue) => {
				let req = await github.rest.reactions.listForIssue({
					owner: 'stacksgov',
					repo: 'Stacks-Grant-Launchpad',
					issue_number: `${issue.number}`
				});

				let res = req.data;
				const reactionSet = new Set();
				res.map((reactor) => reactionSet.add(reactor.user.login));
				issue.reactionUsername = Array.from(reactionSet).join(', ');
			})
		);

		relevantIssues.map((issue) => {
			if (issue.body) {
				const regex = /(?<=&thinsp;)([\s\S]*?)(?=\*\*)/g;

				const regexReplaceSpacing =
					/(?<=\*\*Grant Name:\*\*&hairsp;&hairsp;&hairsp;&hairsp;).*?(?=&hairsp;)/g;

				issue.body += '**';
				issue.body = issue.body.replace('# GRANT BASICS', '** # GRANT BASICS');
				issue.body = issue.body.replace(
					'# GRANT MISSION, IMPACT, RISKS & REFERENCE',
					'** # GRANT MISSION, IMPACT, RISKS & REFERENCE'
				);
				issue.body = issue.body.replace(
					'# GRANT ROADMAP & DELIVERABLES',
					'** # GRANT ROADMAP & DELIVERABLES'
				);
				issue.body = issue.body.replace('# WISHLIST IDEA', '** # WISHLIST IDEA');

				issue.body = issue.body.replace(regexReplaceSpacing, '&hairsp;&hairsp;');

				const lines = issue.body
					.match(regex)
					.map((line) => line.replace('\n', '').replace('\n', '').trim());

				issue.grantName = lines[5];
				issue.grantBudget = lines[6];
				issue.grantDuration = lines[7];
				issue.fundingStream = lines[8];
				issue.grantType = lines[9];
				issue.grantTrack = lines[10];
				issue.grantGoal = lines[11];
				issue.grantAudience = lines[12];
				issue.specificAudience = lines[13];
				issue.grantTeamMembers = lines[14];
				issue.previousGrants = lines[15] == '' ? 'No' : 'Yes';
				issue.ecosystemPrograms = lines[16] == '' ? 'No' : 'Yes';
				issue.grantMission = lines[17];
				issue.finalDeliverable = lines[21];

				let issueCreatedOn = new Date(issue.dateSubmitted);
				issue.dateSubmitted = issueCreatedOn.toLocaleString('default', {
					month: 'long',
					day: '2-digit',
					year: '2-digit'
				});

				let newCSVData = CSVData;
				newCSVData.push([
					issue.dateSubmitted,
					issue.number,
					issue.applicationType,
					issue.grantLead,
					issue.previousGrants,
					issue.ecosystemPrograms,
					issue.grantName,
					issue.grantBudget,
					issue.grantDuration,
					issue.grantType,
					issue.grantTrack,
					issue.grantGoal,
					issue.grantAudience,
					issue.finalDeliverable,
					issue.grantStatus,
					issue.grantPhase,
					issue.predictedImpactScore,
					issue.commentName,
					issue.reactionUsername
				]);
				setCSVData(newCSVData);
			}
		});

		if (relevantIssues.length === 0) {
			setGrantsFound('Nothing Matched this Criteria');
		} else {
			setGrantsFound(relevantIssues.length);
		}

		if (res) {
			setLoadingSpinner(false);
			setExportButton(true);
		}
	}

	return (
		<div className={styles.main}>
			<Head>
				<title>Grant Data Exporter</title>
			</Head>
			<BackButton title={'Back to Utilities'} link={'/utilities'} />
			{/* <div style={wrapper}>
				<p>
					<Link style={link} href={'/utilities'}>
						<span style={{ color: '#fff', cursor: 'pointer' }}>Back to Utilities</span>
					</Link>
				</p>
				<span style={bar}></span>
			</div> */}
			<div className={styles.grantDataWrapper}>
				{/* <div style={wrapper}>
					<p>
						<Link className={styles.whiteLink} style={link} href={'/utilities'}>
							<span style={{color: '#fff'}}>Back to Utilities</span>
						</Link>
					</p>
					<span style={bar}></span>
				</div> */}
				<h1>Grant Data Exporter</h1>
				<p className={styles.descriptor}>
					A simple widget for exporting grant data from Github as a .CSV file.
				</p>
				<div className={styles.grantExportWrapper}>
					<div className={styles.dropdownWrapper}>
						<label htmlFor="selectGrantType">A. Select Grant Type(s)</label>
						<select name="selectGrantType" onChange={(e) => setGrantType(e.target.value)}>
							<option value="" disabled selected>
								Drop down...
							</option>
							<option value="Open Source First Time">Open Source Dev 1st time Grantees</option>
							<option value="Open Source Repeat">Open Source Dev Repeat Grantees</option>
							<option value="Community Builder">Community Builder</option>
							<option value="Education">Education</option>
							<option value="Events">Events</option>
							<option value="Chapter">Chapter</option>
							<option value="ALEX Lab Foundation Grant">ALEX Lab Foundation Grant</option>
							<option value="Resident Program">Resident Program</option>
							<option value="Direct Investment">Direct Investment</option>
						</select>
					</div>
					<div className={styles.dropdownWrapper}>
						<label htmlFor="selectGrantTrack">B. Select Grant Track(s)</label>
						<select name="selectGrantTrack" onChange={(e) => setGrantTracks(e.target.value)}>
							<option value="" disabled selected>
								Drop down...
							</option>
							<option value="Stacks Protocol">Stacks Protocol</option>
							<option value="Stacks Interface">Stacks Interface</option>
							<option value="Stacks dApps & Clarity">Stacks dApps & Clarity</option>
							<option value="Stacks Education & Community">Stacks Education & Community</option>
							<option value="Stacks Developer Experience">Stacks Developer Experience</option>
							<option value="Stacks User Experience">Stacks User Experience</option>
							<option value="Cross-Chain & Off-Chain">Cross-Chain & Off-Chain</option>
							<option value="Bitcoin Utility via Stacks">Bitcoin Utility via Stacks</option>
						</select>
					</div>
					<div className={styles.dropdownWrapper}>
						<label htmlFor="selectGrantPhase">C. Select Grant Phase</label>
						<select name="selectGrantPhase" onChange={(e) => setGrantPhase(e.target.value)}>
							<option value="" disabled selected>
								Drop down...
							</option>
							<option value="Application Phase">Application Phase</option>
							<option value="Onboarding Phase">Onboarding Phase</option>
							<option value="Milestone 1">Milestone 1</option>
							<option value="Milestone 2">Milestone 2</option>
							<option value="Milestone 3">Milestone 3</option>
							<option value="Milestone 4">Milestone 4</option>
							<option value="Milestone 5">Milestone 5</option>
							<option value="Milestone 6">Milestone 6</option>
							<option value="Milestone 7">Milestone 7</option>
							<option value="Milestone 8">Milestone 8</option>
							<option value="Milestone 9">Milestone 9</option>
							<option value="Milestone 10">Milestone 10</option>
							<option value="Final Deliverable">Final Deliverable</option>
						</select>
					</div>
					<div className={styles.calendarDropdownWrapper}>
						<label className={styles.mb10} htmlFor="amountReceived">D. Select Start Date <span className={styles.maxLimit}>(6 months max)</span></label>
						<CalendarDropdown onChange={setStartDate} value={startDate} />
					</div>


					<div className={styles.calendarDropdownWrapper}>
						<label className={styles.mb10} htmlFor="selectDate">E. Select End Date <span className={styles.maxLimit}>(6 months max)</span></label>
						<CalendarDropdown onChange={setEndDate} value={endDate} />
					</div>

					<div className={styles.buttonWrappers}>
						{!exportButton ? (
							<button className={styles.converterButton} onClick={getIssues}>
								{!loadingSpinner ? 'Click to Export' : <LoadingSpinner />}
							</button>
						) : (
							<CSVLink data={CSVData} filename={'grants-dashboard-export.csv'}>
								<button className={styles.converterButton}>Download CSV</button>
							</CSVLink>
						)}
					</div>
					<div className={styles.dropdownWrapper}>
						<div>
							<p>Date Range</p>
							<p className={styles.dates}>
								{startDate
									.toLocaleString('default', {
										month: 'long',
										day: '2-digit',
										year: '2-digit'
									})
									.replace(' ', '-')
									.replace(',', '-')
									.replace(' ', '')}{' '}
								to{' '}
								{endDate
									.toLocaleString('default', {
										month: 'long',
										day: '2-digit',
										year: '2-digit'
									})
									.replace(' ', '-')
									.replace(',', '-')
									.replace(' ', '')}
							</p>
						</div>
					</div>
					<div className={styles.dropdownWrapper}>
						<div className={styles.grantsFound}>
							<p>Grants Found</p>
							<p>{grantsFound}</p>
						</div>
					</div>
				</div>
			</div>

			<StacksLogo className={styles.stacksSVG} />
		</div>
	);
};

export default GrantDataExporter;

const wrapper = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	paddingRight: 26,
	paddingTop: 38,
	position: 'relative'
}

const link = {
	textDecoration: 'none',
	color: '#fff'
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
