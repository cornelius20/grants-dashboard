import React from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export default function GrantCSVExporter() {
    return (
        <div style={main}>
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
                <p style={marginTop20}>
                    A simple widget for exporting grant data from the grants database as a .CSV file.
                </p>
                <form style={marginTop50}>
                    <div className={styles.formRow}>
                        <div>
                            <label>A. Select Project Type(s)</label>
                            <select name="selectCountry">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>
                        </div>
                        <div className={styles.formControl}>
                            <label>D. Select Start Date <span style={grayColor}>(6 months max)</span></label>
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
                            <label>E. Select End Date <span style={grayColor}>(6 months max)</span></label>
                            <select name="selectCompletion">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>

                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div style={flex}>
                            <label>C. Select Project Phase</label>
                            <select name="selectCountry">
                                <option value="usd">USD</option>
                                <option value="stx">STX</option>
                            </select>
                        </div>
                        <div style={flex}>
                            <button className={styles.width250}>Click to Export</button>
                        </div>
                    </div>
                    <div style={bottomView}>
                        <div style={bottomBox}>
                            <span style={[font12, grayColor]}>Date Range</span>
                            <p style={[bold, grayColor]}>Aug-24-22 to Sept-01-22</p>
                        </div>
                        <div style={bottomBox}>
                            <span style={[font12, grayColor]}>Projects Found</span>
                            <p>88</p>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

const main = {
	background: '#000',
	height: '100vh'
}

const flex = {
    flex: 1
}

const bottomView = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 15
}

const font12 = {
    fontSize: 12
}

const marginTop20 = {
    marginTop: 20
}

const marginTop50 = {
    marginTop: 50
}

const grayColor = {
    color: 'gray'
}

const bold = {
    fontWeight: 'bold'
}

const bottomBox = {
    flex: 1,
    padding: 20,
    border: '1px solid gray',
    borderRadius: 10
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
