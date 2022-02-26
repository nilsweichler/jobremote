import {auth, firestore, googleAuthProvider} from "../lib/firebase";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import Link from 'next/link'
import {UserContext} from "../lib/context";
import {useRouter} from "next/router";

import debounce from 'lodash.debounce';

export default function LoginPage(props) {
    const {user, company} = useContext(UserContext)

  return (
    <main>
        <div className="loginWrapper">
            {user && !company ? null : <SignInWithUserAndPass/> }
            {user && !company ? <CompanyForm/> : <SignInGoogleButton/> }
        </div>
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
        } catch {
            toast.error('Failed to login to an account!')
        }
        setLoading(false);
    }

  return (
      <>
      <h1>Login</h1>
    <form onSubmit={SignInWithData}>
        <input type="email" placeholder="E-Mail" ref={email}></input>
        <input type="password" placeholder="Passwort" ref={password}></input>
        <button className="btn-login" disabled={loading}>Login</button>
        <Link href="/resetpw">Passwort vergessen?</Link>
    </form>
      </>
  );
}
//Sign in with Google Button
function SignInGoogleButton() {
    const router = useRouter();

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
    await router.push('/admin');
  };

  return (
      <>
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'}/> Einloggen mit Google
    </button>
    <Link href="/register">Noch kein Account? Registrieren</Link>
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
        batch.set(userDoc, { company: formValue.toLowerCase(), photoURL: user.photoURL, displayName: user.displayName, admin: false });
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
        console.log(formValue)
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
                console.log('Firestore read executed!');
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