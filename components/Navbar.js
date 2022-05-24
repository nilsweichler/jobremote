import Link from 'next/link';
import {useContext} from "react";
import {UserContext} from "../lib/context";
import {auth} from "../lib/firebase";
import {useRouter} from "next/router";
import slugify from "slugify";

// Top navbar
export default function Navbar() {
  const {user, company} = useContext(UserContext)

  const router = useRouter();

  const signOut =  () => {
    router.push('/')
    auth.signOut();
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
            <div className="subnav">
              <Link href="/admin">
                <button className="subnavbtn"><img className="avatar" src={user?.photoURL || "hacker.png"} /></button>
              </Link>
              <div className="subnav-content">
                <li>
                  <a href={`/${slugify(company.toLowerCase())}`} className="submenu-link"><img className="avatar" src={user?.photoURL || "hacker.png"} /><p>{company}</p></a>
                </li>
                <li>
                  <a href="/settings" className="submenu-link">Einstellungen</a>
                </li>
                <li>
                  <a onClick={signOut} href="" className="submenu-logout">Ausloggen</a>
                </li>
              </div>
            </div>
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