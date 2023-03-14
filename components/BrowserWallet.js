import React, { useEffect } from "react"
import styles from "./AddWallet.module.css";
import ExploreIcon from "../public/images/hiro-wallet.svg";
import CloseIcon from "../public/images/close.svg";
import { useAuth } from '@micro-stacks/react';
import ArrowRight from '../public/images/arrowRight.svg';

export default function BrowserWallet({ visible, handleClose }) {
    const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
    const label = isRequestPending ? 'Loading...' : isSignedIn ? 'Sign out' : 'Sign In with Secret Key';

    return (
        <div className={styles.PopupModal} style={{ display: visible ? "flex" : "none", }}>
            <div className={styles.ExploreContainer}>
                <div className={styles.ModalHeader}>
                    <h3>
                        <ExploreIcon />
                    </h3>
                    <span onClick={() => handleClose()} style={{ cursor: "pointer" }}>
                        <CloseIcon />
                    </span>
                </div>
                <img className={styles.ModalImgSm} src="./images/hiro-image.png" />
                <h3 className={styles.ModalHeading}>Your Browser isn&apos;t supported</h3>
                <p className={styles.ModalText}>To sign in to Stacks Foundation using the Hiro Wallet browser extension, try <a href="https://www.google.com/chrome/?brand=JJTC&gclid=Cj0KCQiAxbefBhDfARIsAL4XLRo0AJ--AnM0fwiLos7T07ldJxDCVH_5zSSCpbS6E9QM_KfqKb-diJMaAhmMEALw_wcB&gclsrc=aw.ds">Chrome</a>, <a href="https://brave.com/">Brave</a>, or <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a> on desktop.</p>
                <div className={styles.divider}></div>

                <p className={styles.ModalText}>
                    <a className={styles.ModalLink} href="https://wallet.hiro.so/">
                        <span>About Hiro Wallet</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="blue" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.32812 3.0625L11.2656 7L7.32812 10.9375" stroke="blue" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.7189 7.00024H2.7345" stroke="blue" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>

                </p>
            </div>
        </div>
    )
}
