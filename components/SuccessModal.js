import Link from 'next/link';
import React,{useState,useMemo,useEffect} from 'react';
import styles from './SuccessModal.module.css';


export default function SuccessModal({isVisible}) {
        
  return (
    <div className={styles.bannerBody} style={{display: isVisible ? 'flex' : 'none'}}>
        <div className={styles.bannerWrapper}>
            <h1 className={styles.bannerHeading}>Great!</h1>
            <p className={styles.bannerTextLarge}>It sounds like your project idea could be a good fit for a grant.</p>
            <p className={styles.bannerTextSmall}>Press ‘Continue’ below to proceed with your application.</p>
            <Link href={'/'}>
                <button className={styles.bannerButton}>Continue</button>
            </Link>
        </div>
    </div>
  )
}



