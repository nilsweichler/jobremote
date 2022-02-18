import Link from 'next/link';
import {useContext} from "react";
import {UserContext} from "../lib/context";
import {auth} from "../lib/firebase";
import {useRouter} from "next/router";

// Top navbar
export default function Navbar() {
  const {user, company} = useContext(UserContext)

  const router = useRouter();

  const signOut =  () => {
    auth.signOut();
    router.push('/');
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo"><img src="jobremote-logo.svg"/></button>
          </Link>
        </li>

        {/* user is signed-in and has company */}
        {company && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Poste einen Job</button>
              </Link>
            </li>
            <li>
              <button onClick={signOut} className="btn-blue">Ausloggen</button>
            </li>
            <li>
              <Link href={`/${company.toLowerCase()}`}>
                <img className="avatar" src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created company */}
        {!company && (
          <li>
            <Link href="/login">
              <button className="btn-blue">Register/Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}