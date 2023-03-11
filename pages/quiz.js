import React,{useState,useMemo,useEffect} from 'react';
import styles from './GrantType.module.css';
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


export default function GrantOnboarding() {
        const [loading,setLoading] = useState(false); 
        const { addToast } = useToasts();
        const [firstName, setFirstName] = useState("")
        const [lastName, setLastName] = useState("")
        const [stxMemo, setStxMemo] = useState("")
        const [email, setEmail] = useState("")
        const [country, setCountry] = useState("")
        const [emailError,setEmailError] = useState(false)
        const [firstNameError,setFirstError] = useState(false)
        const [lastNameError,setLastNameError] = useState(false)
        const [stxMemoError,setStxMemoError] = useState(false)
        const [grantIssueNumberError,setGrantIssueNumberError] = useState(false)
        const [anticipatedCompletionDate, setAnticipatedCompletionDate] = useState(new Date())
        const [visible,setVisible] = useState(false);
        const [endDate, setEndDate] = useState(new Date());
        const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
        const { stxAddress, identityAddress, rawAddress } = useAccount();
        const label = isRequestPending ? 'Loading...' : isSignedIn ? `${stxAddress.slice(0,9)}...(Disconnect)` : 'Connect Wallet';
        const [grantIssues,setGrantIssues] = useState([]);
        const [grantIssueNumber,setGrantIssueNumber] = useState(null);
        const [grantName,setGrantName] = useState(null);
        const [grantBudget,setGrantBudget] = useState(null);
        const [grantsFound, setGrantsFound] = useState(0);
        const [browserError,setBrowserError] = useState(false);
        const [alertVisible,setAlertVisible] = useState(false);

       
        
  return (
    <div className={styles.main}>
        {
			alertVisible ? <CustomAlert title="Please Connect a Wallet" onClose={()=>setAlertVisible(false)}/> : null
		}
        <div style={{position: 'relative'}}>
            <Link href="/">
                <a>
                    <div className={styles.close}>
                        <p>
                            <CloseIcon />
                            Close
                        </p>
                    </div>
                    <div className={styles.close} style={{position: 'absolute',top: 40,right: 0}}>
                        <button className={styles.gradientButton} style={{width: 210}}>Ok</button>
                    </div>
                </a>
            </Link>
        </div>
        <BrowserWallet visible={browserError} handleClose={()=>setBrowserError(false)}/>
        <AddWallet visible={visible} handleClose={()=>setVisible(false)}/>
        {/* <ExploreModal visible={true} handleClose={()=>setVisible(false)}/> */}
        {/* <PopupModal visible={visible} handleClose={()=>setVisible(false)}/> */}
        <div className={styles.onBoardingWrapper}>
            
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft}>
                            <h2 style={{fontSize: 20}}>
                                Is your project a good fit for the Grants Program?
                            </h2>
                            <p style={mb4} className={styles.text}>
                                Before proceeding, check all the boxes that apply to your project idea:
                            </p>
                            <h2>
                                MY PROJECT IS A PUBLIC GOOD:
                            </h2>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'}/>
                                <p>My project is highly technical and all requested funding is for development time (hours).</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'}/>
                                <p>100% of the funding I am seeking is for the development of free and open-source code.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'}/>
                                <p>My project will not require any follow up funding for maintenance or upkeep.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'}/>
                                <p>I have read the <a href='' className={styles.purpleLink}>terms and conditions</a> and any work I perform as a result of grant funding will comply with them.</p>
                            </div>

                            <h2 style={mt20}>
                                MY PROJECT ALIGNS WITH CURRENT STACKS PRIORITIES:
                            </h2>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'}/>
                                <p>I have read the <a className={styles.purpleLink}>2023 Grant Program Priorities</a> blog post and feel my project is complimentary to the current direction of the Grants program.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'}/>
                                <p>I have read the <a className={styles.purpleLink}>sBTC whitepaper</a> and the <a className={styles.purpleLink}>Nakamoto release whitepaper</a> and my project directly relates to those technologies.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'}/>
                                <p>I have read the <a className={styles.purpleLink}>current grant priorities</a> and my project directly relates to those priorities.</p>
                            </div>
                </div>
                {/* <div className={styles.onBoardingRight} style={{textAlign: 'right'}}>
                    <button className={styles.gradientButton} style={rightBtn}>Ok</button>
                </div> */}
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

const rightBtn = {
    width: 200,
    marginLeft: 'auto'
}

const mt20 = {
    marginTop: 30
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
