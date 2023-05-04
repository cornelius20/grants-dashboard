import React from 'react';
import styles from "./CustomAlert.module.css";

export default function CustomAlert({ title, onClose }) {
  return (
    <div className={styles.alertContainer}>
      <p>{title}</p>
      <button onClick={() => { onClose();console.log('clickde') }} className={styles.btn}>OK</button>
    </div>
  )
}
