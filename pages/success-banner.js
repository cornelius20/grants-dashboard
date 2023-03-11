import React,{useState,useMemo,useEffect} from 'react';
import styles from './banner.module.css';

import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';


export default function GrantOnboarding() {
        
       
        
  return (
    <div className={styles.bannerBody}>
        <div className={styles.bannerWrapper}>
            <h1 className={styles.bannerHeading}>Great!</h1>
            <p className={styles.bannerTextLarge}>It sounds like your project idea could be a good fit for a grant.</p>
            <p className={styles.bannerTextSmall}>Press ‘Continue’ below to proceed with your application.</p>
            <button className={styles.bannerButton}>Continue</button>
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
