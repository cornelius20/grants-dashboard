import React from 'react';
import styles from './NavHeader.module.css';
import Logo from '../public/images/StackFoundationLogo.svg'

export default function NavHeader() {
  return (
    <div className={styles.navWrapper}>  
        <Logo/>
        <ul className={styles.navList}>
            <li className={styles.navListItem}>Apply for Grant</li>
            <li className={styles.navListItem}>Manage Grant</li>
            <li className={styles.navListItem}>Grants Repo</li>
        </ul>
    </div>
  )
}
