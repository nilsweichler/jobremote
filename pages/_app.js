import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import {UserContext} from "../lib/context";
import {useEffect, useState} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth, firestore} from "../lib/firebase";

function MyApp({ Component, pageProps }) {
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

  return (
  <UserContext.Provider value={{ user, company }}>
    <Navbar></Navbar>
    <Component {...pageProps} />
    <Toaster></Toaster>
  </UserContext.Provider>
  );
}

export default MyApp
