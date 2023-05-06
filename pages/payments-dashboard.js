import React, { useEffect, useState } from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import { Octokit } from '@octokit/rest';
import DropdownIcon from '../public/images/dropdown.svg';
import LoadingSpinner from '../public/images/loading-spinner.svg';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import { findGrant, paymentUpdateUser } from '../utils/ApiCalls';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { useToasts } from 'react-toast-notifications';
import BackButton from '../components/BackButton';
import Input from '../components/Input';

export default function PaymentsDashboard() {
    const { data: session } = useSession();
    const { addToast } = useToasts();
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [grantTracks, setGrantTracks] = useState('');
    const [grantPhase, setGrantPhase] = useState('');
    const [grantType, setGrantType] = useState('');
    const [endDate, setEndDate] = useState(new Date());
    let pastSevenDays = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const [startDate, setStartDate] = useState(pastSevenDays);
    const [grantIssues, setGrantIssues] = useState([]);
    const [grantIssueNumber, setGrantIssueNumber] = useState(null);
    const [grantName, setGrantName] = useState(null);
    const [grantBudget, setGrantBudget] = useState(null);
    const [grantCompletionDate, setGrantCompletionDate] = useState(null);
    const [totalGrantPaidToDate, setTotalGrantPaidToDate] = useState(null);
    const [grantsFound, setGrantsFound] = useState(0);
    const [stxAmount, setStxAmount] = useState(null)
    const [usdAmount, setUsdAmount] = useState(null)
    const [stxAmountError,setStxAmountError] = useState(false);
    const [usdAmountError,setUsdAmountError] = useState(false);
    const [stacksIdError,setStacksIdError] = useState(false);
    const [paymentsLength, setPaymentsLength] = useState(0)
    const [paymentNumber, setPaymentNumber] = useState(1)
    const [txID, setTxID] = useState(null)
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
    const [paymentData, setpaymentData] = useState([

        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10

    ]);


    useEffect(() => {
        const username = session?.user?.name.toLowerCase();
        if (!(username.startsWith('cor') || username.startsWith('will') || username.startsWith('ivo') || username.startsWith('shakti'))) {
            router.push('/');
        }
    }, [])

    const predictedImpactScoreArr = ['6', '5', '4', '3', '2', '1'];


    const walletButtonClicked = async () => {
        if (isSignedIn) {
            await signOut();
        }
        else {
            await openAuthRequest();
        }
    }

    useEffect(() => {
        console.log('CSV data is : - ', CSVData);
    }, [CSVData])

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

    useEffect(() => {
        getIssues();
    }, [])

    async function getIssues() {
        issues = [];
        const github = new Octokit({
            auth: session.accessToken,
        });
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


        res?.map((issue) => {
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
    }

    const handleGrantChange = async (e) => {
        const [_id, _grantName, _grantBudget] = e.target.value.split('-');
        setGrantIssueNumber(_id);
        setGrantName(_grantName);
        setGrantBudget(_grantBudget);
        let findDateAndBudget = await findGrant(_id);
        if (findDateAndBudget?.grant) {
            setGrantCompletionDate(findDateAndBudget?.grant?.anticipatedCompletionDate)
            let totalAmountString = findDateAndBudget?.grant?.payments?.totalPayments?.toString()
            if (totalAmountString?.indexOf('.') === -1) {
                totalAmountString += '.000';
            } else if (totalAmountString?.indexOf('.') === totalAmountString?.length - 2) {
                totalAmountString += '0';
            }
            setTotalGrantPaidToDate(totalAmountString)
            setPaymentsLength(findDateAndBudget?.grant?.payments.paymentsMade?.length)
        } else {
            setGrantCompletionDate(null)
            setTotalGrantPaidToDate(null)
            setPaymentsLength(0)
        }
    }

    const handleSubmit = async (e) => {
        let formData = JSON.parse(localStorage.getItem("formData"));

        const paymentTransactionID = formData['transactionID'];
        const paymentStxAmount = formData['stxAmount'];
        const paymentUsdAmount = formData['usdAmount'];

        const checkField = (field) => {
            if (field.value == undefined || field.value == "") {
                field.style.borderColor = 'red';
                field.style.outlineColor = "red";
            }else{
                field.style.outlineColor = "#3182ce";
                field.style.borderColor = "#3182ce";
            }

        }

        checkField(document.getElementsByName('transactionID')[0])
        checkField(document.getElementsByName('stxAmount')[0])
        checkField(document.getElementsByName('usdAmount')[0])

        if(paymentTransactionID && paymentStxAmount && paymentUsdAmount){

            let paymentData = {
                "grantIssueNumber": grantIssueNumber,
                "paymentsMade": {
                    "id": paymentNumber,
                    "date": new Date(),
                    "txID": paymentTransactionID,
                    "stxAmount": paymentStxAmount,
                    "usdAmount": parseFloat(paymentUsdAmount)
                }
            }
    
            e.preventDefault();
            setLoading(true);
            const res = await paymentUpdateUser(paymentData);
            if (res.success) {
                let formattedNum = totalGrantPaidToDate != undefined ? parseFloat(totalGrantPaidToDate) + parseFloat(usdAmount) : parseFloat(usdAmount)
                let totalAmountString = formattedNum?.toString()
                if (totalAmountString.indexOf('.') === -1) {
                    totalAmountString += '.000';
                } else if (totalAmountString.indexOf('.') === totalAmountString.length - 2) {
                    totalAmountString += '0';
                }
                setTotalGrantPaidToDate(totalAmountString);
                setPaymentsLength(paymentsLength + 1)
                addToast('Successfully added!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 });
    
            } else {
                addToast('Failed to add!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 3000 });
            }
            setLoading(false);
        }

        // console.log('Values are : - ',formData['transactionID'],formData['stxAmount'],formData['usdAmount'])
        
    }

    const validateInputFields = () => {
        if(!stxAmount){
            setStxAmountError(true);
        }
        if(!usdAmount){
            setUsdAmountError(true);
        }
        if(!txID){
            setStacksIdError(true);
        }
        if( stxAmount && usdAmount && txID ){
            return true;
        }
        else {
            return false;
        }
    }

    return (
        <div className={styles.main}>

            <BackButton title={'Back to Utilities'} link={'/utilities'} />
            {/* <div style={wrapper}>
                <p>
                    <Link style={link} href={'/utilities'}>
                        <span style={backBtn}>Back to Utilities</span>
                    </Link>
         s       </p>
                <span style={bar}></span>
            </div> */}
            <div className={styles.onBoardingWrapper}>
                {/* <div style={wrapper}>
                    <p>
                        <Link className={styles.whiteLink} href={'/utilities'}>
                            <span style={{color: '#fff',cursor: 'pointer'}}>Back to Utilities</span>
                        </Link> 
                    </p>
                    <span style={bar}></span>
                </div> */}
                <h2>
                    Payments Dashboard
                </h2>
                <div className={styles.onBoardingRow}>
                    <div className={styles.onBoardingLeft}>
                        <p className={styles.text}>
                            A simple widget for inputting payments information into the grants database.
                        </p>
                        <p style={addPayment}>Add a Payment</p>
                        {
                            loading ? <LoadingSpinner /> : <form>
                                <div className={styles.formRow}>
                                    <div className={styles.formControl}>
                                        <label>Github Issues Number</label>
                                        <div className={styles.selectWrapper}>
                                            <DropdownIcon className={styles.customSelectArrow} />
                                            <select className={styles.countrySelect} style={{ height: 50 }} onChange={(e) => handleGrantChange(e)} name="selectIssue">
                                                {
                                                    CSVData?.length > 1 && CSVData.map(item => {
                                                        return (<option key={item[1]} value={`${item[1]}-${item[6]}-${item[7]}`}>{item[1]}</option>)
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Payment Number</label>
                                        <div className={styles.selectWrapper}>
                                            <DropdownIcon className={styles.customSelectArrow} />
                                            <select className={styles.countrySelect} style={{ height: 50 }} onChange={(e) => { setPaymentNumber(e.target.value) }} name="selectIssue">
                                                {
                                                    paymentData.map(item => {
                                                        if (item > paymentsLength) {
                                                            return (<option key={item} value={`${item}}`}>{item}</option>)
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formControl}>
                                        <label>Amount of STX Disbursed</label>
                                        {/* <input
                                            className={styles.formInput}
                                            name="stxAmount"
                                            type="number"
                                            placeholder="Type here..."
                                            value={stxAmount}
                                            onChange={(e) => { setStxAmountError(false);setStxAmount(e.target.value) }}
                                        /> */}
                                        <Input
                                           className={styles.formInput}
                                           name="stxAmount"
                                           isNumber={true}
                                           placeholder="Type here..."
                                        />
                                        {stxAmountError && <span className={styles.validationError}>Required!</span>}
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Equivelant amount of USD</label>
                                        {/* <input
                                            className={styles.formInput}
                                            name="usdAmount"
                                            type="number"
                                            placeholder="Type here..."
                                            value={usdAmount}
                                            onChange={(e) => { setUsdAmountError(false);setUsdAmount(e.target.value) }}
                                        /> */}
                                        <Input
                                             className={styles.formInput}
                                             name="usdAmount"
                                             isNumber={true}
                                             placeholder="Type here..."
                                        />
                                        {/* {usdAmountError && <span className={styles.validationError}>Required!</span>} */}

                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formControl}>
                                        <label>Stacks Transaction ID</label>
                                        {/* <input
                                            className={styles.formInput}
                                            name="transactionID"
                                            type="text"
                                            placeholder="Type here..."
                                            value={txID}
                                            onChange={(e) => { setStacksIdError(false);setTxID(e.target.value) }}
                                            autoComplete="off"
                                        /> */}
                                        <Input
                                             className={styles.formInput}
                                             name="transactionID"
                                             isNumber={true}
                                             placeholder="Type here..."
                                             autoComplete="off"
                                        />
                                        {stacksIdError && <span className={styles.validationError}>Required!</span>}

                                    </div>
                                </div>
                            </form>
                        }
                    </div>
                    <div className={styles.onBoardingRight}>
                        <p style={paymentHistory}>Payment History</p>
                        {grantIssueNumber ?
                            <>
                                <h5>Issue Number:</h5>
                                <p>{grantIssueNumber ? grantIssueNumber : ''}</p>
                                <h5>Grant Name:</h5>
                                <p>{grantName ? grantName : ''}</p>
                                <h5>Agreed upon Completion Date:</h5>
                                <p>{grantCompletionDate ? new Date(grantCompletionDate)?.toDateString() : ""}</p>
                                <h5>Grant Budget:</h5>
                                <p>{grantBudget ? '$' + grantBudget : ''}</p>
                                <h5>Total Paid to date:</h5>
                                <p>{totalGrantPaidToDate ? '$' + totalGrantPaidToDate : ""}</p>
                                <p style={marginBottom70}></p>
                            </> : null}
                        <div className={styles.divider}></div>
                        <button className={styles.gradientButton} style={{ marginTop: grantIssueNumber ? 50 : 320 }} onClick={(e) => { handleSubmit(e) }}>
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

const paymentHistory = {
    color: '#fff',
    marginBottom: 20
}

const addPayment = {
    color: '#fff',
    opacity: .92,
    marginBottom: 25
}

const marginBottom70 = {
    marginBottom: 70
}

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

const backBtn = {
    color: '#718096', 
    cursor: 'pointer'
}

const bar = {
    height: 2,
    width: 30,
    borderRadius: 3,
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: '#718096'
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
