import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "./firebase";
import {useEffect, useState} from "react";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [company, setCompany] = useState(null);
    const [isAdmin, setAdmin] = useState(null);


    useEffect(() => {
        let unsubscribe;

        if(user) {
            const ref= firestore.collection('users').doc(user.uid);
            unsubscribe = ref.onSnapshot((doc) => {
                setCompany(doc.data()?.company)
                setAdmin(doc.data()?.admin)
            });
        } else {
            setCompany(null);
            setAdmin(null);
        }

        return unsubscribe;

    }, [user]);

    return { user, company, isAdmin };
}