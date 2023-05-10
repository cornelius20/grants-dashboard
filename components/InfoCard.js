import React from 'react';
import styles from './InfoCard.module.css';

export default function InfoCard({title,fee,deadline,description,awardedIn,text,headingSecondary,link}) {
  return (
    <div className={styles.cardContainer}>
        <h2 className={styles.cardHeading}>{title}  <span className={styles.headingSecondary}>| {headingSecondary}</span></h2>
        <p className={styles.cardText}> AWARDED IN:   <span>{awardedIn}</span>   </p>
        <p className={styles.cardText}> APPLICATION DEADLINE: <span>{deadline}</span>  </p>
        <p className={styles.cardText}> FEE :  <span>{fee}</span>   </p>
        <p className={styles.cardTextLarge}>{description}</p>
        <p className={styles.cardTextItalic}>{text}</p>
        <a href={link} className={styles.learnButton}>Learn More</a>
    </div>
  )
}
