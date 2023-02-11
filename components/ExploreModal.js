import React from "react"
import styles from "./PopupModal.module.css";
import ExploreIcon from "../public/images/explore.svg";
import CloseIcon from "../public/images/close.svg";
import { useAuth } from '@micro-stacks/react';

export default function ExploreModal({visible,handleClose}) {
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
            <h3 className={styles.ModalHeading}>Explore the world of Stacks</h3>
            <p>Hiro Wallet is your gateway to Stacks apps like Arkadiko. Add it to Chrome to continue.</p>
            <button onClick={async () => {
                if (isSignedIn) await signOut();
                else await openAuthRequest();
            }} className={styles.ModalBtn}>{label}</button>
            <p className={styles.ModalText}>or Connect your ledger</p>
            <p className={styles.account}>Do not have an Account?</p>
            <p className={styles.ModalText}>Create a new Account</p>
        </div>
    </div>
  )
}
