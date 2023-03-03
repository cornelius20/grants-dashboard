import React, { useEffect, useRef,useState } from 'react';
import styles from './GrantOnboarding.module.css';
import CloseIcon from '../public/images/close.svg';
import GithubIcon from "../public/images/github.svg";
import Link from 'next/link';
import { adminCreateUser, adminGetAllUsers, adminSearchUser, adminUpdateUser } from '../utils/ApiCalls';
import ReactLoading from 'react-loading';
import LoadingIndicator from '../components/LoadingIndicator';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router= useRouter()
    const selectRef = useRef();
    const [userData,setUserData] = useState({
        firstName: "",
        lastName: "",
        login: "",
        email: "",
        type: "User"
    });
    const [loading,setLoading] = useState(false);
    const [searchLoading,setSearchLoading] = useState(false);
    const [userList,setUserList] = useState([]);
    const [searchVal,setSearchVal] = useState('');
    const [currentUser,setCurrentUser] = useState(null);

    const createUser = async(data) => {
        console.log('Creating user ....')
        setLoading(true);
        const res = await adminCreateUser(data);
        setLoading(false);
        if(res.success){
            resetFields();
            setLoading(false);
            getAllUsers();
        }
    }

    useEffect(()=>{
        // console.log('User name is ',session?.user);
        if(!session?.user?.name.startsWith('will')){
            router.push('/');
        }
    },[])
    

    const updateUser = async(data) => {
        setLoading(true);
        const res = await adminUpdateUser(data);
        setLoading(false);
        console.log('Update response is : - ',res);
        if(res){
            getAllUsers();
        }
    }

    const getAllUsers = async() => {
        setLoading(true);
        const res = await adminGetAllUsers();
        setLoading(false);
        if(res){
            setLoading(false);
            setUserList(res.users);
        }
    }

    const searchUser = async(val) => {
        setSearchLoading(true);
        const res = await adminSearchUser(val);
        setSearchLoading(false);
        setUserList(res.users);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createUser(userData);
    }

    const handleEdit = (e) => {
        e.preventDefault();
        updateUser(currentUser);
    }

    const handleUser = (e,item) => {
        e.preventDefault();
        setCurrentUser(item);
    }

    const resetFields = () => {
        setUserData({
            firstName: "",
            lastName: "",
            login: "",
            email: "",
            type: "User"
        })
    }


    const ListItem = (item,index) => {
        const {name,type,id} = item;
        if(!type) type = 'User';
        let background;
        if(type == 'Admin') background = '#9F7AEA';
        if(type == 'Finance') background = '#48BB78';
        if(type == 'Reviewer' || 'User') background = 'orange';
        if(type == 'Grantee') background = 'cyan';

        return(
            <li key={index} className={styles.listItem}>
                <div style={titleView}>
                    <span>
                        <input type={'radio'}/>
                    </span>
                    <span>{name}</span>
                </div>
                <div style={{...flex1}}>
                    <span style={{background: type == 'Admin' ? '#9f7aea' : 'orange'}}>{type}</span>
                    <button disabled // onClick={(e)=>{handleUser(e,item)}}
                    >. . .</button>
                </div>
            </li>
        )
    }

    useEffect(()=>{
        getAllUsers(); 
    },[])

  return (
    <div style={main}>
        <Link href="/">
			<a>
				<div className={styles.close}>
					<p>
						<CloseIcon />
							Close
					</p>
				    <span></span>
				</div>
			</a>
		</Link>
        <div className={styles.onBoardingWrapper}>
            <h2>
                Admin Dashboard
            </h2>
            <div className={styles.onBoardingRow}>
                <div className={styles.onBoardingLeft}>
                    <p className={styles.text}>
                        A simple widget for adding users and adjusting permission settings by role.
                    </p>
                    <form>
                        <div className={styles.formRow}>
                            <div className={styles.formControl}>
                                <label>Search for user <span style={grayColor}>(only displays previously added users)</span></label>
                                <input 
                                    className={styles.formInput}
                                    name="SearchUserInput"
                                    type="text"
                                    placeholder="Type here..."
                                    onChange={(e)=>searchUser(e.target.value)}
                                />
                            </div>
                        </div>
                        <p>All Users</p>
                        <ul className={styles.namesList}>
                            <li style={displayFlex}>
                                <div style={titleView}>
                                    <span style={{...listTitle, ...marginLeft10}}>NAME</span>
                                </div>
                                <div style={flex1}>
                                    <span style={listTitle}>ROLE</span>
                                </div>
                            </li>
                            {
                                searchLoading ? <div className={styles.centerBox}><LoadingIndicator size={'large'}/></div> : userList.map((item,index)=> ListItem(item,index))
                            }
                        </ul>
                    </form>
                </div>
                <div className={styles.onBoardingRight}>
                    {
                        !currentUser ? <>
                            <p style={addUser}>Add a New User</p>
                            <form>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>First Name</label>
                                            <input 
                                                className={styles.formInput}
                                                name="FirstName"
                                                type="text"
                                                required
                                                placeholder="Type here..."
                                                value={userData.firstName}
                                                onChange={(e)=>{setUserData({...userData,firstName: e.target.value})}}
                                            />
                                        </div>
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>Last Name</label>
                                            <input 
                                                className={styles.formInput}
                                                name="LastName"
                                                required
                                                type="text"
                                                placeholder="Type here..."
                                                value={userData.lastName}
                                                onChange={(e)=>{setUserData({...userData,lastName: e.target.value})}}
                                            />
                                        </div>
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                        <label>Github Username <span style={grayColor}>(login username used)</span></label> 
                                        <div style={githubView}>
                                                <input   
                                                    className={styles.formInput}
                                                    name="GitHubUserName"
                                                    type="text"
                                                    required
                                                    placeholder="will-at-stacks"
                                                    value={userData.login}
                                                    onChange={(e)=>{setUserData({...userData,login: e.target.value})}}
                                                />
                                                <GithubIcon className={styles.searchIcon}/>
                                            </div>
                                        </div>  
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>Email Address</label>
                                            <input 
                                                className={styles.formInput}
                                                name="EmailAddress"
                                                required
                                                type="text"
                                                placeholder="Type here..."
                                                value={userData.email}
                                                onChange={(e)=>{setUserData({...userData,email: e.target.value})}}
                                            />
                                        </div> 
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>Select Role</label>
                                            <select name="selectUserType" onChange={(e)=>{setUserData({...userData,type: e.target.value})}}>
                                                <option value="Admin">Admin</option>
                                                <option value="User">User</option>
                                            </select>
                                        </div>
                                </div>
                                <div className={styles.divider}></div>
                                <button type='submit' disabled={loading} onClick={(e)=>{handleSubmit(e)}} className={styles.gradientButton}>
                                    {
                                        loading ? <LoadingIndicator size={'small'}/> : 'Click to Submit'
                                    }
                                </button>
                            </form>
                        </> : <>
                            <p style={addUser}>Edit User ({currentUser.name})</p>
                            <form>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>First Name</label>
                                            <input 
                                                className={styles.formInput}
                                                name="FirstName"
                                                type="text"
                                                required
                                                value={currentUser.name.split(' ')[0]}
                                                placeholder="Type here..."
                                                onChange={(e)=>{setCurrentUser({...currentUser,firstName: e.target.value})}}
                                            />
                                        </div>
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>Last Name</label>
                                            <input 
                                                className={styles.formInput}
                                                name="LastName"
                                                required
                                                type="text"
                                                value={currentUser.name.split(' ')[1]}
                                                placeholder="Type here..."
                                                onChange={(e)=>{setCurrentUser({...currentUser,lastName: e.target.value})}}
                                            />
                                        </div>
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                        <label>Github Username <span style={grayColor}>(login username used)</span></label> 
                                        <div style={githubView}>
                                                <input   
                                                    className={styles.formInput}
                                                    name="GitHubUserName"
                                                    type="text"
                                                    required
                                                    value={currentUser.login}
                                                    placeholder="will-at-stacks"
                                                    onChange={(e)=>{setCurrentUser({...currentUser,login: e.target.value})}}
                                                />
                                                <GithubIcon className={styles.searchIcon}/>
                                            </div>
                                        </div>  
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>Email Address</label>
                                            <input 
                                                className={styles.formInput}
                                                name="EmailAddress"
                                                required
                                                type="text"
                                                value={currentUser.email}
                                                placeholder="Type here..."
                                                onChange={(e)=>{setCurrentUser({...currentUser,email: e.target.value})}}
                                            />
                                        </div> 
                                </div>
                                <div className={styles.formRow}>
                                        <div className={styles.formControl}>
                                            <label>Select Role</label>
                                            <select name="selectUserType" onChange={(e)=>{setCurrentUser({...currentUser,type: e.target.value})}}>
                                                <option value="Admin">Admin</option>
                                                <option value="User">User</option>
                                            </select>
                                        </div> 
                                </div>
                                <div className={styles.divider}></div>
                                <button type='submit' disabled={loading} onClick={(e)=>{handleEdit(e)}} className={styles.gradientButton}>
                                    {
                                        loading ? <LoadingIndicator size={'small'}/> : 'Click to Submit'
                                    }
                                </button>
                            </form>
                        </>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

const main = {
	backgroundColor: '#000',
	height: '100vh'
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

const backgroundCyan = {
    backgroundColor: 'cyan'
}

const backgroundPurple = {
    backgroundColor: '#9F7AEA'
}

const backgroundOrange = {
    backgroundColor: 'orange'
}

const backgroundGreen = {
    backgroundColor: '#48BB78'
}

const listTitle = {
    fontWeight: 'bold',
    fontSize: 14
}

const grayColor = {
    color: 'gray'
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
