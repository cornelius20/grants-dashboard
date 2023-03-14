import React, { useState, useMemo, useEffect } from 'react';
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
import ApplicationProgress from '../components/ApplicationProgress';
import CheckMark from '../public/images/checkmark.svg';
import { useRouter } from 'next/router';

export default function GrantTrack() {
    const [alertVisible, setAlertVisible] = useState(false);
    const router = useRouter();

    const validateGrantTrack = () => {
        router.push('/')
    }

    return (
        <div className={styles.main}>
            {
                alertVisible ? <CustomAlert title="Please Connect a Wallet" onClose={() => setAlertVisible(false)} /> : null
            }
            <div style={{ position: 'relative' }}>
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
                <div className={styles.close} style={{ position: 'absolute', top: 40, right: 0 }}>
                    <button onClick={validateGrantTrack} className={styles.gradientButton} style={{ width: 210 }}><CheckMark style={{ marginRight: 10 }} /> Ok</button>
                </div>
            </div>

            <ApplicationProgress progress={'75%'} />

            <div className={styles.onBoardingWrapper}>
                <div className={styles.onBoardingRow}>
                    <div className={styles.onBoardingLeft}>
                        <h2 style={{ fontSize: 20, color: '#fff' }}>
                            Grant Track
                        </h2>
                        <p style={mb4} className={styles.text}>
                            Before proceeding, check all the boxes that apply to your project idea:
                        </p>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading}>Stacks Protocol</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>Blockchain Improvements, sBTC, Subnets, PoX, SIP research, etc</li>
                                </ul>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading}>Stacks Interface</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>APIs, Indexers, Decentralized Identification, Wallets, Explorers, etc.</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading}>Cross-Chain & Off Chain</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>Decentralized Storage Integrations, Oracles & Bridges, EVM Integrations, etc.</li>
                                </ul>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading}>Bitcoin Utility via Stacks</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>DLC-Clarity Explorations, BTC-STX Wallets BTC-Native DeFi (using Stacks), etc.</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading}>Stacks Developer Experience</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>Tooling, Software Development Kits, Libraries, Faucets, Sandboxes, etc.</li>
                                </ul>
                            </div>
                            <div className={styles.col}>

                            </div>

                        </div>

                        <p style={mb4} className={styles.text}>
                            Please note we are currently not accepting applications for the following Grant Tracks.
                        </p>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading2}>Stacks dApps & Clarity</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>Clarity Improvements, SIP Development, Smart Contract Templates, dApps, etc.</li>
                                </ul>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading2}>Stacks Education and Community</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>Documentation, Tutorials, Workshops, Governance, Education, Content Creation, etc.</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.grantTypeFlex}>
                                    <input type={'radio'} />
                                    <h2 className={styles.heading2}>Stacks User Experience</h2>
                                </div>
                                <ul className={styles.grantList}>
                                    <li>UX/UI Research, Speculative Design Studies, Prototypes, Component Libraries, etc</li>
                                </ul>
                            </div>
                            <div className={styles.col}>

                            </div>

                        </div>


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
