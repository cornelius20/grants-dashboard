import React from 'react'
import styles from './PopupModal.module.css';
import myImg from '../public/images/modalImg.png';


export default function ExploreModal({visible,handleClose}) {
  return (
    <div className={styles.PopupModal} style={{display: visible ? 'flex' : 'none',cursor: 'pointer'}} onClick={()=>console.log('Overlay clicked')}>
        <div className={styles.ExploreContainer} onClick={()=>console.log('Container Clicked')}>
            <div className={styles.ModalHeader}>
                <h3>
                    <svg width="50" height="50" viewBox="0 0 414 410" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M258.999 518C402.041 518 518 402.042 518 259C518 115.958 402.041 0 258.999 0C115.958 0 0 115.958 0 259C0 402.042 115.958 518 258.999 518ZM388.499 211.702H311.081L365.448 129.5H324.347L258.891 228.664L193.651 129.5H152.551L206.917 211.702H129.499V243.451H388.499V211.702ZM309.56 305.211L364.578 388.5H323.477L258.891 290.641L194.304 388.5H153.421L208.439 305.429H129.499V273.896H388.499V305.211H309.56Z" fill="white" fill-opacity="0.08"/>
                    </svg>
                </h3>
                <span onClick={()=>handleClose()} style={{cursor: 'pointer'}}>
                    <svg width="12" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.061 5 9.03 2.03A.75.75 0 0 0 7.97.969L5 3.938 2.032.967A.751.751 0 1 0 .969 2.031L3.938 5 .969 7.968a.751.751 0 0 0 1.063 1.063L5 6.062l2.97 2.969a.751.751 0 1 0 1.062-1.063L6.06 5Z" fill="#fff"></path></svg>
                </span>
            </div>
            <img className={styles.ModalImgSm} src={'https://picsum.photos/200/300'}/>
            <h3 className={styles.ModalHeading}>Explore the world of Stacks</h3>
            <p>Hiro Wallet is your gateway to Stacks apps like Arkadiko. Add it to Chrome to continue.</p>
            <button className={styles.ModalBtn}>Sign In with Secret Key</button>
            <p className={styles.ModalText}>or Connect your ledger</p>
            <p className={styles.account}>Don't have an Account?</p>
            <p className={styles.ModalText}>Create a new Account</p>
        </div>
    </div>
  )
}
