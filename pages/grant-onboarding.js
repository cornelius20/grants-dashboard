import React from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export default function GrantOnboarding() {
  return (
    <div style={{background: '#000',height: '100vh'}}>
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
                Grant Onboarding
            </h2>
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft}>
                    <p>
                        A simple widget for providing private information required for receiving grant payments.
                    </p>
                    <form>
                        <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>First Name</label>
                                <input 
                                    className={styles.formInput}
                                    name="FirstName"
                                    type="type"
                                    placeholder="Type here..."
                                />
                            </div>
                            <div className={styles.formControl}>
                                <label>Last Name</label>
                                <input 
                                    className={styles.formInput}
                                    name="LastName"
                                    type="type"
                                    placeholder="Type here..."
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Email Address</label>
                                <input 
                                    className={styles.formInput}
                                    name="Email"
                                    type="email"
                                    placeholder="Type here..."
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div style={{flex: 2}}>
                                <label>STX Wallet Address</label>
                                <input
                                    className={styles.formInput}
                                    name="WalletAddress"
                                    type="type"
                                    placeholder="Type here..."
                                />
                            </div>
                            <div className={styles.formControl}>
                                <label>STX Wallet Memo</label>
                                <input
                                    className={styles.formInput}
                                    name="WalletMemo"
                                    type="type"
                                    placeholder="Type here..."
                                />
                                <span style={{display: 'flex',gap: 10}}><input type={'checkbox'}/>  I confirm no memo is required</span>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label>Country of Residence</label>
                                <select className={styles.formInput} name="selectCountry">
                                    <option value="usd">USD</option>
                                    <option value="stx">STX</option>
                                </select>
                            </div>
                            <div className={styles.formControl}>
                                <label>Anticipated Completion Date <span style={{color: 'gray'}}>(6 months max)</span></label>
                                <select className={styles.formInput} name="selectCompletion">
                                    <option value="usd">USD</option>
                                    <option value="stx">STX</option>
                                </select>
                                
                            </div>
                        </div>
                    </form>
                </div>
                <div className={styles.onBoardingRight}>
                    <h5>Issue Number:</h5>
                    <p>#XXX</p>
                    <h5>Grant Name:</h5>
                    <p>Thirty Character Long Project Name</p>
                    <h5>Grant Budget:</h5>
                    <p>$122,000</p>
                    <h5>Number of Payments Remaining:</h5>
                    <p>(6) payments remaining</p>
                    <h5>Amount per Payment:</h5>
                    <p style={{marginBottom: 70}}>$20,833.33</p>
                    <div className={styles.divider}></div>
                    <p style={{color: '#E2E8F0',marginTop: 10}}>If any of the information provided above is incorrect please email us here.</p>
                    <span style={{display: 'flex', gap: 10}}><input type={'checkbox'}/> <p style={{color: '#E2E8F0'}}>I confirm all of the information on this page is correct.</p></span>
                    <button>Click to Submit</button>
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
