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
import Person from '../public/images/person.svg';
import Arrow from '../public/images/arrow.svg';
import PayTag from '../public/images/payTag.svg';
import WaterDrop from '../public/images/waterDrop.svg';
import CheckMark from '../public/images/checkmark.svg';
import ApplicationProgress from '../components/ApplicationProgress';

export default function GrantType() {
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
                        <button className={styles.gradientButton} style={{width: 210}}><CheckMark style={{marginRight: 10}}/> Ok</button>
                    </div>
                </a>
            </Link>
        </div>

        <ApplicationProgress progress={'50%'}/>
        
        <div className={styles.onBoardingWrapper}>
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft}>
                            <h2 style={{fontSize: 20,color: '#fff'}}>
                                Grant Track
                            </h2>
                            <p className={styles.text} style={{fontWeight: 'bold'}}>
                                Select the grant type below:
                            </p>
                            
                            <ul className={styles.grantTypeList}>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input style={{visibility: 'hidden'}} type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span style={{display:'flex',alignItems: 'center',gap: 10,textTransform: 'uppercase',fontSize: 12}}><Person/> NAME</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span style={{display:'flex',alignItems: 'center',gap: 10,textTransform: 'uppercase',fontSize: 12}}><PayTag/> Budget $ 1</span>
                                        </div>
                                        <div>
                                            <span style={{display:'flex',alignItems: 'center',gap: 10,textTransform: 'uppercase',fontSize: 12}}><WaterDrop/> Funding Stream <Arrow/></span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName}>Open Source Development</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream}>Developer Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <p className={styles.text}>
                                Please note we are currently not accepting applications for the following Grant Types.
                            </p>

                            <ul className={styles.grantTypeList}>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input style={{visibility: 'hidden'}} type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span style={{display:'flex',alignItems: 'center',gap: 10,textTransform: 'uppercase',fontSize: 12}}><Person/> NAME</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span style={{display:'flex',alignItems: 'center',gap: 10,textTransform: 'uppercase',fontSize: 12}}><PayTag/> Budget $ 1</span>
                                        </div>
                                        <div>
                                            <span style={{display:'flex',alignItems: 'center',gap: 10,textTransform: 'uppercase',fontSize: 12}}><WaterDrop/> Funding Stream <Arrow/></span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName}>Stacks Community Builder Grant</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName}>Stacks Education Grant</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName}>Stacks Event Grant</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName}>Stacks Chapter Grant (by Region)</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>Varies</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName}>Stacks Foundation Resident Program</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>Varies</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'lightgreen'}}>Advanced Support</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                
                            </ul>
                            
                            

                            
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
const main = {
	backgroundColor: '#000',
	height: '100vh'
}

const flex1 = {
    flex: 1
}

const displayFlex = {
    display: "flex"
}

const titleView = {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
}

const listTitle = {
    fontWeight: 'bold',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    cursor: 'pointer'
}


const marginLeft10 = {
    marginLeft:10
}

const addUser = {
    color: '#fff',
    marginBottom: 20
}

const githubView = {
    display: 'flex',
    flexDirection:"row",
    width:"100%",
    alignItems:'flex-end'
}

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
