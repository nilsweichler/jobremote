import Link from 'next/link';
import slugify from "slugify";
import { useState, useEffect } from 'react';
import { firestore } from '../lib/firebase';
import * as IOIcons from 'react-icons/io';

export default function CompanyFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {
    // Naive method to calc word count and read time
    const wordCount = post?.info.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    const [user, setUser] = useState(null);
    const postinfo = post?.info.replace(/(<([^>]+)>)/gi, " ").slice(0, 88) + '...';

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
        <>
            <div className="card">
                <img src={user?.photoURL || "hacker.png"}></img>
                <Link href={`/${slugify(post.company.toLowerCase())}`}>
                    <div className="company-name">
                        <button>
                            <a>
                                {post.company}
                            </a>
                        </button>
                    </div>
                </Link>

                <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                        <h2>
                            <a>{post.title}</a>
                        </h2>
                </Link>
                <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                    <a><p>{postinfo}</p></a>
                </Link>

                <div className="card-buttons">
                    <button>
                        <Link href="#">
                            <a>Apply Now</a>
                        </Link>
                    </button>
                    <button>
                        <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                            <a>View Job</a>
                        </Link>
                    </button>
                </div>

                {/* If admin view, show extra controls for user */}
                {admin && (
                    <div className="admin-settings">
                        <Link href={`/admin/${post.slug}`}>
                            <a className="admin-edit"><IOIcons.IoMdCreate/></a>
                        </Link>
                        {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
                    </div>
                )}
            </div>
        </>
    );
}