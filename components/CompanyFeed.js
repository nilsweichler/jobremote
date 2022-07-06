import Link from 'next/link';
import slugify from "slugify";
import { useState, useEffect } from 'react';
import {auth, firestore} from '../lib/firebase';
import * as IOIcons from 'react-icons/io';
import toast from "react-hot-toast";

export default function CompanyFeed({ posts, admin, superAdmin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} superAdmin={superAdmin} />) : null;
}

function PostItem({ post, admin = false, superAdmin = false }) {
    // Naive method to calc word count and read time
    const wordCount = post?.info.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    const [user, setUser] = useState(null);
    const postinfo = post?.info.replace(/(<([^>]+)>)/gi, " ").slice(0, 88) + '...';

    console.log(post);

    //delete post
    const deletePost = async () => {
        const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('jobs').doc(post.slug);
        await postRef.delete();
        toast.success("Post deleted successfully");
    }

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
                    <div className="card-header">
                        <div className="card-header-image">
                            <Link href={`/${slugify(post.company.toLowerCase())}`}>
                                <a>
                                    <img src={user?.photoURL || 'hacker.png'} alt={post.company} />
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="card-info">
                        <div className="card-tags">
                            <div className="card-tag">
                                Remote
                            </div>
                            <div className="card-tag">
                                Mid-Level
                            </div>
                        </div>
                        {!admin &&
                        <div className="card-time">

                                <span className="card-time-icon">
                                <IOIcons.IoIosTime color="#DDDEDF"/>
                            </span>
                                <span className="card-time-text">
                            {(timeSince(post.createdAt))}
                                </span>
                        </div>
                        }
                        {admin && (
                            <div className="card-info">
                            {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
                                <button className="trash-button" onClick={deletePost}><IOIcons.IoIosTrash/></button>
                            </div>
                        )
                        }
                    </div>
                    <div className="card-text">
                        <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                            <a>
                                <h3>{post.title}</h3>
                            </a>
                        </Link>
                        <p>{postinfo}</p>
                    </div>
                    <div className="card-buttons">
                        <button className="card-button">
                            <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                                <a>
                                    Bewerben
                                </a>
                            </Link>
                        </button>
                        <button className="card-button">
                            <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                                <a>
                                    Mehr
                                </a>
                            </Link>
                        </button>
                    </div>
                    {/* If admin view, show extra controls for user */}
                    {admin && (
                        <div className="admin-settings">
                            <Link href={`/admin/${post.slug}`}>
                                <a className="admin-edit"><IOIcons.IoMdCreate/></a>
                            </Link>
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

function timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + "min";
    }
    return Math.floor(seconds) + " sec";
}