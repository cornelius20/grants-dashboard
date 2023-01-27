import React from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import GithubIcon from "../public/images/github.svg";
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export default function AdminDashboard() {
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
                Admin Dashboard
            </h2>
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft}>
                    <p>
                        A simple widget for providing private information required for receiving grant payments.
                    </p>
                    <form>
                        <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Search for user <span style={{color: 'gray'}}>(only displays previously added users)</span></label>
                                <input 
                                    className={styles.formInput}
                                    name="SearchUserInput"
                                    type="text"
                                    placeholder="Type here..."
                                />
                            </div>
                        </div>
                        <p>All Users</p>
                        <ul className={styles.namesList}>
                            <li style={{display: 'flex'}}>
                                <div style={{flex: 1,display: 'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                    <span style={{fontWeight: 'bold',fontSize: 14,marginLeft: 10}}>NAME</span>
                                </div>
                                <div style={{flex: 1}}>
                                    <span style={{fontWeight: 'bold',fontSize: 14}}>ROLE</span>
                                </div>
                            </li>
                            <li className={styles.listItem}>
                                <div style={{flex: 1,display: 'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                    <span>
                                        <input type={'radio'}/>
                                    </span>
                                    <span>Will Corcan</span>
                                </div>
                                <div style={{flex: 1}}>
                                    <span style={{backgroundColor: '#9F7AEA'}}>Admin</span>
                                    <button>. . .</button>
                                </div>
                            </li>
                            <li className={styles.listItem}>
                            <div style={{flex: 1,display: 'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                    <span>
                                        <input type={'radio'}/>
                                    </span>
                                    <span>Shakti Pradhan</span>
                                </div>
                                <div style={{flex: 1}}>
                                    <span style={{backgroundColor: '#48BB78'}}>Finance</span>
                                    <button>. . .</button>
                                </div>
                            </li>
                            <li className={styles.listItem}>
                            <div style={{flex: 1,display: 'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                    <span>
                                        <input type={'radio'}/>
                                    </span>
                                    <span>Kenny Rogers</span>
                                </div>
                                
                                <div style={{flex: 1}}>
                                    <span style={{backgroundColor: 'orange'}}>Reviewer</span>
                                    <button>. . .</button>
                                </div>
                            </li>
                            <li className={styles.listItem}>
                            <div style={{flex: 1,display: 'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                    <span>
                                        <input type={'radio'}/>
                                    </span>
                                    <span>Ogaga Onose</span>
                                </div>
                                
                                <div style={{flex: 1}}>
                                    <span style={{backgroundColor: 'cyan'}}>Grantee</span>
                                    <button>. . .</button>
                                </div>
                            </li>
                            <li className={styles.listItem}>
                            <div style={{flex: 1,display: 'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
                                    <span>
                                        <input type={'radio'}/>
                                    </span>
                                    <span>Zach Graff</span>
                                </div>
                                <div style={{flex: 1}}>
                                    <span style={{backgroundColor: 'cyan'}}>Grantee</span>
                                    <button>. . .</button>
                                </div>
                            </li>
                        </ul>
                    </form>
                </div>
                <div className={styles.onBoardingRight}>
                    <p style={{color: '#fff',marginBottom: 20}}>Add a New User or Edit a User</p>
                    <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>First Name</label>
                                <input 
                                    className={styles.formInput}
                                    name="FirstName"
                                    type="text"
                                    placeholder="Type here..."
                                />
                            </div>
                    </div>
                    <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Last Name</label>
                                <input 
                                    className={styles.formInput}
                                    name="LastName"
                                    type="text"
                                    placeholder="Type here..."
                                />
                            </div>
                    </div>
                    <div className={styles.formRow}>
                            <div className={styles.formControl}>
                            <label>Github Username <span style={{color: 'gray'}}>(login username used)</span></label> 
                               <div style={{ flexDirection:"row", width:"100%", alignItems:'flex-end'}}>
                                <input   
                                    className={styles.formInput}
                                    name="GitHubUserName"
                                    type="text"
                                    placeholder="will-at-stacks"
                                />
                                <GithubIcon className={styles.searchIcon}/>
                                </div>
                            </div>  
                    </div>
                    <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Email Address</label>
                                <input 
                                    className={styles.formInput}
                                    name="EmailAddress"
                                    type="text"
                                    placeholder="Type here..."
                                />
                            </div> 
                    </div>
                    <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Select Role</label>
                                <select name="selectPaymentNumber">
                                    <option value="usd">USD</option>
                                    <option value="stx">STX</option>
                                </select>
                            </div>
                    </div>
                    <div className={styles.divider}></div>
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
