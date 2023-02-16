import React, { useEffect } from "react"
import styles from "./AddWallet.module.css";
import ExploreIcon from "../public/images/hiro-wallet.svg";
import CloseIcon from "../public/images/close.svg";
import { useAuth } from '@micro-stacks/react';
import ArrowRight from '../public/images/arrowRight.svg';

export default function AddWallet({visible,handleClose}) {
    const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
    const label = isRequestPending ? 'Loading...' : isSignedIn ? 'Sign out' : 'Sign In with Secret Key';
    
  return (
    <div className={styles.PopupModal} style={{display: visible ? "flex" : "none",}}>
        <div className={styles.ExploreContainer}>
            <div className={styles.ModalHeader}>
                <h3>
                    <ExploreIcon/>
                </h3>
                <span onClick={()=>handleClose()} style={{cursor: "pointer"}}>
                    <CloseIcon/>
                </span>
            </div>
            <img className={styles.ModalImgSm} src="./images/image.png"/>
            <h3 className={styles.ModalHeading}>Add Hiro wallet to chrome</h3>
            <p className={styles.ModalText}>Hiro Wallet is your gateway to Stacks apps like Arkadiko. Add it to Chrome to continue.</p>
            
            <a href="https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj">
                <button className={styles.ModalBtn}>Download Hiro Wallet</button>
            </a>
            <div className={styles.divider}></div>

            <p className={styles.ModalText}>About Hiro Wallet <ArrowRight/></p>
        </div>
    </div>
  )
}
