import ImageUploader from "../components/ImageUploader";
import {auth, firestore, userToJSON} from "../lib/firebase";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../lib/context";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Sidebar from '../components/Sidebar';
import Switch from "react-switch";
import * as IoIcons from "react-icons/io";
import {useTheme} from "next-themes";


export default function Settings() {
    const [user, setUser] = useState(null);
    
    const userContext = useContext(UserContext);

    const { theme, setTheme } = useTheme()
    const [checked, setChecked] = useState(false);
    
    useEffect(() => {
        if(auth.currentUser){
            let uid = auth.currentUser.uid;
            firestore.collection("users").doc(uid).get().then(doc => {
                setUser(userToJSON(doc));
            });
        }
    }, [auth.currentUser]);

    //Change user Password
    const changePassword = (e) => {
        e.preventDefault();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        if(password === confirmPassword){
            auth.currentUser.updatePassword(password).then(() => {
                toast.success("Password changed successfully");
            }).catch(error => {
                toast.error(error.message);
            });
        }else{
            toast.error("Passwords do not match");
        }
    };

    //Change companyInfo
    const changeCompanyInfo = (e) => {
        e.preventDefault();
        let companyInfo = document.getElementById("companyInfo").value;
        let companyURL = document.getElementById("companyURL").value;
        const postRef = firestore.collection('users').doc(auth.currentUser.uid);
        postRef.update({
            companyInfo: companyInfo,
            companyURL: companyURL
        }).then(() => {
            toast.success("Company info changed successfully");
        }).catch(error => {
            toast.error(error.message);
        });
    }


    const handleChange = () => {
        setChecked(!checked);
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <>
            <Sidebar activePath='/settings'></Sidebar>
            <main className="withSidebar">
                {!user && <Loader show={true}/>}
                {user && (
                <div>
                <div className="settings">
                    <h1>Settings</h1>
                    {user?.admin ? <p>Du bist ein Admin</p> : <p>Du bist kein Admin</p>}
                    <img src={user?.photoURL || "https://res.cloudinary.com/casinowitch/image/upload/v1656333649/hacker_tet1io.png.png" } alt="profile picture" className="card-img-center"/>
                    <ImageUploader user={user}/>
                    <form onSubmit={changeCompanyInfo}>
                        <label>Change Company Info</label>
                        <textarea id="companyInfo" defaultValue={user?.companyInfo}></textarea>
                        <input id="companyURL" type="url" placeholder="Firmen-URL" defaultValue={user?.companyURL}></input>
                        <button type="submit" className="btn btn-primary">Speichern</button>
                    </form>
                </div>
                <div className="password-change">
                    <h2>Change Password</h2>
                    <form onSubmit={changePassword}>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input type="password" className="form-control" id="password" placeholder="New Password"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </form>
                </div>
                        <div>
                            <label>
                                <Switch offColor="#503AE2" onColor="#503AE2" uncheckedIcon={<IoIcons.IoIosSunny style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 25,
                                    color: "yellow",
                                }}/>} checkedIcon={<IoIcons.IoIosMoon style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 25,
                                    color: "yellow",
                                }}/>} onChange={handleChange} checked={checked} />
                            </label>
                        </div>
                </div>
                )}
            </main>
        </>
    );
}