import Link from 'next/link';
import slugify from "slugify";
import { useState, useEffect } from 'react';
import { firestore } from '../lib/firebase';
import * as IOIcons from 'react-icons/io';
import toast from "react-hot-toast";

export default function CompanyFeed({ posts, admin, superAdmin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} superAdmin={superAdmin} />) : null;
}

function PostItem({ post, admin = false, superAdmin = false }) {
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
                <Link href={`/${slugify(post.company.toLowerCase())}`}>
                    <div className="card-logo">
                        <img src={user?.photoURL} alt={post?.company} />
                    </div>
                </Link>
                <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                    <div className="card-info">
                        <p>{post.company}</p>
                        <h2>{post.title}</h2>
                        <p>{post.type}/{post?.companyCity}, {post?.companyCountry}</p>
                    </div>
                </Link>
                <div className="card-mid">
                    {post.createdAt && <p>{new Date(post.createdAt).getDay()}. {months[new Date(post.createdAt).getMonth()]}</p>}
                </div>
                <div className="card-end">
                    <button>
                        <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                            <a>Mehr Infos</a>
                        </Link>
                    </button>
                    <button>
                        <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                            <a>Bewerben</a>
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
                {/* if superadmin*/}
                {superAdmin && (
                    //set job to published
                    <div className="admin-settings">
                        <button onClick={async () => (await firestore.collection('users').doc(post.uid).collection('jobs').doc(post.slug).update({
                            published: true
                        }).then(() => {
                            toast.success('Post updated successfully!');
                            //reload page
                            window.location.reload();
                        }))}>
                            Publish
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}