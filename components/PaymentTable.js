import React, { useState, useMemo, useEffect } from 'react';
import styles from './PaymentTable.module.css';
import Link from 'next/link';
import CustomAlert from '../components/CustomAlert';
import ApplicationProgress from '../components/ApplicationProgress';

export default function PaymentTable({ isVisible, closeModal }) {
    const [alertVisible, setAlertVisible] = useState(false);

    return (
        <div className={styles.main} style={{ display: isVisible ? 'flex' : 'none' }}>
            {
                alertVisible ? <CustomAlert title="Please Connect a Wallet" onClose={() => setAlertVisible(false)} /> : null
            }
            <div style={wrapper}>
            <button onClick={closeModal} className={styles.backButton}><span style={{color: '#fff',cursor: 'pointer'}}>Back</span></button>
            <span style={bar}></span>
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
                                <span>PROJECT BUDGET</span>
                                <span>NUMBER OF PAYMENTS</span>
                                <span>% OF BUDGET PER PAYMENT</span>
                            </li>
                            <li className={styles.paymentListItem}>
                                <span>$0 to $9,999</span>
                                <span><span className={styles.fontWeight700}>2</span> (1 milestone)</span>
                                <span>50%</span>
                            </li>
                            <li className={styles.paymentListItem}>
                                <span>$10k to $23,999</span>
                                <span><span className={styles.fontWeight700}>3</span> (2 milestone)</span>
                                <span>33%</span>
                            </li>
                            <li className={styles.paymentListItem}>
                                <span>$24k to $48,000</span>
                                <span><span className={styles.fontWeight700}>4</span> (3 milestone)</span>
                                <span>25%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: 26,
    paddingTop: 20,
    position: 'absolute',
    top: 0,
    right: 0
}


const bar = {
    height: 2,
    width: 30,
    borderRadius: 3,
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: '#fff'
}