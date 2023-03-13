import React,{useState,useMemo,useEffect} from 'react';
import styles from './SuccessModal.module.css';


export default function ThanksModal({isVisible,closeModal}) {
        
  return (
    <div className={styles.bannerBody} style={{display: isVisible ? 'flex' : 'none'}}>
        <div className={styles.bannerWrapper}>
            <h1 className={styles.bannerHeading}>Thanks!</h1>
            <p className={styles.bannerTextLarge}>It sounds like your project idea might better align with one of the other Stacks-related programs you can read about <a href='' className={styles.bannerLink}>here.</a></p>
            <button onClick={closeModal} className={styles.bannerButton}>Close</button>
        </div>
    </div>
  )
}


