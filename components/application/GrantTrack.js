import React, { useState, useMemo, useEffect } from 'react';
import styles from './GrantType.module.css'

export default function GrantTrack() {

    return (
        <div className={styles.onBoardingRow}>
            <div className={styles.onBoardingLeft}>
                <h2 style={heading}>
                    Grant Track
                </h2>
                <p style={mb4} className={styles.text}>
                    Select the Grant Track that best aligns with your project from the list below.
                </p>
                <div className={styles.row}>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input name='projectTrack' type={'radio'} value="Stacks Protocol"/>
                                <h2 className={styles.heading}>Stacks Protocol</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>Blockchain Improvements, sBTC, Subnets, PoX, SIP research, etc</li>
                            </ul>
                        </div>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input name='projectTrack' type={'radio'} />
                                <h2 className={styles.heading}>Stacks Interface</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>APIs, Indexers, Decentralized Identification, Wallets, Explorers, etc.</li>
                            </ul>
                        </div>
                </div>
                <div className={styles.row}>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input name='projectTrack' type={'radio'} />
                                <h2 className={styles.heading}>Cross-Chain & Off Chain</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>Decentralized Storage Integrations, Oracles & Bridges, EVM Integrations, etc.</li>
                            </ul>
                        </div>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input name='projectTrack' type={'radio'} />
                                <h2 className={styles.heading}>Bitcoin Utility via Stacks</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>DLC-Clarity Explorations, BTC-STX Wallets , <br/>  BTC-Native DeFi (using Stacks), etc.</li>
                            </ul>
                        </div>
                </div>
                <div className={styles.row}>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input name='projectTrack' type={'radio'} />
                                <h2 className={styles.heading}>Stacks Developer Experience</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>Tooling, Software Development Kits, Libraries, Faucets, Sandboxes, etc.</li>
                            </ul>
                        </div>
                        <div className={styles.col}>

                        </div>

                </div>
                <p style={mb4} className={styles.text}>
                        Please note we are currently not accepting applications for the following Grant Tracks.
                </p>
                <div className={styles.row}>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input style={disabledRadio} className={styles.trackDisabledRadio} disabled name='projectTrack' type={'radio'} />
                                <h2 className={styles.heading2}>Stacks dApps & Clarity</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>Clarity Improvements, SIP Development, Smart Contract Templates, dApps, etc.</li>
                            </ul>
                        </div>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input style={disabledRadio} className={styles.trackDisabledRadio} disabled name='projectTrack' type={'radio'} />
                                <h2 className={styles.heading2}>Stacks Education and Community</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>Documentation, Tutorials, Workshops, Governance, Education, Content Creation, etc.</li>
                            </ul>
                        </div>
                </div>
                <div className={styles.row}>
                        <div className={styles.col}>
                            <div className={styles.grantTypeFlex}>
                                <input style={disabledRadio} disabled name='projectTrack' type={'radio'} />
                                <h2 className={styles.heading2}>Stacks User Experience</h2>
                            </div>
                            <ul className={styles.grantList}>
                                <li>UX/UI Research, Speculative Design Studies, Prototypes, Component Libraries, etc</li>
                            </ul>
                        </div>
                        <div className={styles.col}>

                        </div>
                </div>
            </div>
        </div>
    )
}

const mb4 = {
    marginBottom: 40
}

const disabledRadio = {
    border: '2px solid rgba(23, 25, 35, 1)'
}

const heading = {
    fontSize: 20,
    color: '#fff'
}




