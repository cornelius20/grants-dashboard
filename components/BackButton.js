import Link from 'next/link';
import React from 'react';


export default function BackButton({title,link= '' }) {
  return (
    <div style={wrapper}>
            <p>
                <Link href={link}>
                     <span style={backBtn}>{title}</span>
                </Link>
            </p>
        <span style={bar}></span>
    </div>
  )
}


const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: 26,
    paddingTop: 38,
    position: 'relative'
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
