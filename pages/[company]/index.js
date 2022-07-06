import { getUserWithCompany, postToJSON } from '../../lib/firebase';
import CompanyProfile from '../../components/CompanyProfile';
import CompanyFeed from '../../components/CompanyFeed';
import Metatags from "../../components/Metatags";
import Navbar from '../../components/Navbar';
import Footer from "../../components/Footer";

export async function getServerSideProps({ query }) {
    const { company } = query;

    const userDoc = await getUserWithCompany(company);

    // If no user, short circuit to 404 page
    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    // JSON serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsQuery = userDoc.ref
            .collection('jobs')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(5);
        posts = (await postsQuery.get()).docs.map(postToJSON);
    }

    return {
        props: { user, posts }, // will be passed to the page component as props
    };
}


export default function CompanyPage({ user, posts }) {
  return (
    <>
        <Metatags title={"Jobremote.io | " + user.company} />
        <Navbar></Navbar>
        <main>
        <CompanyProfile user={user}></CompanyProfile>
            <div className="grid-container">
                <CompanyFeed posts={posts}></CompanyFeed>
            </div>
        </main>
        <Footer></Footer>
    </>
  )
}