import ImageUploader from "../components/ImageUploader";
import {auth, firestore, getUserWithUID, postToJSON, userToJSON} from "../lib/firebase";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../lib/context";


export default function SettingsPage() {
    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState(false);

    const res = firestore.collection('users').doc(auth.currentUser.uid).get();
    const data = userToJSON(res);
    setUser(data);

    if(isLoading) return <p>Loading</p>;

    return (
        <main>
            <p>{user}</p>
            <ImageUploader props={user}></ImageUploader>
        </main>
    )
}