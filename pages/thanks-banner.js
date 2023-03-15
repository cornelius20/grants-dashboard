import React, { useState, useMemo, useEffect } from 'react';
import styles from './banner.module.css';

import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export default function GrantOnboarding() {

    return (
        <div className={styles.bannerBody}>
            <div className={styles.bannerWrapper}>
                <h1 className={styles.bannerHeading}>Thanks!</h1>
                <p className={styles.bannerTextLarge}>It sounds like your project idea might better align with one of the other Stacks-related programs you can read about here.</p>
                <button className={styles.bannerButton}>Continue</button>
            </div>
        </div>
    )
}


export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    session.user.email = '';
    return {
        props: {
            session
        }
    };
}
