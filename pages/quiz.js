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
import CheckMark from '../public/images/checkmark.svg';
import SuccessModal from '../components/SuccessModal';
import ThanksModal from '../components/ThanksModal';
import { useSession, signIn, signOut } from 'next-auth/react';
import ApplicationProgress from '../components/ApplicationProgress';



export default function GrantOnboarding() {
        const { data: session } = useSession();
        const [successModalVisible,setSuccessModalVisible] = useState(false);
        const [thanksModalVisible,setThanksModalVisible] = useState(false);
        const [alertVisible,setAlertVisible] = useState(false); 
        const [checkBox,setCheckBox] = useState({
            checkBox1: false,
            checkBox2: false,
            checkBox3: false,
            checkBox4: false,
            checkBox5: false,
            checkBox6: false,
            checkBox7: false,
        })

        useEffect(()=>{
            console.log('Session is ; - ',session);
        },[])


        const handleCheckBoxChange = (event) => {
            const {name,checked} = event.target;
            setCheckBox({...checkBox,[name]: checked})
        }
       
        const handleSubmit = () => {
            function allChecked(obj) {
                for (let prop in obj) {
                  if (!obj[prop]) {
                    return false;
                  }
                }
                return true;
            }
            if(allChecked(checkBox)){
                setSuccessModalVisible(true);
                localStorage.setItem('quizCompleted',true);
            }else{
                setThanksModalVisible(true);
                localStorage.setItem('quizCompleted',true);
            }
        }

        const closeModal = () => {
            setThanksModalVisible(false);
            setSuccessModalVisible(false);
        }

        
        
  return (
    <div className={styles.main}>
        <SuccessModal isVisible={successModalVisible}/>
        <ThanksModal isVisible={thanksModalVisible} closeModal={closeModal}/>
        <ApplicationProgress progress={'10%'}/>
        {
			alertVisible ? <CustomAlert title="Please Connect a Wallet" onClose={()=>setAlertVisible(false)}/> : null
		}
        
        <div style={wrapper}>
            <p>
                <Link href={'/'}>
                    Close
                </Link>
            </p>
            <div style={relative}>
                <button onClick={()=>{handleSubmit()}} className={styles.gradientButton} style={{width: 210,position: 'absolute',top: 0,right: 0}}><CheckMark style={{marginRight: 10}}/> Ok</button>
            </div>
        </div>
        
        
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
                                <input className={styles.quizCheckBox} type={'checkbox'} name="checkBox1" checked={checkBox.checkBox1} onChange={handleCheckBoxChange}/>
                                <p>My project is highly technical and all requested funding is for development time (hours).</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'} name="checkBox2" checked={checkBox.checkBox2} onChange={handleCheckBoxChange}/>
                                <p>100% of the funding I am seeking is for the development of free and open-source code.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'} name="checkBox3" checked={checkBox.checkBox3} onChange={handleCheckBoxChange}/>
                                <p>My project will not require any follow up funding for maintenance or upkeep.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'} name="checkBox4" checked={checkBox.checkBox4} onChange={handleCheckBoxChange}/>
                                <p>I have read the <a href='' className={styles.purpleLink}>terms and conditions</a> and any work I perform as a result of grant funding will comply with them.</p>
                            </div>
                            <h2 style={mt20}>
                                MY PROJECT ALIGNS WITH CURRENT STACKS PRIORITIES:
                            </h2>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'} name="checkBox5" checked={checkBox.checkBox5} onChange={handleCheckBoxChange}/>
                                <p>I have read the <a className={styles.purpleLink}>2023 Grant Program Priorities</a> blog post and feel my project is complimentary to the current direction of the Grants program.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'} name="checkBox6" checked={checkBox.checkBox6} onChange={handleCheckBoxChange}/>
                                <p>I have read the <a className={styles.purpleLink}>sBTC whitepaper</a> and the <a className={styles.purpleLink}>Nakamoto release whitepaper</a> and my project directly relates to those technologies.</p>
                            </div>
                            <div className={styles.flex}>
                                <input className={styles.quizCheckBox} type={'checkbox'} name="checkBox7" checked={checkBox.checkBox7} onChange={handleCheckBoxChange}/>
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

const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: 26,
    paddingTop: 38,
    position: 'relative'
}

const relative = {
    position: 'relative',
    marginTop: 20
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
