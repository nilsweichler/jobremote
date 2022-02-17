import { auth, googleAuthProvider } from "../lib/firebase";
import {useContext, useRef, useState} from "react";
import toast from "react-hot-toast";
import Link from 'next/link'
import {UserContext} from "../lib/context";
import {useRouter} from "next/router";

export default function LoginPage(props) {
    const {user, company} = useContext(UserContext)

  return (
    <main>
      {user ? 
        !company ? <CompanyForm /> : <SignOutButton /> 
        : 
        <SignInWithUserAndPass/>
      }
      {user ? 
      !company ? <CompanyForm/> : <SignOutButton />
      :
      <SignInGoogleButton/>
      }
      <Link href="/register">Registrieren</Link>
    </main>
  )
}

//Sign in with Email and Password
function SignInWithUserAndPass(e) {
    const [loading, setLoading] = useState(false);
    const email = useRef();
    const password = useRef();
    const router = useRouter();

    const SignInWithData = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await auth.signInWithEmailAndPassword(email.current.value, password.current.value)
            await router.push('admin');
        } catch {
            toast.error('Failed to login to an account!')
        }
        setLoading(false);
    }

  return (
    <form onSubmit={SignInWithData}>
        <input type="email" placeholder="E-Mail" ref={email}></input>
        <input type="password" placeholder="Passwort" ref={password}></input>
        <button disabled={loading}>Login</button>
        <Link href="/resetpw">Passwort vergessen</Link>
    </form>
  );
}
//Sign in with Google Button
function SignInGoogleButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'}/> Einloggen mit Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}


function CompanyForm() {
    return null;
}