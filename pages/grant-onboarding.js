import React, { useState, useMemo, useEffect } from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import CalendarDropdown from '../components/CalendarDropdown';
import ExploreModal from '../components/ExploreModal';
import { useAuth } from '@micro-stacks/react';
import { useAccount } from '@micro-stacks/react';
import { grantOnboarding } from '../utils/ApiCalls';
import { Octokit } from '@octokit/rest';
import AddWallet from '../components/AddWalletModal';

import DropdownIcon from '../public/images/dropdown.svg';
import LoadingSpinner from '../public/images/loading-spinner.svg';
import BrowserWallet from '../components/BrowserWallet';
import CustomAlert from '../components/CustomAlert';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { useToasts } from 'react-toast-notifications';
import CountriesDropdown from '../components/CountriesDropdown';

export default function GrantOnboarding() {
    const [loading, setLoading] = useState(false);
    const { addToast } = useToasts();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [stxMemo, setStxMemo] = useState("")
    const [email, setEmail] = useState("")
    const [country, setCountry] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [firstNameError, setFirstError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [stxMemoError, setStxMemoError] = useState(false)
    const [grantIssueNumberError, setGrantIssueNumberError] = useState(false)
    const [anticipatedCompletionDate, setAnticipatedCompletionDate] = useState(new Date())
    const [visible, setVisible] = useState(false);
    const [endDate, setEndDate] = useState(new Date());
    const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
    const { stxAddress, identityAddress, rawAddress } = useAccount();
    const label = isRequestPending ? 'Loading...' : isSignedIn ? `${stxAddress.slice(0, 15)}...(Disconnect)` : 'Connect Wallet';
    const [grantIssues, setGrantIssues] = useState([]);
    const [grantIssueNumber, setGrantIssueNumber] = useState(null);
    const [grantName, setGrantName] = useState(null);
    const [grantBudget, setGrantBudget] = useState(null);
    const [grantsFound, setGrantsFound] = useState(0);
    const [browserError, setBrowserError] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [memoNotRequired, setMemoNotRequired] = useState(false)

    const [CSVData, setCSVData] = useState([
        [
            'Date Submitted',
            'Github Issue Number',
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
    const walletButtonClicked = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (err) {
                console.log('Failed to Signout');
                window.location.reload()
            }
        }
        else {
            let userAgent = navigator.userAgent;
            let browserName;
            if (userAgent.match(/chrome|chromium|crios/i)) {
                browserName = "chrome";
            } else if (userAgent.match(/firefox|fxios/i)) {
                browserName = "firefox";
            } else if (userAgent.match(/brave/i)) {
                browserName = "brave";
            } else if (userAgent.match(/safari/i)) {
                browserName = "safari";
            } else if (userAgent.match(/opr\//i)) {
                browserName = "opera";
            } else if (userAgent.match(/edg/i)) {
                browserName = "edge";
            } else {
                browserName = "No browser detection";
            }

            if (browserName == 'chrome' || browserName == 'firefox' || browserName == 'brave') {
                try {
                    await openAuthRequest();
                } catch (error) {
                    console.log("error is here", error);
                    // Extension Not available Modal
                    setVisible(true);
                }
            } else {
                console.log('Browser name is : - ', browserName);
                // Browser not supported modal
                setBrowserError(true);
            }
        }
    }

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
        'Grantee Onboarding',
        'Completing Initial Deliverable',
        'Completing Milestone(s)',
        'Grant Completed',
        'Grant is Stale',
        'Grant is Closed'
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

    useEffect(() => {
        getIssues();
    }, [])


    async function getIssues() {
        try {
            issues = [];
            const github = new Octokit();
            setLoading(true);
            let res = []
            for await (const label of grantStatusArr) {
                let req = await github.rest.issues.listForRepo({
                    owner: "stacksgov",
                    repo: "Stacks-Grant-Launchpad",
                    state: "all",
                    labels: [label],
                });
                let newReq = res.concat(req.data);
                res = newReq
            }
            console.log('Issues response is : - ', res);

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
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        console.log(firstName, lastName, email, stxAddress, stxMemo, country, anticipatedCompletionDate);
        const [day, month, year] = anticipatedCompletionDate.toLocaleDateString().split('/');
        if (isSignedIn) {
            let onBoardingData = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "stxAddress": stxAddress,
                "stxMemo": stxMemo,
                "country": country,
                "grantIssueNumber": grantIssueNumber,
                "grantName": grantName,
                "grantBudget": grantBudget,
                "anticipatedCompletionDate": `${year}-${month}-${day}`
            }
            e.preventDefault();
            const valid = validateInputFields();
            if (valid) {
                setLoading(true);
                try {
                    const res = await grantOnboarding(onBoardingData);
                    if (res.success) {
                        addToast('Successfully added!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 });
                        resetInputFields();
                    } else {
                        addToast('Failed to add!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 3000 });
                    }
                } catch (err) {
                    addToast('Something went wrong!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 3000 });
                }
                setLoading(false);
            }

        } else {
            setAlertVisible(true);
        }
    }

    const handleGrantChange = (e) => {
        console.log('aaa',);
        const [_id, _grantName, _grantBudget] = e.target.value.split('-');
        setGrantIssueNumber(_id);
        setGrantName(_grantName);
        setGrantBudget(_grantBudget);

    }

    const handleIssueNumber = (e) => {
        console.log('aaa',);
        const [_id, _grantName, _grantBudget] = e.target.value.split('-');
        setGrantIssueNumber(_id);
    }

    const validateInputFields = () => {

        setEmailError(false);
        setFirstError(false);
        setLastNameError(false);
        setStxMemoError(false);
        setGrantIssueNumberError(false);

        if (!email) {
            setEmailError(true);
        }
        if (!firstName) {
            setFirstError(true);
        }
        if (!lastName) {
            setLastNameError(true);
        }
        if (!stxMemo && !memoNotRequired) {
            setStxMemoError(true);
        }
        if (!grantIssueNumber) {
            setGrantIssueNumberError(true)
        }

        if (email && firstName && lastName && (stxMemo || memoNotRequired) && grantIssueNumber) {
            return true;
        } else {
            return false;
        }
    }

    const resetInputFields = () => {
        setFirstName("");
        setLastName("");
        setStxMemo("");
        setEmail("");
        setCountry("");
        setAnticipatedCompletionDate(new Date());
    }

    return (
        <div className={styles.main}>
            {
                alertVisible ? <CustomAlert title="Please Connect a Wallet" onClose={() => setAlertVisible(false)} /> : null
            }
            <div style={wrapper}>
                <p>
                    <Link href={'/'}>
                        Close
                    </Link>
                </p>
                <span style={bar}></span>
            </div>
            <BrowserWallet visible={browserError} handleClose={() => setBrowserError(false)} />
            <AddWallet visible={visible} handleClose={() => setVisible(false)} />
            <div className={styles.onBoardingWrapper}>
                <h2>
                    Grant Onboarding
                </h2>
                <div className={styles.onBoardingRow}>
                    <div className={styles.onBoardingLeft}>
                        <p style={mb4} className={styles.text}>
                            A simple widget for providing private information required for receiving grant payments.
                        </p>
                        {
                            loading ? <LoadingSpinner />
                                :
                                <>
                                    <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>First Name</label>
                                            <input
                                                className={styles.formInput}
                                                name="FirstName"
                                                type="type"
                                                placeholder="Type here..."
                                                value={firstName}
                                                onChange={(e) => { setFirstName(e.target.value) }}
                                            />
                                            {firstNameError && <span className={styles.validationError}>Required!</span>}
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>Last Name</label>
                                            <input
                                                className={styles.formInput}
                                                name="LastName"
                                                type="type"
                                                placeholder="Type here..."
                                                value={lastName}
                                                onChange={(e) => { setLastName(e.target.value) }}
                                            />
                                            {lastNameError && <span className={styles.validationError}>Required!</span>}

                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>Email Address</label>
                                            <input
                                                className={styles.formInput}
                                                name="Email"
                                                type="email"
                                                placeholder="Type here..."
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                            />
                                            {emailError && <span className={styles.validationError}>Required!</span>}

                                        </div>
                                    </div>
                                    <div className={styles.formRow} style={{ mb1 }}>
                                        <div className={styles.formControl}>
                                            <label>STX Wallet Address</label>
                                            <button onClick={walletButtonClicked} className={styles.walletButton}>
                                                {label}
                                            </button>

                                        </div>
                                        <div className={styles.formControl}>
                                            <label>STX Wallet Memo</label>
                                            <input
                                                className={styles.formInput}
                                                name="WalletMemo"
                                                type="text"
                                                placeholder="Type here..."
                                                value={stxMemo}
                                                onChange={(e) => { setStxMemo(e.target.value) }}
                                            />
                                            {stxMemoError && <span className={styles.validationError}>Required!</span>}
                                            <span style={checkbox}>
                                            <input 
                                                type={'checkbox'} 
                                                value={memoNotRequired}
                                                onChange={(e) => { setMemoNotRequired(e.target.value) }}
                                            />  I confirm no memo is required</span>
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <CountriesDropdown setCountry={setCountry} />
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>Anticipated Completion Date <span style={grayColor}>(6 months max)</span></label>
                                            <CalendarDropdown onChange={setAnticipatedCompletionDate} value={anticipatedCompletionDate} />
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                    <div className={styles.onBoardingRight}>
                        <div className={styles.formControl}>
                            <label style={{ marginBottom: 10 }}>Select Issue Number:</label>
                            <div className={styles.selectWrapper}>
                                <DropdownIcon className={styles.selectIssueArrow} />
                                <select className={styles.issueSelect} onChange={(e) => handleGrantChange(e)} name="selectIssue">
                                    {
                                        CSVData?.length > 1 && CSVData.map(item => {
                                            return (<option key={item[1]} value={`${item[1]}-${item[6]}-${item[7]}`}>{item[1]}</option>)
                                        })
                                    }
                                </select>
                            </div>
                            {grantIssueNumberError && <span className={styles.validationError}>Required!</span>}
                        </div>
                        <h5>Issue Number:</h5>
                        <p>{grantIssueNumber ? grantIssueNumber : ''}</p>
                        <h5>Grant Name:</h5>
                        <p>{grantName ? grantName : ''}</p>
                        <h5>Grant Budget:</h5>
                        <p>{grantBudget ? '$' + grantBudget : ''}</p>
                        <p style={marginBottom120}></p>
                        <div className={styles.divider}></div>
                        <p style={{ ...whiteColor, ...marginTop10 }}>If any of the information provided above is incorrect please email us <a style={mailLink} href="mailto:grants@stacks.org">here.</a></p>
                        <span style={checkbox}><input className={styles.mt3} type={'checkbox'} /> <p className={styles.white}>I confirm all of the information on this page is correct.</p></span>
                        <button className={styles.gradientButton} disabled={loading} onClick={(e) => { handleSubmit(e) }}>
                            {
                                loading ? <LoadingSpinner /> : 'Click to Submit'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// const main ={
// 	backgroundColor: '#000',
// 	height: '100vh'
// }

const flex2 = {
    flex: 2
}

const checkbox = {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
    color: '#fff'
}

const marginBottom120 = {
    marginBottom: 120
}

const mb4 = {
    marginBottom: 40
}

const mb1 = {
    marginBottom: 10
}

const mailLink = {
    color: "#fff",
    textDecorationLine: 'underline'
}

const marginTop10 = {
    marginTop: 10,
}

const grayColor = {
    color: 'gray'
}

const whiteColor = {
    color: '#E2E8F0',
}

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
