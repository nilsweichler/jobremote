import PostContent from '../../components/PostContent';
import styles from '/styles/Post.module.css';
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

  let date = new Date(post.createdAt.seconds * 1000);

  let jsonData = {
    "@context": "http://schema.org",
    "@type": "JobPosting",
    "title": post.title,
    "description": post.info,
    "datePosted": date,
    "employmentType": post.type,
    "hiringOrganization": {
        "@type": "Organization",
        "name": post.company,
        "sameAs": "https://www.google.com/search?q=" + post.company,
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.google.com/search?q=" + post.company,
        },
    },
    "jobLocation": {
        "@type": "Place",
        "name": post.companyCity,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": post.companyCity,
            "addressCountry": post.companyCountry,
        }
    }
  }

  //String to date

  return (
      <>
        <Navbar></Navbar>
        <main className={styles.container}>
          <Metatags title={post.title} description={post.info} image="Meta-Image.png" jsonData={jsonData}/>
          <PostContent post={post}></PostContent>
        </main>
        <Footer></Footer>
      </>
  )
}