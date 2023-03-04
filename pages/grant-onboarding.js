import React,{useState,useMemo,useEffect} from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import Link from 'next/link';
import CalendarDropdown from '../components/CalendarDropdown';
import ExploreModal from '../components/ExploreModal';
import { useAuth } from '@micro-stacks/react';
import { useAccount } from '@micro-stacks/react';
import { grantOnboarding } from '../utils/ApiCalls';
import { Octokit } from '@octokit/rest';
import AddWallet from '../components/AddWalletModal';

import DropdownIcon from '../public/images/dropdown.svg';
import LoadingSpinner from '../public/images/loading-spinner.svg';
import BrowserWallet from '../components/BrowserWallet';
import CustomAlert from '../components/CustomAlert';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';


export default function GrantOnboarding() {
        const [loading,setLoading] = useState(false); 
        const [firstName, setFirstName] = useState("")
        const [lastName, setLastName] = useState("")
        const [stxMemo, setStxMemo] = useState("")
        const [email, setEmail] = useState("")
        const [country, setCountry] = useState("")
        const [emailError,setEmailError] = useState(false)
        const [firstNameError,setFirstError] = useState(false)
        const [lastNameError,setLastNameError] = useState(false)
        const [stxMemoError,setStxMemoError] = useState(false)
        const [grantIssueNumberError,setGrantIssueNumberError] = useState(false)
        const [anticipatedCompletionDate, setAnticipatedCompletionDate] = useState(new Date())
        const [visible,setVisible] = useState(false);
        const [endDate, setEndDate] = useState(new Date());
        const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
        const { stxAddress, identityAddress, rawAddress } = useAccount();
        const label = isRequestPending ? 'Loading...' : isSignedIn ? `${stxAddress.slice(0,9)}...(Disconnect)` : 'Connect Wallet';
        const [grantIssues,setGrantIssues] = useState([]);
        const [grantIssueNumber,setGrantIssueNumber] = useState(null);
        const [grantName,setGrantName] = useState(null);
        const [grantBudget,setGrantBudget] = useState(null);
        const [grantsFound, setGrantsFound] = useState(0);
        const [browserError,setBrowserError] = useState(false);
        const [alertVisible,setAlertVisible] = useState(false);

        const [CSVData, setCSVData] = useState([
            [
                'Date Submitted',
                'Github Issue Number',
                'Application Type',
                'Grant Lead',
                'Previous Grants',
                'Other Ecosytem Programs',
                'Grant Name',
                'Grant Budget',
                'Grant Duration',
                'Grant Type',
                'Grant Track',
                'Grant Goal',
                'Grant Audience',
                'Final Deliverable',
                'Review Status',
                'Grant Phase',
                'Predicted Impact Score',
                'Commented GH Usernames',
                'Reacted GH Usernames'
            ]
        ]);
        const walletButtonClicked = async () => {
            if (isSignedIn) {
                try{
                    await signOut();
                }catch(err){
                    console.log('Failed to Signout');
                    window.location.reload()

                }
            }
            else {
                let userAgent = navigator.userAgent;
                let browserName;
                    
                if(userAgent.match(/chrome|chromium|crios/i)){
                        browserName = "chrome";
                }else if(userAgent.match(/firefox|fxios/i)){
                        browserName = "firefox";
                }else if(userAgent.match(/brave/i)){
                        browserName = "brave";
                }else if(userAgent.match(/safari/i)){
                        browserName = "safari";
                }else if(userAgent.match(/opr\//i)){
                        browserName = "opera";
                } else if(userAgent.match(/edg/i)){
                        browserName = "edge";
                }else{
                    browserName="No browser detection";
                }
                      
                if(browserName == 'chrome' || browserName == 'firefox' || browserName == 'brave'){
                    // console.log('Chrome variabnle is : - ',chrome);
                    try {
                        await openAuthRequest();
                    } catch (error) {
                        console.log("error is here",error);
                        // Extension Not available Modal
                        setVisible(true);
                    }
                }else{
                    console.log('Browser name is : - ',browserName);
                    // Browser not supported modal
                    setBrowserError(true);
                }
            }
        }

        let issues = [];
        const applicationTypeArr = ['Direct Application', 'Wishlist Submission', 'Wishlist Request'];
        const grantTypeArr = [
            'Open Source First Time',
            'Open Source Repeat',
            'Community Builder',
            'Education',
            'Events',
            'Chapter',
            'ALEX Lab Foundation Grant',
            'Resident Program',
            'Direct Investment'
        ];
        const grantTrackArr = [
            'Stacks Protocol',
            'Stacks Interface',
            'Stacks dApps & Clarity',
            'Stacks Education & Community',
            'Stacks Developer Experience',
            'Stacks User Experience',
            'Cross-Chain & Off-Chain',
            'Bitcin Utility via Stacks'
        ];
        const grantStatusArr = [
            'Grantee Onboarding',
            'Completing Initial Deliverable',
            'Completing Milestone(s)',
            'Grant Completed',
            'Grant is Stale',
            'Grant is Closed'
        ];
        const grantPhaseArr = [
            'Application Phase',
            'Onboarding Phase',
            'Milestone 1',
            'Milestone 2',
            'Milestone 3',
            'Milestone 4',
            'Milestone 5',
            'Milestone 6',
            'Milestone 7',
            'Milestone 8',
            'Milestone 9',
            'Milestone 10',
            'Final Deliverable'
        ];

        useEffect(()=>{
            console.log('CSV data is : - ',CSVData);
        },[CSVData])

        const predictedImpactScoreArr = ['6', '5', '4', '3', '2', '1'];

        useEffect(()=>{
            getIssues();
        },[])

        // useEffect(()=>{
        //     let userAgent = navigator.userAgent;
        //      let browserName;
             
        //      if(userAgent.match(/chrome|chromium|crios/i)){
        //          browserName = "chrome";
        //        }else if(userAgent.match(/firefox|fxios/i)){
        //          browserName = "firefox";
        //        }  else if(userAgent.match(/safari/i)){
        //          browserName = "safari";
        //        }else if(userAgent.match(/opr\//i)){
        //          browserName = "opera";
        //        } else if(userAgent.match(/edg/i)){
        //          browserName = "edge";
        //        }else{
        //          browserName="No browser detection";
        //        }
        //        if(browserName !== 'chrome' || browserName !== 'firefox'){

        //        }
        // },[])


    async function getIssues() {
        try {
            issues = [];
            const github = new Octokit();
            setLoading(true);
            let res = []
            for await (const label of grantStatusArr) {
              let req = await github.rest.issues.listForRepo({
                owner: "stacksgov",
                repo: "Stacks-Grant-Launchpad",
                state: "all",
                labels: [label],

              });
              let newReq = res.concat(req.data);
              res = newReq
            }
            console.log('Issues response is : - ', res);

            res.map((issue) => {
                let teamMembers = issue.assignees.map((assignee) => assignee.login);

                issues.push({
                    dateSubmitted: issue.created_at,
                    number: issue.number,
                    grantLead: issue.user.login,
                    grantName: issue.title,
                    teamMembers: teamMembers,
                    url: issue.html_url,
                    labels: issue.labels,
                    body: issue.body
                });
            });

            const relevantIssues = issues.filter(
                (issue) =>
                    Date.parse(issue.dateSubmitted) <= Date.parse(endDate) &&
                    issue.url.includes('issues') &&
                    Date.parse(issue.dateSubmitted) > Date.parse('2022-08-06T20:14:41Z')
            );

            relevantIssues.map((issue) => {
                issue.labels.map((label) => {
                    if (applicationTypeArr.includes(label.name)) {
                        issue.applicationType = label.name;
                    }

                    if (grantTypeArr.includes(label.name)) {
                        issue.grantType = label.name;
                    }

                    if (grantTrackArr.includes(label.name)) {
                        issue.grantTrack = label.name;
                    }
                    if (grantStatusArr.includes(label.name)) {
                        issue.grantStatus = label.name;
                    }
                    if (grantPhaseArr.includes(label.name)) {
                        issue.grantPhase = label.name;
                    }
                    if (predictedImpactScoreArr.includes(label.name)) {
                        issue.predictedImpactScore = label.name;
                    }
                });
            });



            await Promise.all(
                relevantIssues.map(async (issue) => {
                    let req = await github.rest.issues.listComments({
                        owner: 'stacksgov',
                        repo: 'Stacks-Grant-Launchpad',
                        issue_number: `${issue.number}`
                    });
                    let res = req.data;
                    const commentSet = new Set();
                    res.map((commenter) => commentSet.add(commenter.user.login));
                    issue.commentName = Array.from(commentSet).join(', ');
                })
            );

            await Promise.all(
                relevantIssues.map(async (issue) => {
                    let req = await github.rest.reactions.listForIssue({
                        owner: 'stacksgov',
                        repo: 'Stacks-Grant-Launchpad',
                        issue_number: `${issue.number}`
                    });

                    let res = req.data;
                    const reactionSet = new Set();
                    res.map((reactor) => reactionSet.add(reactor.user.login));
                    issue.reactionUsername = Array.from(reactionSet).join(', ');
                })
            );

            relevantIssues.map((issue) => {
                if (issue.body) {
                    const regex = /(?<=&thinsp;)([\s\S]*?)(?=\*\*)/g;

                    const regexReplaceSpacing =
                        /(?<=\*\*Grant Name:\*\*&hairsp;&hairsp;&hairsp;&hairsp;).*?(?=&hairsp;)/g;

                    issue.body += '**';
                    issue.body = issue.body.replace('# GRANT BASICS', '** # GRANT BASICS');
                    issue.body = issue.body.replace(
                        '# GRANT MISSION, IMPACT, RISKS & REFERENCE',
                        '** # GRANT MISSION, IMPACT, RISKS & REFERENCE'
                    );
                    issue.body = issue.body.replace(
                        '# GRANT ROADMAP & DELIVERABLES',
                        '** # GRANT ROADMAP & DELIVERABLES'
                    );
                    issue.body = issue.body.replace('# WISHLIST IDEA', '** # WISHLIST IDEA');

                    issue.body = issue.body.replace(regexReplaceSpacing, '&hairsp;&hairsp;');

                    const lines = issue.body
                        .match(regex)
                        .map((line) => line.replace('\n', '').replace('\n', '').trim());

                    issue.grantName = lines[5];
                    issue.grantBudget = lines[6];
                    issue.grantDuration = lines[7];
                    issue.fundingStream = lines[8];
                    issue.grantType = lines[9];
                    issue.grantTrack = lines[10];
                    issue.grantGoal = lines[11];
                    issue.grantAudience = lines[12];
                    issue.specificAudience = lines[13];
                    issue.grantTeamMembers = lines[14];
                    issue.previousGrants = lines[15] == '' ? 'No' : 'Yes';
                    issue.ecosystemPrograms = lines[16] == '' ? 'No' : 'Yes';
                    issue.grantMission = lines[17];
                    issue.finalDeliverable = lines[21];

                    let issueCreatedOn = new Date(issue.dateSubmitted);
                    issue.dateSubmitted = issueCreatedOn.toLocaleString('default', {
                        month: 'long',
                        day: '2-digit',
                        year: '2-digit'
                    });

                    let newCSVData = CSVData;
                    newCSVData.push([
                        issue.dateSubmitted,
                        issue.number,
                        issue.applicationType,
                        issue.grantLead,
                        issue.previousGrants,
                        issue.ecosystemPrograms,
                        issue.grantName,
                        issue.grantBudget,
                        issue.grantDuration,
                        issue.grantType,
                        issue.grantTrack,
                        issue.grantGoal,
                        issue.grantAudience,
                        issue.finalDeliverable,
                        issue.grantStatus,
                        issue.grantPhase,
                        issue.predictedImpactScore,
                        issue.commentName,
                        issue.reactionUsername
                    ]);
                    setCSVData(newCSVData);
                }
            });

            if (relevantIssues.length === 0) {
                setGrantsFound('Nothing Matched this Criteria');
            } else {
                setGrantsFound(relevantIssues.length);
            }

            if (res) {
                setLoading(false);
                // setGithubIssues(res);
            }
        } catch (e) {
            setLoading(false);
        }
    }

        const handleSubmit = async(e) => {
            console.log(firstName,lastName,email,stxAddress,stxMemo,country,anticipatedCompletionDate);
            const [day,month,year] = anticipatedCompletionDate.toLocaleDateString().split('/');
            if (isSignedIn) {
                let onBoardingData = {
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "stxAddress": stxAddress,
                    "stxMemo": stxMemo,
                    "country": country,
                    "grantIssueNumber": grantIssueNumber,
                    "grantName": grantName,
                    "grantBudget": grantBudget,
                    "anticipatedCompletionDate": `${year}-${month}-${day}`
                }
                e.preventDefault();
                const valid = validateInputFields();
                if(valid){
                    setLoading(true);
                    console.log('Onboarding data is : - ',onBoardingData)
                    const res = await grantOnboarding(onBoardingData);
                    console.log('Onboarding res is : - ',res)
                    setLoading(false);
                }
                
            } else {
                setAlertVisible(true);
                // alert("Please connect a wallet")
            }
        }



        const handleGrantChange = (e) => {
            console.log('aaa',);
            const [_id,_grantName,_grantBudget] = e.target.value.split('-');
            // console.log('OOOO - : - ',_id,_grantName,_grantBudget)
            setGrantIssueNumber(_id);
            setGrantName(_grantName);
            setGrantBudget(_grantBudget);

        }


        const handleIssueNumber = (e) => {
            console.log('aaa',);
            const [_id,_grantName,_grantBudget] = e.target.value.split('-');
            setGrantIssueNumber(_id);
            // setGrantName(_grantName);
            // setGrantBudget(_grantBudget);
        }

        const validateInputFields = () => {

            setEmailError(false);
            setFirstError(false);
            setLastNameError(false);
            setStxMemoError(false);
            setGrantIssueNumberError(false);

            if(!email){
                setEmailError(true);
            }
            if(!firstName){
                setFirstError(true);
            }
            if(!lastName){
                setLastNameError(true);
            }
            if(!stxMemo){
                setStxMemoError(true);
            }
            if(!grantIssueNumber){
                setGrantIssueNumberError(true)
            }
            
            if(email && firstName && lastName && stxMemo && grantIssueNumber){
                return true;
            }else{
                return false;
            }
        }


        const resetInputFields = () => {
            setFirstName("");
            setLastName("");
            setStxMemo("");
            setEmail("");
            setCountry("");
            setAnticipatedCompletionDate(new Date());
        }
        
  return (
    <div className={styles.main}>
        {
			alertVisible ? <CustomAlert title="Please Connect a Wallet" onClose={()=>setAlertVisible(false)}/> : null
		}
        <Link href="/">
			<a>
				<div className={styles.close}>
					<p>
						<CloseIcon />
							Close
					</p>
				</div>
			</a>
		</Link>
        <BrowserWallet visible={browserError} handleClose={()=>setBrowserError(false)}/>
        <AddWallet visible={visible} handleClose={()=>setVisible(false)}/>
        {/* <ExploreModal visible={true} handleClose={()=>setVisible(false)}/> */}
        {/* <PopupModal visible={visible} handleClose={()=>setVisible(false)}/> */}
        <div className={styles.onBoardingWrapper}>
            <h2>
                Grant Onboarding
            </h2>
            <div className={styles.onBoardingRow}>
                        <div className={styles.onBoardingLeft}>
                            <p style={mb4} className={styles.text}>
                                A simple widget for providing private information required for receiving grant payments.
                            </p>
                            {
                                loading ? <LoadingSpinner/> 
                                :
                                <>
                            <div className={styles.formRow}>
                                <div className={styles.formControl}>
                                    <label>First Name</label>
                                    <input 
                                        className={styles.formInput}
                                        name="FirstName"
                                        type="type"
                                        placeholder="Type here..."
                                        value={firstName}
                                        onChange={(e)=>{setFirstName(e.target.value)}}
                                    />
                                    {firstNameError && <span className={styles.validationError}>Required!</span>}
                                </div>
                                <div className={styles.formControl}>
                                    <label>Last Name</label>
                                    <input 
                                        className={styles.formInput}
                                        name="LastName"
                                        type="type"
                                        placeholder="Type here..."
                                        value={lastName}
                                        onChange={(e)=>{setLastName(e.target.value)}}
                                    />
                                    {lastNameError && <span className={styles.validationError}>Required!</span>}

                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formControl}>
                                    <label>Email Address</label>
                                    <input 
                                        className={styles.formInput}
                                        name="Email"
                                        type="email"
                                        placeholder="Type here..."
                                        value={email}
                                        onChange={(e)=>{setEmail(e.target.value)}}
                                    />
                                    {emailError && <span className={styles.validationError}>Required!</span>}

                                </div>
                            </div>
                            {/* <div className={styles.formRow}>
                                <div className={styles.formControl}>
                                    <label>Github Issues</label>
                                    <div className={styles.selectWrapper}>
                                        <DropdownIcon className={styles.customSelectArrow} />
                                    <select className={styles.countrySelect} style={{height: 50}} onChange={(e)=>handleGrantChange(e)} name="selectIssue">
                                        {
                                            CSVData.map(item=>{
                                                return(<option key={item[1]} value={`${item[1]}-${item[6]}-${item[7]}`}>{item[6]}</option>)
                                            })
                                        }
                                    </select>
                                    </div>
                                </div>
                                
                            </div> */}
                            <div className={styles.formRow} style={{mb1}}>
                                <div className={styles.formControl}>
                                    <label>STX Wallet Address</label>
                                    <button onClick={walletButtonClicked} className={styles.walletButton}>
                                        {label}
                                    </button>
                                    
                                </div>
                                <div className={styles.formControl}>
                                    <label>STX Wallet Memo</label>
                                    <input
                                        className={styles.formInput}
                                        name="WalletMemo"
                                        type="text"
                                        placeholder="Type here..."
                                        value={stxMemo}
                                        onChange={(e)=>{setStxMemo(e.target.value)}}
                                    />
                                    {stxMemoError && <span className={styles.validationError}>Required!</span>}
                                    <span style={checkbox}><input type={'checkbox'}/>  I confirm no memo is required</span>
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formControl}>
                                    <label>Country of Residence</label>
                                    <div className={styles.selectWrapper}>
                                        <DropdownIcon className={styles.customSelectArrow} />
                                    <select className={styles.countrySelect} style={{height: 50}} onChange={(e)=>{setCountry(e.target.value)}} name="selectCountry">
                                        <option>Select Country</option>
                                        <option value="AF">Afghanistan</option>
                                        <option value="AX">Aland Islands</option>
                                        <option value="AL">Albania</option>
                                        <option value="DZ">Algeria</option>
                                        <option value="AS">American Samoa</option>
                                        <option value="AD">Andorra</option>
                                        <option value="AO">Angola</option>
                                        <option value="AI">Anguilla</option>
                                        <option value="AQ">Antarctica</option>
                                        <option value="AG">Antigua and Barbuda</option>
                                        <option value="AR">Argentina</option>
                                        <option value="AM">Armenia</option>
                                        <option value="AW">Aruba</option>
                                        <option value="AU">Australia</option>
                                        <option value="AT">Austria</option>
                                        <option value="AZ">Azerbaijan</option>
                                        <option value="BS">Bahamas</option>
                                        <option value="BH">Bahrain</option>
                                        <option value="BD">Bangladesh</option>
                                        <option value="BB">Barbados</option>
                                        <option value="BY">Belarus</option>
                                        <option value="BE">Belgium</option>
                                        <option value="BZ">Belize</option>
                                        <option value="BJ">Benin</option>
                                        <option value="BM">Bermuda</option>
                                        <option value="BT">Bhutan</option>
                                        <option value="BO">Bolivia</option>
                                        <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                        <option value="BA">Bosnia and Herzegovina</option>
                                        <option value="BW">Botswana</option>
                                        <option value="BV">Bouvet Island</option>
                                        <option value="BR">Brazil</option>
                                        <option value="IO">British Indian Ocean Territory</option>
                                        <option value="BN">Brunei Darussalam</option>
                                        <option value="BG">Bulgaria</option>
                                        <option value="BF">Burkina Faso</option>
                                        <option value="BI">Burundi</option>
                                        <option value="KH">Cambodia</option>
                                        <option value="CM">Cameroon</option>
                                        <option value="CA">Canada</option>
                                        <option value="CV">Cape Verde</option>
                                        <option value="KY">Cayman Islands</option>
                                        <option value="CF">Central African Republic</option>
                                        <option value="TD">Chad</option>
                                        <option value="CL">Chile</option>
                                        <option value="CN">China</option>
                                        <option value="CX">Christmas Island</option>
                                        <option value="CC">Cocos (Keeling) Islands</option>
                                        <option value="CO">Colombia</option>
                                        <option value="KM">Comoros</option>
                                        <option value="CG">Congo</option>
                                        <option value="CD">Congo, Democratic Republic of the Congo</option>
                                        <option value="CK">Cook Islands</option>
                                        <option value="CR">Costa Rica</option>
                                        <option value="CI">Cote D Ivoire</option>
                                        <option value="HR">Croatia</option>
                                        <option value="CU">Cuba</option>
                                        <option value="CW">Curacao</option>
                                        <option value="CY">Cyprus</option>
                                        <option value="CZ">Czech Republic</option>
                                        <option value="DK">Denmark</option>
                                        <option value="DJ">Djibouti</option>
                                        <option value="DM">Dominica</option>
                                        <option value="DO">Dominican Republic</option>
                                        <option value="EC">Ecuador</option>
                                        <option value="EG">Egypt</option>
                                        <option value="SV">El Salvador</option>
                                        <option value="GQ">Equatorial Guinea</option>
                                        <option value="ER">Eritrea</option>
                                        <option value="EE">Estonia</option>
                                        <option value="ET">Ethiopia</option>
                                        <option value="FK">Falkland Islands (Malvinas)</option>
                                        <option value="FO">Faroe Islands</option>
                                        <option value="FJ">Fiji</option>
                                        <option value="FI">Finland</option>
                                        <option value="FR">France</option>
                                        <option value="GF">French Guiana</option>
                                        <option value="PF">French Polynesia</option>
                                        <option value="TF">French Southern Territories</option>
                                        <option value="GA">Gabon</option>
                                        <option value="GM">Gambia</option>
                                        <option value="GE">Georgia</option>
                                        <option value="DE">Germany</option>
                                        <option value="GH">Ghana</option>
                                        <option value="GI">Gibraltar</option>
                                        <option value="GR">Greece</option>
                                        <option value="GL">Greenland</option>
                                        <option value="GD">Grenada</option>
                                        <option value="GP">Guadeloupe</option>
                                        <option value="GU">Guam</option>
                                        <option value="GT">Guatemala</option>
                                        <option value="GG">Guernsey</option>
                                        <option value="GN">Guinea</option>
                                        <option value="GW">Guinea-Bissau</option>
                                        <option value="GY">Guyana</option>
                                        <option value="HT">Haiti</option>
                                        <option value="HM">Heard Island and Mcdonald Islands</option>
                                        <option value="VA">Holy See (Vatican City State)</option>
                                        <option value="HN">Honduras</option>
                                        <option value="HK">Hong Kong</option>
                                        <option value="HU">Hungary</option>
                                        <option value="IS">Iceland</option>
                                        <option value="IN">India</option>
                                        <option value="ID">Indonesia</option>
                                        <option value="IR">Iran, Islamic Republic of</option>
                                        <option value="IQ">Iraq</option>
                                        <option value="IE">Ireland</option>
                                        <option value="IM">Isle of Man</option>
                                        <option value="IL">Israel</option>
                                        <option value="IT">Italy</option>
                                        <option value="JM">Jamaica</option>
                                        <option value="JP">Japan</option>
                                        <option value="JE">Jersey</option>
                                        <option value="JO">Jordan</option>
                                        <option value="KZ">Kazakhstan</option>
                                        <option value="KE">Kenya</option>
                                        <option value="KI">Kiribati</option>
                                        <option value="KP">Korea, Democratic Peoples Republic of</option>
                                        <option value="KR">Korea, Republic of</option>
                                        <option value="XK">Kosovo</option>
                                        <option value="KW">Kuwait</option>
                                        <option value="KG">Kyrgyzstan</option>
                                        <option value="LA">Lao Peoples Democratic Republic</option>
                                        <option value="LV">Latvia</option>
                                        <option value="LB">Lebanon</option>
                                        <option value="LS">Lesotho</option>
                                        <option value="LR">Liberia</option>
                                        <option value="LY">Libyan Arab Jamahiriya</option>
                                        <option value="LI">Liechtenstein</option>
                                        <option value="LT">Lithuania</option>
                                        <option value="LU">Luxembourg</option>
                                        <option value="MO">Macao</option>
                                        <option value="MK">Macedonia, the Former Yugoslav Republic of</option>
                                        <option value="MG">Madagascar</option>
                                        <option value="MW">Malawi</option>
                                        <option value="MY">Malaysia</option>
                                        <option value="MV">Maldives</option>
                                        <option value="ML">Mali</option>
                                        <option value="MT">Malta</option>
                                        <option value="MH">Marshall Islands</option>
                                        <option value="MQ">Martinique</option>
                                        <option value="MR">Mauritania</option>
                                        <option value="MU">Mauritius</option>
                                        <option value="YT">Mayotte</option>
                                        <option value="MX">Mexico</option>
                                        <option value="FM">Micronesia, Federated States of</option>
                                        <option value="MD">Moldova, Republic of</option>
                                        <option value="MC">Monaco</option>
                                        <option value="MN">Mongolia</option>
                                        <option value="ME">Montenegro</option>
                                        <option value="MS">Montserrat</option>
                                        <option value="MA">Morocco</option>
                                        <option value="MZ">Mozambique</option>
                                        <option value="MM">Myanmar</option>
                                        <option value="NA">Namibia</option>
                                        <option value="NR">Nauru</option>
                                        <option value="NP">Nepal</option>
                                        <option value="NL">Netherlands</option>
                                        <option value="AN">Netherlands Antilles</option>
                                        <option value="NC">New Caledonia</option>
                                        <option value="NZ">New Zealand</option>
                                        <option value="NI">Nicaragua</option>
                                        <option value="NE">Niger</option>
                                        <option value="NG">Nigeria</option>
                                        <option value="NU">Niue</option>
                                        <option value="NF">Norfolk Island</option>
                                        <option value="MP">Northern Mariana Islands</option>
                                        <option value="NO">Norway</option>
                                        <option value="OM">Oman</option>
                                        <option value="PK">Pakistan</option>
                                        <option value="PW">Palau</option>
                                        <option value="PS">Palestinian Territory, Occupied</option>
                                        <option value="PA">Panama</option>
                                        <option value="PG">Papua New Guinea</option>
                                        <option value="PY">Paraguay</option>
                                        <option value="PE">Peru</option>
                                        <option value="PH">Philippines</option>
                                        <option value="PN">Pitcairn</option>
                                        <option value="PL">Poland</option>
                                        <option value="PT">Portugal</option>
                                        <option value="PR">Puerto Rico</option>
                                        <option value="QA">Qatar</option>
                                        <option value="RE">Reunion</option>
                                        <option value="RO">Romania</option>
                                        <option value="RU">Russian Federation</option>
                                        <option value="RW">Rwanda</option>
                                        <option value="BL">Saint Barthelemy</option>
                                        <option value="SH">Saint Helena</option>
                                        <option value="KN">Saint Kitts and Nevis</option>
                                        <option value="LC">Saint Lucia</option>
                                        <option value="MF">Saint Martin</option>
                                        <option value="PM">Saint Pierre and Miquelon</option>
                                        <option value="VC">Saint Vincent and the Grenadines</option>
                                        <option value="WS">Samoa</option>
                                        <option value="SM">San Marino</option>
                                        <option value="ST">Sao Tome and Principe</option>
                                        <option value="SA">Saudi Arabia</option>
                                        <option value="SN">Senegal</option>
                                        <option value="RS">Serbia</option>
                                        <option value="CS">Serbia and Montenegro</option>
                                        <option value="SC">Seychelles</option>
                                        <option value="SL">Sierra Leone</option>
                                        <option value="SG">Singapore</option>
                                        <option value="SX">Sint Maarten</option>
                                        <option value="SK">Slovakia</option>
                                        <option value="SI">Slovenia</option>
                                        <option value="SB">Solomon Islands</option>
                                        <option value="SO">Somalia</option>
                                        <option value="ZA">South Africa</option>
                                        <option value="GS">South Georgia and the South Sandwich Islands</option>
                                        <option value="SS">South Sudan</option>
                                        <option value="ES">Spain</option>
                                        <option value="LK">Sri Lanka</option>
                                        <option value="SD">Sudan</option>
                                        <option value="SR">Suriname</option>
                                        <option value="SJ">Svalbard and Jan Mayen</option>
                                        <option value="SZ">Swaziland</option>
                                        <option value="SE">Sweden</option>
                                        <option value="CH">Switzerland</option>
                                        <option value="SY">Syrian Arab Republic</option>
                                        <option value="TW">Taiwan, Province of China</option>
                                        <option value="TJ">Tajikistan</option>
                                        <option value="TZ">Tanzania, United Republic of</option>
                                        <option value="TH">Thailand</option>
                                        <option value="TL">Timor-Leste</option>
                                        <option value="TG">Togo</option>
                                        <option value="TK">Tokelau</option>
                                        <option value="TO">Tonga</option>
                                        <option value="TT">Trinidad and Tobago</option>
                                        <option value="TN">Tunisia</option>
                                        <option value="TR">Turkey</option>
                                        <option value="TM">Turkmenistan</option>
                                        <option value="TC">Turks and Caicos Islands</option>
                                        <option value="TV">Tuvalu</option>
                                        <option value="UG">Uganda</option>
                                        <option value="UA">Ukraine</option>
                                        <option value="AE">United Arab Emirates</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="US">United States</option>
                                        <option value="UM">United States Minor Outlying Islands</option>
                                        <option value="UY">Uruguay</option>
                                        <option value="UZ">Uzbekistan</option>
                                        <option value="VU">Vanuatu</option>
                                        <option value="VE">Venezuela</option>
                                        <option value="VN">Viet Nam</option>
                                        <option value="VG">Virgin Islands, British</option>
                                        <option value="VI">Virgin Islands, U.s.</option>
                                        <option value="WF">Wallis and Futuna</option>
                                        <option value="EH">Western Sahara</option>
                                        <option value="YE">Yemen</option>
                                        <option value="ZM">Zambia</option>
                                        <option value="ZW">Zimbabwe</option>
                                    </select>
                                    </div>
                                </div>
                                <div className={styles.formControl} style={{width: '100%'}}>
                                    <label>Anticipated Completion Date <span style={grayColor}>(6 months max)</span></label>
                                    <CalendarDropdown onChange={setAnticipatedCompletionDate} value={anticipatedCompletionDate} />
                                </div>
                            </div>
                                </>
                            }
                        </div>
                        <div className={styles.onBoardingRight}>
                            <div className={styles.formControl}>
                                <label style={{marginBottom: 10}}>Select Issue Number:</label>
                                <div className={styles.selectWrapper}>
                                    <DropdownIcon className={styles.selectIssueArrow} />
                                    <select className={styles.issueSelect} style={{height: 15,marginBottom: 10}} onChange={(e)=>handleGrantChange(e)} name="selectIssue">
                                        {
                                            CSVData?.length > 1 && CSVData.map(item=>{
                                                return(<option key={item[1]} value={`${item[1]}-${item[6]}-${item[7]}`}>{item[1]}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                {grantIssueNumberError && <span className={styles.validationError}>Required!</span>}
                            </div>
                            <h5>Issue Number:</h5>
                            <p>{grantIssueNumber ? grantIssueNumber : ''}</p>
                            <h5>Grant Name:</h5>
                            <p>{grantName ? grantName : ''}</p>
                            <h5>Grant Budget:</h5>
                            <p>{grantBudget ? '$' + grantBudget : ''}</p>
                            <p style={marginBottom120}></p>
                            <div className={styles.divider}></div>
                            <p style={{...whiteColor, ...marginTop10}}>If any of the information provided above is incorrect please email us <a style={mailLink} href="mailto:corneliuscantonii@gmail.com">here.</a></p>
                            <span style={checkbox}><input className={styles.mt3} type={'checkbox'}/> <p className={styles.white}>I confirm all of the information on this page is correct.</p></span>
                            <button className={styles.gradientButton} disabled={loading} onClick={(e)=>{handleSubmit(e)}}>
                                {
                                    loading ? <LoadingSpinner/> : 'Click to Submit'
                                }
                            </button>
                        </div>
            </div>
        </div>
    </div>
  )
}

// const main ={
// 	backgroundColor: '#000',
// 	height: '100vh'
// }

const flex2 = {
    flex: 2
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
