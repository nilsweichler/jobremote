import Link from 'next/link';
import {useEffect, useState} from "react";
import {firestore} from "../lib/firebase";
import slugify from "slugify";
import {useRouter} from "next/router";
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import styles from '/styles/Post.module.css';

// UI component for main post content
export default function PostContent({ post }) {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();
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

    const router = useRouter();
    if(post?.published === false) {
        if (typeof window === 'undefined'){
            router.push('/404');
        }
        return null;
    }

    return (
        <div className={styles.container}>
            <section>
                <div className="breadcrumb">
                    <Link href={'/'}>
                        <a>Home</a>
                    </Link>
                    <span>></span>
                    <Link href={`/${slugify(post.company.toLowerCase())}`}>
                        <a>{capitalizeFirstLetter(post?.company)}</a>
                    </Link>
                    <span>></span>
                    <Link href={`/${slugify(post.company.toLowerCase())}/${post.slug}`}>
                        <a>{post?.title}</a>
                    </Link>
                </div>
                <div className="post">
                    <div className="post-header">
                        <img className="post-image" src={user?.photoURL} alt={post?.company} />
                        <div className="post-header-info">
                            <h1>{post?.title}</h1>
                            <div className="post-header-info-tags">
                                <div className="post-header-info-ort"><IoIcons.IoMdPin/>{post?.companyCity}, {post?.companyCountry}</div>
                                <div className="post-header-info-url"><AiIcons.AiOutlineGlobal/><a href={user?.companyURL}>{removeHttp(user?.companyURL)}</a></div>
                            </div>
                        </div>

                    </div>
                    <div dangerouslySetInnerHTML={{__html: post?.info}} ></div>
                    <h2>Ihr Profil</h2>
                    <div dangerouslySetInnerHTML={{__html: post?.profile}} ></div>
                    <h2>Aufgaben & Tätigkeiten</h2>
                    <div dangerouslySetInnerHTML={{__html: post?.tasks}} ></div>
                    <h2>Perspektiven & Leistungen</h2>
                    <div dangerouslySetInnerHTML={{__html: post?.benefits}} ></div>
                </div>
            </section>
            <aside>
                <div className="post-sidebar">
                    <h2>Fakten</h2>
                    <div className="post-sidebar-tag">
                        <h3>Eintrittstermin</h3>
                        <p>{post?.entry}</p>
                    </div>
                    <div className="post-sidebar-tag">
                        <h3>Anstellungsart</h3>
                        <p>{post?.type}</p>
                    </div>
                    <div className="post-sidebar-tag">
                    <h3>Ansprechpartner</h3>
                        <p style={{marginBottom: 5 + 'px'}}>{post?.contactPerson}</p>
                        <p>{post?.contactEmail}</p>
                    </div>
                    <Link href={user?.companyURL || post?.contactEmail}><button>Jetzt Bewerben</button></Link>
                </div>
            </aside>
        </div>
    );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function removeHttp(string) {
    // remove all slashes from a string
    string = string?.replace(/^(?:https?|ftp):\/\//, '');
    string = string?.replace(/\//g, '');
    return string;
}