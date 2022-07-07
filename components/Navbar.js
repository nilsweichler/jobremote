import Link from 'next/link';
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../lib/context";
import {auth, firestore} from "../lib/firebase";
import {useRouter} from "next/router";
import slugify from "slugify";
import Switch from "react-switch";
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

// Top navbar
export default function Navbar() {
  const {user, company} = useContext(UserContext)
  const router = useRouter();

  // get user
  const [userData, setUserData] = useState(null);

    useEffect(() => {
        if(user) {
            firestore.collection('users').doc(user.uid).get().then(doc => {
            setUserData(doc.data());
            }).catch(err => {
            console.log(err);
            });
        }
    }
    , [user]);




  const signOut =  () => {
    router.push('/')
    auth.signOut();
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo"><img src="https://res.cloudinary.com/casinowitch/image/upload/v1656333561/jobremote-logo_rusnvs.svg"/></button>
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
                <button className="subnavbtn"><img className="avatar" src={userData?.photoURL || "https://res.cloudinary.com/casinowitch/image/upload/v1656333649/hacker_tet1io.png"} /></button>
              <div className="subnav-content">
                <li>
                  <a href={`/${slugify(company.toLowerCase())}`} className="submenu-link"><img className="avatar" src={userData?.photoURL || "https://res.cloudinary.com/casinowitch/image/upload/v1656333649/hacker_tet1io.png"} /><p>{company}</p></a>
                </li>
                <li>
                  <a href="/admin" className="submenu-link"><AiIcons.AiFillHome/>Dashboard</a>
                </li>
                <li>
                  <a href="/settings" className="submenu-link"><AiIcons.AiFillSetting/>Einstellungen</a>
                </li>
                <li>
                  <a onClick={signOut} className="submenu-link"><IoIcons.IoIosLogOut/>Ausloggen</a>
                </li>
              </div>
            </div>
          </>
        )}

        {/* user is not signed OR has not created company */}
        {!company && (
          <>
          <li>
            <div className="flex-box">
            <Link href="/login">
              <button className="btn-blue">Register/Login</button>
            </Link>
            </div>
          </li>
          </>
        )}
      </ul>
      
    </nav>
  );
}