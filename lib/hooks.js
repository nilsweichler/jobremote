import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "./firebase";
import {useEffect, useState} from "react";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [company, setCompany] = useState(null);


    useEffect(() => {
        let unsubscribe;

        if(user) {
            const ref= firestore.collection('users').doc(user.uid);
            unsubscribe = ref.onSnapshot((doc) => {
                setCompany(doc.data()?.company)
            });
        } else {
            setCompany(null);
        }

        return unsubscribe;

    }, [user]);

    return { user, company };
}