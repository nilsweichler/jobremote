import Link from 'next/link';
import {useContext, useState} from "react";
import {UserContext} from "../lib/context";
import {auth} from "../lib/firebase";
import {useRouter} from "next/router";
import slugify from "slugify";
import {useTheme} from "next-themes";
import Switch from "react-switch";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

// Top navbar
export default function Navbar() {
  const {user, company} = useContext(UserContext)
  const { theme, setTheme } = useTheme()
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  const handleChange = () => {
    setChecked(!checked);
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

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
                <li className="mode-switch">
                  <div>
                    <label>
                      <Switch offColor="#503AE2" onColor="#503AE2" uncheckedIcon={<IoIcons.IoIosSunny style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 25,
                        color: "yellow",
                      }}/>} checkedIcon={<IoIcons.IoIosMoon style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 25,
                        color: "yellow",
                      }}/>} onChange={handleChange} checked={checked} />
                    </label>
                  </div>
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
            <label>
                      <Switch offColor="#503AE2" onColor="#503AE2" uncheckedIcon={<IoIcons.IoIosSunny style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 25,
                        color: "yellow",
                      }}/>} checkedIcon={<IoIcons.IoIosMoon style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 25,
                        color: "yellow",
                      }}/>} onChange={handleChange} checked={checked} />
              </label>
            </div>
          </li>
          </>
        )}
      </ul>
      
    </nav>
  );
}