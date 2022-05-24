import ImageUploader from "../components/ImageUploader";
import {auth, firestore, userToJSON} from "../lib/firebase";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../lib/context";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Sidebar from '../components/Sidebar';


export default function Settings() {
    const [user, setUser] = useState(null);
    
    const userContext = useContext(UserContext);
    
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
        const postRef = firestore.collection('users').doc(auth.currentUser.uid);
        postRef.update({
            companyInfo: companyInfo
        }).then(() => {
            toast.success("Company info changed successfully");
        }).catch(error => {
            toast.error(error.message);
        });
    }

    

    return (
        <>
            <Sidebar activePath='/settings'></Sidebar>
            <main className="withSidebar">
                {!user && <Loader show={true}/>}
                {user && (
                <div className="box-center">
                <div className="settings">
                    <h1>Settings</h1>
                    {user?.admin ? <p>Du bist ein Admin</p> : <p>Du bist kein Admin</p>}
                    <img src={user?.photoURL || "hacker.png" } alt="profile picture" className="card-img-center"/>
                    <ImageUploader user={user}/>
                    <form onSubmit={changeCompanyInfo}>
                        <label>Change Company Info</label>
                        <textarea id="companyInfo" defaultValue={user?.companyInfo}></textarea>
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
                </div>
                )}
            </main>
        </>
    );
}