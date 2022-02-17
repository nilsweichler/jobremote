import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Loader from '../components/loader'

import toast from 'react-hot-toast'

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.error('Toast Works!')}>
        Press Me!
      </button>
    </div>
  )
}
