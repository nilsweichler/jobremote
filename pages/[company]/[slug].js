import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithCompany, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Metatags from "../../components/Metatags";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export async function getStaticProps({ params }) {
  const { company, slug } = params;
  const userDoc = await getUserWithCompany(company);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('jobs').doc(slug);
    post = postToJSON(await postRef.get());
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('jobs').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, company } = doc.data();
    return {
      params: { company, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function JobPosting(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost ||props.post;

  return (
      <>
        <Navbar></Navbar>
        <main className={styles.container}>
          <Metatags title={post.title} description={post.info} />
          <section>
            <PostContent post={post}></PostContent>
          </section>
        </main>
        <Footer></Footer>
      </>
  )
}