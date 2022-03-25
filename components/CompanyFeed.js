import Link from 'next/link';
import slugify from "slugify";
import { useState, useEffect } from 'react';
import { firestore } from '../lib/firebase';

export default function CompanyFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {
    // Naive method to calc word count and read time
    const wordCount = post?.info.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (post?.company) {
            const getUser = async () => {
                const userQuery = await firestore.collection('users').where('company', '==', post.company).get();
                const user = userQuery.docs[0].data();
                setUser(user);
            }
            getUser();
        }
    }, [post]);

    return (
        <div className="card">
            <Link href={`/${slugify(post.company.toLowerCase())}`}>
                <a>
                    <strong>By @{slugify(post.company)}</strong>
                    <img src={user?.photoURL || "hacker.png"}></img>
                </a>
            </Link>

            <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                <h2>
                    <a>{post.title}</a>
                </h2>
            </Link>

            {/* If admin view, show extra controls for user */}
            {admin && (
                <>
                    <Link href={`/admin/${post.slug}`}>
                        <h3>
                            <button className="btn-blue">Edit</button>
                        </h3>
                    </Link>

                    {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
                </>
            )}
        </div>
    );
}