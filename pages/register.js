import {useContext, useRef, useState} from "react";
import firebase from "firebase";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";
import {UserContext} from "../lib/context";
import {NextResponse} from "next/server";
import {useRouter} from "next/router";

export default function RegisterPage({ }) {
    const {user, company} = useContext(UserContext)

  return (
    <main>
      <RegisterWithUserAndPass></RegisterWithUserAndPass>
    </main>
  )
}


//create Account with Email and Password
function RegisterWithUserAndPass(e) {
    const [loading, setLoading] = useState(false);

    const email = useRef();
    const password = useRef();
    const repeatedPassword = useRef();
    const router = useRouter();

    const registerWithPass = async (e) => {
        e.preventDefault();
        console.log(email.current.value);
        if(password.current.value !== repeatedPassword.current.value) {
            toast.error('Passwords are not the same!')
        } else {
            try {
                setLoading(true);
                await auth.createUserWithEmailAndPassword(email.current.value, password.current.value);
                await router.push('admin');
            } catch {
                toast.error('Failed to create an account!')
            }
            setLoading(false);
        }
      };

  return (
      <form onSubmit={registerWithPass}>
        <input type="email" name="email" placeholder="E-Mail" ref={email}></input>
        <input type="password" name="password" placeholder="Passwort" ref={password}></input>
        <input type="password" placeholder="Wiederholtes Passwort" ref={repeatedPassword}></input>
        <button disabled={loading}>Registrieren</button>
      </form>
  );
}