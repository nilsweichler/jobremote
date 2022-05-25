import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import {UserContext} from "../lib/context";
import Footer from '../components/Footer';

import { useUserData } from '../lib/hooks';
import {ThemeProvider} from "next-themes";

function MyApp({ Component, pageProps }) {

  const userData = useUserData();


  return (
      <ThemeProvider defaultTheme="system">
        <UserContext.Provider value={userData}>
          <Component {...pageProps} />
          <Toaster></Toaster>
        </UserContext.Provider>
      </ThemeProvider>
  );
}

export default MyApp
