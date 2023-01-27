import React from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export default function GrantCSVExporter() {
    return (
        <div style={{ background: '#000', height: '100vh' }}>
            <Link href="/">
                <a>
                    <div className={styles.close}>
                        <p>
                            <CloseIcon />
                            Close
                        </p>
                        <span></span>
                    </div>
                </a>
            </Link>
            <div className={styles.onBoardingWrapper}>
                <h2>
                    Grants Database Exporter
                </h2>
                <p style={{marginBottom: 20}}>
                    A simple widget for exporting grant data from the grants database as a .CSV file.
                </p>
                <form style={{marginTop: 50}}>
                    <div className={styles.formRow}>
                        <div>
                            <label>A. Select Project Type(s)</label>
                            <select name="selectCountry">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>
                        </div>
                        <div className={styles.formControl}>
                            <label>D. Select Start Date <span style={{ color: 'gray' }}>(6 months max)</span></label>
                            <select name="selectCompletion">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>

                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div>
                            <label>B. Select Project Track(s)</label>
                            <select name="selectCountry">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>
                        </div>
                        <div className={styles.formControl}>
                            <label>E. Select End Date <span style={{ color: 'gray' }}>(6 months max)</span></label>
                            <select name="selectCompletion">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>

                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div style={{flex: 1}}>
                            <label>C. Select Project Phase</label>
                            <select name="selectCountry">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>
                        </div>
                        <div style={{flex: 1}}>
                            <button style={{width: 250}}>Click to Export</button>
                        </div>
                    </div>
                    <div style={{display: 'flex',justifyContent: 'space-between',gap: 15}}>
                        <div style={{flex: 1,padding: 20,border: '1px solid gray',borderRadius: 10}}>
                            <span style={{fontSize: 12,color: 'gray'}}>Date Range</span>
                            <p style={{fontWeight: 'bold',color: 'gray'}}>Aug-24-22 to Sept-01-22</p>
                        </div>
                        <div style={{flex: 1,padding: 20,border: '1px solid gray',borderRadius: 10}}>
                            <span style={{fontSize: 12,color: 'gray'}}>Projects Found</span>
                            <p>88</p>
                        </div>
                    </div>
                </form>

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
