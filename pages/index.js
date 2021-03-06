import styles from '../styles/Home.module.css'
import Link from 'next/link';

import CompanyFeed from '../components/CompanyFeed';
import Loader from '../components/Loader';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';
import {useState} from "react";
import Navbar from '../components/Navbar'
import Footer from "../components/Footer";
import {useTheme} from "next-themes";
import Metatags from "../components/Metatags";


// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
    const postsQuery = firestore
        .collectionGroup('jobs')
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(LIMIT);

    const posts = (await postsQuery.get()).docs.map(postToJSON);

    return {
        props: { posts }, // will be passed to the page component as props
    };
}


export default function Home(props) {

    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);

    const [postsEnd, setPostsEnd] = useState(false);
    const { theme, setTheme } = useTheme();

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

        const query = firestore
            .collectionGroup('jobs')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .startAfter(cursor)
            .limit(LIMIT);

        const newPosts = (await query.get()).docs.map((doc) => doc.data());

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

  return (
      <>
          <Metatags title="Jobremote.io | Entdecke hunderte Remote Jobs" description="Das ist ein Portfolioprojekt von Nils Weichler. Wenn Sie mehr über mich erfahren wollen, besuchen Sie nils-weichler.com." image="Meta-Image.png"/>
        <Navbar></Navbar>
          <section className={styles.heroSection}>
              <div className={styles.heroText}>
                  <h1>Entdecke hunderte Remote Jobs</h1>
                  <p>Suchen Sie nach Hunderten von Jobs und finden Sie <br/>
                      einen Job, der zu Ihnen passt! <br/>
                      Oder erstellen Sie einen Job GRATIS.</p>
                  <Link href="/login">
                    <button className={styles.heroButton}>Poste einen Job</button>
                  </Link>
              </div>
          </section>
          <main>
              <h2>Aktuelle Jobs</h2>
              <div className="container">
                  <div className='grid-container'>
                    <CompanyFeed posts={posts} />
                  </div>
                  <div className="load-center">
                      <Loader show={loading} />
                      {!loading && !postsEnd && <button onClick={getMorePosts}>Mehr laden</button>}
                      {postsEnd && 'Du hast das Ende erreicht!'}
                  </div>
              </div>
          </main>
          <Footer></Footer>
      </>
  )
}
