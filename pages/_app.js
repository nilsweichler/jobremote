import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
  return (
  <> 
    <Navbar></Navbar>
    <Component {...pageProps} />
    <Toaster></Toaster>
  </>
  );
}

export default MyApp
