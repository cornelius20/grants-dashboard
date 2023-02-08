import React from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
// import { authOptions } from './api/auth/[...nextauth]';
// import { unstable_getServerSession } from 'next-auth/next';

export default function PaymentsDashboard() {
  return (
    <div className={styles.main}>
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
                Payments Dashboard
            </h2>
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft}>
                    <p className={styles.text}>
                        A simple widget for providing private information required for receiving grant payments.
                    </p>
                    <p style={addPayment}>Add a Paymnet</p>
                    <form>
                        <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Github Issue Number</label>
                                <select name="selectIssueNumber">
                                    <option value="usd">Dropdown...</option>
                                    {/* <option value="stx">STX</option> */}
                                </select>
                            </div>
                            <div className={styles.formControl}>
                                <label>Payment Number</label>
                                <select name="selectPaymentNumber">
                                <option value="usd">Dropdown...</option>
                                    {/* <option value="stx">STX</option> */}
                                </select>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Amount of STX Disbursed</label>
                                <input 
                                    className={styles.formInput}
                                    name="stxAmount"
                                    type="number"
                                    placeholder="Type here..."
                                />
                            </div>
                            <div className={styles.formControl}>
                                <label>Equivelant amount of USD</label>
                                <input 
                                    className={styles.formInput}
                                    name="usdAmount"
                                    type="number"
                                    placeholder="Type here..."
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Stacks Transaction ID</label>
                                <input 
                                    className={styles.formInput}
                                    name="transactionID"
                                    type="text"
                                    placeholder="Type here..."
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className={styles.onBoardingRight}>
                    <p style={paymentHistory}>Payment History</p>
                    <h5>Grant Issue Number:</h5>
                    <p>#XXX</p>
                    <h5>Grant Name:</h5>
                    <p>Thirty Character Long Project Name</p>
                    <h5>Grant Name:</h5>
                    <p>Thirty Character Long Project Name</p>
                    <h5>Grant Budget:</h5>
                    <p>$122,000</p>
                    <h5>Agreed upon Completion Date:</h5>
                    <p>(6) payments remaining</p>
                    <h5>Total Paid to date:</h5>
                    <p style={marginBottom70}>$20,833.33</p>
                    <div className={styles.divider}></div>
                    <button className={styles.gradientButton}>Click to Submit</button>
                </div>
            </div>
        </div>
    </div>
  )
}

const paymentHistory = {
    color: '#fff',
    marginBottom: 20
}

const addPayment = {
    color: '#fff',
    marginBottom: 20
}

const marginBottom70 = {
    marginBottom: 70
}

// export async function getServerSideProps(context) {
// 	const session = await unstable_getServerSession(context.req, context.res, authOptions);

// 	if (!session) {
// 		return {
// 			redirect: {
// 				destination: '/',
// 				permanent: false
// 			}
// 		};
// 	}

// 	session.user.email = '';
// 	return {
// 		props: {
// 			session
// 		}
// 	};
// }
