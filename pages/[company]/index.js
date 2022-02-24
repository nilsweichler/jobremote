import { getUserWithCompany, postToJSON } from '../../lib/firebase';
import CompanyProfile from '../../components/CompanyProfile';
import CompanyFeed from '../../components/CompanyFeed';

export async function getServerSideProps({ query }) {
    const { company } = query;

    const userDoc = await getUserWithCompany(company);

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
    <main>
      <CompanyProfile user={user}></CompanyProfile>
        <CompanyFeed posts={posts}></CompanyFeed>
    </main>
  )
}