import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import {UserContext} from "../lib/context";
import Footer from '../components/Footer';

import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {

  const userData = useUserData();


  return (
  <UserContext.Provider value={userData}>
    <Component {...pageProps} />
    <Toaster></Toaster>
    <Footer></Footer>
  </UserContext.Provider>
  );
}

export default MyApp
