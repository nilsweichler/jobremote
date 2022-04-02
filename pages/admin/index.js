import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import AdminCheck from '../../components/AdminCheck';
import CompanyFeed from '../../components/CompanyFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import slugify from 'slugify';
import toast from 'react-hot-toast';

import Sidebar from '../../components/Sidebar';

export default function AdminPostsPage(props) {
    return (
        <>
        <Sidebar activePath='/admin'></Sidebar>
        <main className='withSidebar'>
            <AdminCheck admin={true}>
                <p>Test</p>
            </AdminCheck>
            <AuthCheck>
                <CreateNewPost />
                <PostList />
            </AuthCheck>
        </main>
        </>
    );
}

function PostList() {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('jobs');
    const query = ref.orderBy('createdAt');
    const [querySnapshot] = useCollection(query);

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <>
            <h1>Manage your Posts</h1>
            <div className="grid-container">
                <CompanyFeed posts={posts} admin />
            </div>
        </>
    );
}

function CreateNewPost() {
    const router = useRouter();
    const { company } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(slugify(title));

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = firestore.collection('users').doc(uid).collection('jobs').doc(slug);

        // Tip: give all fields a default value here
        const data = {
            title,
            slug,
            uid,
            company,
            published: false,
            info: '# hello world!',
            tasks: '',
            profile: '',
            benefits: '',
            type: '',
            category: '',
            entry: '',
            contact: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await ref.set(data);

        toast.success('Jobposting erstellt!')

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);

    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Jobbezeichnung m/w/d"
                className={styles.input}
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}