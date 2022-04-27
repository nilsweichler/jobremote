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

    console.log(post);

    //create month array
    const months = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
    ];

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
                <div className="card-head">
                    <img src={user?.photoURL || "hacker.png"}></img>
                    {post.createdAt && <p>{new Date(post.createdAt).getDay()}. {months[new Date(post.createdAt).getMonth()]}</p>}
                </div>
                <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                        <h2>
                            <a>{post.title}</a>
                        </h2>
                </Link>
                <div className="card-tags">
                    <div className="tag"><p>{post.type}</p></div>
                </div>
                <div>
                    <p className='card-country'>{post.companyCity && post.companyCity + ","} {post.companyCountry}</p>
                </div>
                <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                    <a><p className='card-info'>{postinfo}</p></a>
                </Link>
                <div className="card-buttons">
                    <button>
                        <Link href="#">
                            <a>Bewerben</a>
                        </Link>
                    </button>
                    <button>
                        <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                            <a>Mehr</a>
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