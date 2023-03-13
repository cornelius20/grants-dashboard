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
import ApplicationProgress from '../components/ApplicationProgress';


export default function PaymentTable() {
        
        const [visible,setVisible] = useState(false);
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
                    
                </a>
            </Link>
        </div>

        <ApplicationProgress progress={'50%'}/>
        
        <div className={styles.onBoardingWrapper}>
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft}>
                            <h2 style={{fontSize: 20,color: '#fff'}}>
                                Payment Quantity and Sizing
                            </h2>
                            <p className={styles.text} style={{fontWeight: 'bold',color: 'rgba(255, 255, 255, 0.48);'}}>
                                The chart below states the number of payments and the percentage of the total project budget issued for each payment. These numbers are a function of the total project budget.
                            </p>
                            
                            <ul className={styles.paymentList}>
                                <li className={styles.paymentListItem} style={{fontWeight: 700,fontSize: 16}}>
                                    <span>Project Budget</span>
                                    <span>Number of Payments</span>
                                    <span>% of Budget per Payment</span>
                                </li>
                                <li className={styles.paymentListItem}>
                                    <span>$0 to $9,999</span>
                                    <span>2 (1 milestone)</span>
                                    <span>50%</span>
                                </li>
                                <li className={styles.paymentListItem}>
                                    <span>$0 to $9,999</span>
                                    <span>2 (1 milestone)</span>
                                    <span>50%</span>
                                </li>
                                <li className={styles.paymentListItem}>
                                    <span>$0 to $9,999</span>
                                    <span>2 (1 milestone)</span>
                                    <span>50%</span>
                                </li>
                                <li className={styles.paymentListItem}>
                                    <span>$0 to $9,999</span>
                                    <span>2 (1 milestone)</span>
                                    <span>50%</span>
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
