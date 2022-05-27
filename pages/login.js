import {auth, firestore, googleAuthProvider, githubAuthProvider} from "../lib/firebase";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import Link from 'next/link'
import {UserContext} from "../lib/context";
import {useRouter} from "next/router";
import * as FaIcons from 'react-icons/fa';

import debounce from 'lodash.debounce';
import * as AiIcons from "react-icons/ai";

export default function LoginPage(props) {
    const {user, company} = useContext(UserContext);

    const Router = useRouter();

    // Check onload if user is logged in if not redirect
    useEffect(() => {
        if(user && company){
            Router.push("/admin");
        }
    }, [user && company]);

  return (
      <>
    <main>
        <div className="loginWrapper">
            <Link href="/">
                <img className="login-logo" src="jobremote-logo.svg" />
            </Link>
            <h1>Login</h1>
            {user && !company ? null : <SignInGithubButton/> }
            {user && !company ? <CompanyForm/> : <SignInGoogleButton/> }
            <p className="login-or">or</p>
            {user && !company ? null : <SignInWithUserAndPass/> }
        </div>
    </main>
    </>
  )
}

//Sign in with Email and Password
function SignInWithUserAndPass(e) {
    const [passwordShown, setPasswordShown] = useState(false);
    const [loading, setLoading] = useState(false);
    const email = useRef();
    const password = useRef();
    const router = useRouter();

    const SignInWithData = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await auth.signInWithEmailAndPassword(email.current.value, password.current.value)
        } catch {
            toast.error('Failed to login to an account!')
        }
        setLoading(false);
    }

  return (
      <>
    <form onSubmit={SignInWithData}>
        <input type="email" placeholder="E-Mail" ref={email}></input>
        <div className="toggle-password">
            <input type={passwordShown ? "text" : "password"} placeholder="Passwort" ref={password}></input>
            <span onClick={() => setPasswordShown(!passwordShown)}><AiIcons.AiOutlineEye/></span>
        </div>
        <button className="btn-login" disabled={loading}>Login</button>
        <div className="text-links">
            <Link href="/register"><div className="clickable-text"><span>Noch kein Account?</span> Registrieren</div></Link>
            <Link href="/resetpw">Passwort vergessen?</Link>
        </div>
    </form>
      </>
  );
}
//Sign in with Google Button
function SignInGoogleButton() {
    const router = useRouter();

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  //redirect to admin page if user is logged in
  useEffect(() => {
      if(auth.currentUser){
          router.push('/admin');
      }
  }, [auth.currentUser]);

  return (
      <>
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'}/> Einloggen mit Google
    </button>
      </>
  );
}

// Sign in with Github
function SignInGithubButton() {
    const router = useRouter();

  const signInWithGithub = async () => {
      await auth.signInWithRedirect(githubAuthProvider);
  };

  useEffect(() => {
      if(auth.currentUser){
          router.push('/admin');
      }
    }, [auth.currentUser]);

  return (
      <>
    <button className="btn-github" onClick={signInWithGithub}>
      <img src={'/github.png'}/> Einloggen mit Github
    </button>
      </>
  );
}

// Sign out button
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}


export function CompanyForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const {user, company} = useContext(UserContext)

    const router = useRouter();


    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`);
        const companyDoc = firestore.doc(`companies/${formValue}`);

        // Commit both docs together as a batch write.
        const batch = firestore.batch();
        batch.set(userDoc, { company: formValue.toLowerCase(), companyInfo: "", photoURL: user.photoURL, displayName: user.displayName, admin: false });
        batch.set(companyDoc, { uid: user.uid });

        await batch.commit();
        await router.push('admin');
    };

    const onChanging = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value;
        const re = /[a-zA-Z0-9]/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work

    const checkUsername = useCallback(
        debounce(async (company) => {
            if (company.length >= 3) {
                const ref = firestore.doc(`companies/${company}`);
                const { exists } = await ref.get();
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !company && (
            <section>
                <h1>Firmenname auswählen</h1>
                <form onSubmit={onSubmit}>
                    <input name="company" placeholder="Firmenname" value={formValue} onChange={onChanging}/>
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button className="btn-login" type="submit" disabled={!isValid}>
                        Auswählen
                    </button>
                    <h3>Debug State</h3>
                    <div>
                        Company: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Company Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}