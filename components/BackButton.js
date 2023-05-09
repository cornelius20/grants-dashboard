import Link from 'next/link';
import React from 'react';


export default function BackButton({ title, link = '' }) {
    return (
        <div style={wrapper}>
            <div style={subWrapper}>
                <svg width="14" height="14" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.0607 4.99935L9.02945 2.0306C9.17035 1.88995 9.2496 1.69909 9.24978 1.50001C9.24995 1.30093 9.17104 1.10993 9.03039 0.969035C8.88974 0.828139 8.69888 0.748886 8.4998 0.74871C8.30072 0.748534 8.10972 0.82745 7.96883 0.968098L5.00008 3.93685L2.03133 0.968098C1.89043 0.827202 1.69934 0.748047 1.50008 0.748047C1.30082 0.748047 1.10973 0.827202 0.96883 0.968098C0.827934 1.10899 0.748779 1.30009 0.748779 1.49935C0.748779 1.69861 0.827934 1.8897 0.96883 2.0306L3.93758 4.99935L0.96883 7.9681C0.827934 8.10899 0.748779 8.30009 0.748779 8.49935C0.748779 8.6986 0.827934 8.8897 0.96883 9.0306C1.10973 9.17149 1.30082 9.25065 1.50008 9.25065C1.69934 9.25065 1.89043 9.17149 2.03133 9.0306L5.00008 6.06185L7.96883 9.0306C8.10972 9.17149 8.30082 9.25065 8.50008 9.25065C8.69934 9.25065 8.89043 9.17149 9.03133 9.0306C9.17222 8.8897 9.25138 8.6986 9.25138 8.49935C9.25138 8.30009 9.17222 8.10899 9.03133 7.9681L6.0607 4.99935Z" fill="#718096" />
                </svg>
                <p style={paragraph}>
                    <Link href={link}>
                        <span style={backBtn}>{title}</span>
                    </Link>
                </p>
            </div>
            <span style={bar}></span>
        </div>
    )
}


const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingTop: 38,
    position: 'relative'
}

const subWrapper = {
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:"center"
}

const paragraph = {
    marginLeft: 5
}

const backBtn = {
    color: '#718096', 
    cursor: 'pointer'
}

const bar = {
    height: 2,
    width: 30,
    borderRadius: 3,
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: '#718096'
}
