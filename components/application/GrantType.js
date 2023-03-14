import React,{useState,useMemo,useEffect} from 'react';
import styles from './GrantType.module.css'
import Person from '../../public/images/person.svg';
import Arrow from '../../public/images/arrow.svg';
import PayTag from '../../public/images/payTag.svg';
import WaterDrop from '../../public/images/waterDrop.svg';
import { projectTypes } from '../../content';


export default function GrantType() {
        
        

  return (
    <div className={styles.onBoardingWrapper}>
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft} style={{maxHeight: 600,overflow: 'auto'}}>
                            <h2 style={{fontSize: 20,color: '#fff'}}>
                                Grant Type
                            </h2>
                            <p className={styles.text} style={{fontWeight: 'bold'}}>
                                Select the grant type below:
                            </p>
                            
                            <ul className={styles.grantTypeList}>
                                
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input style={{visibility: 'hidden'}} type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span style={listHeader}><Person/> NAME</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span style={listHeader}><PayTag/> Budget $ 1</span>
                                        </div>
                                        <div>
                                            <span style={listHeader}><WaterDrop/> Funding Stream <Arrow/></span>
                                        </div>
                                        <div>
                                            <span className={styles.dots} style={{visibility: 'hidden'}}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                {/* <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName}>Open Source Development</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream}>Developer Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots}>. . .</span>
                                        </div>
                                    </div>
                                </li> */}
                                {
                                    projectTypes.map(item=>(
                                        <li className={styles.grantTypeListItem}>
                                            <div className={styles.left}>
                                                <div>
                                                    <span className={styles.grantInputBox}>
                                                        <input type={'radio'}/>
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className={styles.grantName}>{item.name}</span>
                                                </div>
                                            </div>
                                            <div className={styles.right}>
                                                <div>
                                                    <span className={styles.grantRange}>{item.funding}</span>
                                                </div>
                                                <div>
                                                    <span className={styles.grantStream} style={{background: item.color}}>{item.stream}</span>
                                                </div>
                                                <div>
                                                    <span className={styles.dots}>. . .</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>

                            <p className={styles.text}>
                                Please note we are currently not accepting applications for the following Grant Types.
                            </p>

                            <ul className={styles.grantTypeList}>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox}>
                                                <input style={{visibility: 'hidden'}} type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span style={listHeader2}>
                                                <svg
                                                    width="12"
                                                    height="15"
                                                    viewBox="0 0 12 15"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M11.3332 14.6667H0.666504V13.3333C0.666504 12.4493 1.01769 11.6014 1.64281 10.9763C2.26794 10.3512 3.11578 10 3.99984 10H7.99984C8.88389 10 9.73174 10.3512 10.3569 10.9763C10.982 11.6014 11.3332 12.4493 11.3332 13.3333V14.6667ZM5.99984 8.66667C5.47455 8.66667 4.95441 8.56321 4.4691 8.36219C3.9838 8.16117 3.54284 7.86653 3.17141 7.4951C2.79998 7.12366 2.50534 6.68271 2.30432 6.19741C2.1033 5.7121 1.99984 5.19196 1.99984 4.66667C1.99984 4.14138 2.1033 3.62124 2.30432 3.13594C2.50534 2.65064 2.79998 2.20968 3.17141 1.83824C3.54284 1.46681 3.9838 1.17217 4.4691 0.971154C4.95441 0.770135 5.47455 0.666672 5.99984 0.666672C7.0607 0.666672 8.07812 1.0881 8.82826 1.83824C9.57841 2.58839 9.99984 3.60581 9.99984 4.66667C9.99984 5.72754 9.57841 6.74495 8.82826 7.4951C8.07812 8.24524 7.0607 8.66667 5.99984 8.66667Z"
                                                            fill="rgba(255, 255, 255, 0.48)"
                                                        />
                                                </svg> NAME
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span style={listHeader2}>
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 14 14"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.5939 0.412854C13.4643 0.281804 13.31 0.177842 13.1399 0.107022C12.9698 0.0362035 12.7872 -5.65727e-05 12.603 0.000354407H8.7614C8.50941 0.000824247 8.26776 0.100649 8.0889 0.278167L0.409218 7.95629C0.147171 8.21887 0 8.57469 0 8.94566C0 9.31664 0.147171 9.67245 0.409218 9.93504L4.06547 13.5913C4.32812 13.8534 4.68406 14.0007 5.05515 14.0007C5.42625 14.0007 5.78219 13.8534 6.04484 13.5913L13.7214 5.91629C13.8993 5.73772 13.9995 5.49614 14.0002 5.2441V1.40035C14.0013 1.21704 13.966 1.03533 13.8962 0.865799C13.8265 0.696268 13.7237 0.5423 13.5939 0.412854ZM11.0002 4.00035C10.8024 4.00035 10.609 3.9417 10.4446 3.83182C10.2801 3.72194 10.152 3.56576 10.0763 3.38304C10.0006 3.20031 9.98078 2.99924 10.0194 2.80526C10.058 2.61128 10.1532 2.4331 10.293 2.29325C10.4329 2.15339 10.6111 2.05815 10.8051 2.01957C10.999 1.98098 11.2001 2.00079 11.3828 2.07647C11.5656 2.15216 11.7217 2.28033 11.8316 2.44478C11.9415 2.60923 12.0002 2.80257 12.0002 3.00035C12.0002 3.26557 11.8948 3.51992 11.7073 3.70746C11.5197 3.895 11.2654 4.00035 11.0002 4.00035Z"
                                                        fill="rgba(255, 255, 255, 0.48)"
                                                    />
                                                </svg> Budget $ 1
                                            </span>
                                        </div>
                                        <div>
                                            <span style={listHeader2}>
                                                <svg
                                                    width="10"
                                                    height="14"
                                                    viewBox="0 0 10 14"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5.285 0.879738C5.24979 0.838624 5.20611 0.805619 5.15694 0.782989C5.10777 0.760359 5.05428 0.748642 5.00015 0.748642C4.94603 0.748642 4.89254 0.760359 4.84337 0.782989C4.7942 0.805619 4.75052 0.838624 4.71531 0.879738C3.72594 2.03693 0.5 6.03755 0.5 9.00099C0.5 11.7625 2.23875 13.501 5 13.501C7.76125 13.501 9.5 11.7625 9.5 9.00099C9.5 6.03755 6.27406 2.03693 5.285 0.879738ZM5.5 11.876C5.43994 11.8761 5.38072 11.8618 5.32734 11.8343C5.27395 11.8068 5.22796 11.7668 5.19323 11.7178C5.1585 11.6688 5.13604 11.6122 5.12776 11.5527C5.11948 11.4932 5.1256 11.4326 5.14562 11.376C5.1712 11.3021 5.21942 11.2382 5.28344 11.1933C5.34746 11.1484 5.42401 11.1248 5.50219 11.126C5.99856 11.1249 6.47429 10.9273 6.82528 10.5763C7.17627 10.2253 7.37392 9.74955 7.375 9.25317C7.37385 9.175 7.3974 9.09845 7.44229 9.03443C7.48717 8.97041 7.55111 8.92218 7.625 8.89661C7.68162 8.87659 7.74223 8.87046 7.80172 8.87875C7.86121 8.88703 7.91784 8.90948 7.96684 8.94421C8.01584 8.97895 8.05579 9.02494 8.08331 9.07832C8.11083 9.13171 8.12513 9.19092 8.125 9.25099C8.12425 9.94695 7.84745 10.6142 7.35533 11.1063C6.86321 11.5984 6.19596 11.8752 5.5 11.876Z"
                                                        fill="rgba(255, 255, 255, 0.48)"
                                                    />
                                                </svg> 
                                                Funding Stream 
                                            	<svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M6.66645 3.21867V11.3333H5.33312V3.21867L1.75712 6.79467L0.814453 5.852L5.99979 0.666672L11.1851 5.852L10.2425 6.79467L6.66645 3.21867Z"
                                                        fill="rgba(255, 255, 255, 0.48)"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.dots2} style={{visibility: 'hidden'}}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox2}>
                                                <input disabled type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName2}>Stacks Community Builder Grant</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots2}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox2}>
                                                <input disabled type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName2}>Stacks Education Grant</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots2}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox2}>
                                                <input disabled type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName2}>Stacks Event Grant</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>$0-$48k</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots2}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox2}>
                                                <input disabled type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName2}>Stacks Chapter Grant (by Region)</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>Varies</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: 'orange'}}>Community Grants</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots2}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                <li className={styles.grantTypeListItem}>
                                    <div className={styles.left}>
                                        <div>
                                            <span className={styles.grantInputBox2}>
                                                <input disabled type={'radio'}/>
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.grantName2}>Stacks Foundation Resident Program</span>
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>
                                            <span className={styles.grantRange}>Varies</span>
                                        </div>
                                        <div>
                                            <span className={styles.grantStream} style={{background: '#48BB78'}}>Advanced Support</span>
                                        </div>
                                        <div>
                                            <span className={styles.dots2}>. . .</span>
                                        </div>
                                    </div>
                                </li>
                                
                            </ul>  
                </div>
            </div>
        </div>
  )
}

const main = {
	backgroundColor: '#000',
	height: '100vh'
}

const listHeader = {
    display:'flex',
    alignItems: 'center',
    gap: 10,
    textTransform: 'uppercase',
    fontSize: 12
}

const listHeader2 = {
    display:'flex',
    alignItems: 'center',
    gap: 10,
    textTransform: 'uppercase',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.48);'
}

const flex1 = {
    flex: 1
}

const displayFlex = {
    display: "flex"
}

const titleView = {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
}

const listTitle = {
    fontWeight: 'bold',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    cursor: 'pointer'
}


const marginLeft10 = {
    marginLeft:10
}

const addUser = {
    color: '#fff',
    marginBottom: 20
}

const githubView = {
    display: 'flex',
    flexDirection:"row",
    width:"100%",
    alignItems:'flex-end'
}

const flex2 = {
    flex: 2
}

const rightBtn = {
    width: 200,
    marginLeft: 'auto'
}

const mt20 = {
    marginTop: 30
}

const checkbox = {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
    color: '#fff'
}

const marginBottom120 = {
    marginBottom: 120
}

const mb4 = {
    marginBottom: 40
}

const mb1 = {
    marginBottom: 10
}

const mailLink = {
    color: "#fff",
    textDecorationLine: 'underline'
}

const marginTop10 = {
    marginTop: 10,
}

const grayColor = {
    color: 'gray'
}

const whiteColor = {
    color: '#E2E8F0',
}