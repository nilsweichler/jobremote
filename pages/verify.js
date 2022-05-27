import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import {useContext, useEffect, useState} from "react";
import {firestore, postToJSON} from "../lib/firebase";
import CompanyFeed from "../components/CompanyFeed";
import AdminCheck from "../components/AdminCheck";
import {UserContext} from "../lib/context";
import Router from "next/router";

export async function getServerSideProps(context) {
    const postsQuery = firestore
        .collectionGroup('jobs')
        .where('published', '==', false)
        .orderBy('createdAt', 'desc');

    const posts = (await postsQuery.get()).docs.map(postToJSON);


    return {
        props: { posts }, // will be passed to the page component as props
    };
}

export default function Verify(props) {

    const [posts, setPosts] = useState(props.posts);
    const { isAdmin } = useContext(UserContext);

    return (
        <>
            <Sidebar activePath='/verify'></Sidebar>
            <AdminCheck admin={true}>
                <main className="withSidebar">
                    <h1>{posts.length} Post to verify</h1>
                    <div className='grid-container'>
                        {posts.length === 0 ?
                            <h2>No posts to verify</h2>
                            :
                            <CompanyFeed posts={posts} admin={true} superAdmin={true}/>
                        }
                    </div>
                </main>
            </AdminCheck>
        </>
    );
}