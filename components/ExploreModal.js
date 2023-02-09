import React from "react"
import styles from "./PopupModal.module.css";
import ExploreIcon from "../public/images/explore.svg";
import CloseIcon from "../public/images/close.svg";

export default function ExploreModal({visible,handleClose}) {
  return (
    <div className={styles.PopupModal} style={{display: visible ? "flex" : "none",cursor: "pointer"}} onClick={()=>console.log("Overlay clicked")}>
        <div className={styles.ExploreContainer} onClick={()=>console.log("Container Clicked")}>
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
            <button className={styles.ModalBtn}>Sign In with Secret Key</button>
            <p className={styles.ModalText}>or Connect your ledger</p>
            <p className={styles.account}>Do not have an Account?</p>
            <p className={styles.ModalText}>Create a new Account</p>
        </div>
    </div>
  )
}
