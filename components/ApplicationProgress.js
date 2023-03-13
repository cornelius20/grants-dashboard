import React from 'react';
import styles from './ApplicationProgress.module.css';

export default function ApplicationProgress({progress}) {
  return (
    <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
            <div style={{width: progress}}></div>
        </div>
        <p className={styles.progressLabel}>Application</p>
    </div>
  )
}
