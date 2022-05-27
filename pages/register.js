import {useContext, useRef, useState} from "react";
import {auth, firestore} from "../lib/firebase";
import toast from "react-hot-toast";
import {UserContext} from "../lib/context";
import {useRouter} from "next/router";
import Link from "next/link";
import debounce from "lodash.debounce";
import {CompanyForm} from "./login";
import Navbar from "../components/Navbar";

export default function RegisterPage({ }) {
    const {user, company} = useContext(UserContext)

  return (
      <>
      <Navbar></Navbar>
    <main>
        <div className="loginWrapper">
            <h1>Registrieren</h1>
            {user && !company ? <CompanyForm/> : <RegisterWithUserAndPass/> }
        </div>
    </main>
    </>
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
        if(password.current.value !== repeatedPassword.current.value) {
            toast.error('Passwords are not the same!')
        } else {
            try {
                setLoading(true);
                await auth.createUserWithEmailAndPassword(email.current.value, password.current.value);
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
        <button className="btn-login" disabled={loading}>Registrieren</button>
          <Link href="/login">Haben Sie einen Account? Login</Link>
      </form>
  );
}