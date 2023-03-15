import React, { useState, useMemo, useEffect } from 'react';
import styles from './GrantType.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import CustomAlert from '../components/CustomAlert';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import ApplicationProgress from '../components/ApplicationProgress';


export default function PaymentTable() {

    const [alertVisible, setAlertVisible] = useState(false);

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
            </div>

            <ApplicationProgress progress={'50%'} />

            <div className={styles.onBoardingWrapper}>
                <div className={styles.onBoardingRow}>
                    <div className={styles.onBoardingLeft}>
                        <h2 className={styles.paymentHeading}>
                            Payment Quantity and Sizing
                        </h2>
                        <p className={`${styles.text} ${styles.paymentText}`} >
                            The chart below states the number of payments and the percentage of the total project budget issued for each payment. These numbers are a function of the total project budget.
                        </p>

                        <ul className={styles.paymentList}>
                            <li className={styles.paymentListHeader}>
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
                                <span>$10k to $23,999</span>
                                <span>3 (2 milestone)</span>
                                <span>33%</span>
                            </li>
                            <li className={styles.paymentListItem}>
                                <span>$24k to $48,000</span>
                                <span>4 (3 milestone)</span>
                                <span>25%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
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
