import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {SidebarData} from './SidebarData';
import { IconContext } from 'react-icons';
import {useRouter} from 'next/router';
import {auth, firestore, postToJSON} from '../lib/firebase';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import slugify from 'slugify';
import AdminCheck from '../components/AdminCheck';

export default function Sidebar({activePath}) {
  const {user, company} = useContext(UserContext);
  const [sidebar, setSidebar] = useState(true);
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    if(user) {
      firestore.collectionGroup('jobs').where('published', '==', false).orderBy('createdAt', 'desc').get().then(snapshot => {
        setJobCount(snapshot.size);
      });
    }
  }, [user, company]);



  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  const router = useRouter();

  // SignOut from Firebase
  const signOut =  () => {
    router.push('/');
    //timeout the signout to make sure the user sees the loading screen
    setTimeout(() => {
      auth.signOut();
    }, 500);
  }

  return (
    <>
    <IconContext.Provider value={{color: '#000'}}>
        <div className="sidebar">
          <a className={sidebar ? 'menu-bars-burger active' : 'menu-bars-burger'}><FaIcons.FaBars onClick={toggleSidebar}/></a>
          <Link href="/">
            <button className="btn-logo"><img src="jobremote-logo.svg"/></button>
          </Link>
          {company && (
          <>
            <div className="subnav">
              <button className="subnavbtn"><img className="avatar" src={user?.photoURL || "hacker.png"} /></button>
              <div className="subnav-content">
                <li>
                  <a href={`/${slugify(company.toLowerCase())}`} className="submenu-link"><img className="avatar" src={user?.photoURL || "hacker.png"} /><p>{company}</p></a>
                </li>
                <li>
                  <a href="/settings" className="submenu-link"><AiIcons.AiFillSetting/>Einstellungen</a>
                </li>
                <li>
                  <a onClick={signOut} className="submenu-link"><IoIcons.IoIosLogOut/><span>Logout</span></a>
                </li>
              </div>
            </div>
          </>
        )}
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items'>
            <li className='navbar-toggle'>
              <a className='menu-bars' onClick={toggleSidebar}><AiIcons.AiOutlineClose/></a>
            </li>
            {SidebarData.map((item, index) => (
              <li key={index} className={item.cnName}>
                <Link href={item.path} onClick={item.function}>
                  <a className={activePath === item.path ? 'active' : ''}>{item.icon}<span>{item.title}</span></a>
                </Link>
              </li>
            ))}
            <AdminCheck admin={true}>
              <li className='nav-text'>
                <a href="/verify" className={activePath === '/verify' ? 'active' : ''}><IoIcons.IoIosLock/><span>Admin</span><span className="unpublished-count">{jobCount}</span></a>
              </li>
            </AdminCheck>
            <li className='nav-text'>
              <a onClick={signOut}><IoIcons.IoIosLogOut/><span>Logout</span></a>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  )
}