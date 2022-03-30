import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Editor from "../../components/Editor";
import toast from "react-hot-toast";

import ReactMarkdown from 'react-markdown';
import Sidebar from '../../components/Sidebar';

export default function JobPostEdit(props) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('jobs').doc(slug);
    const [post] = useDocumentData(postRef);

    return (
        <>
            <Sidebar></Sidebar>
            <main className='withSidebar'>
                {post && (
                    <>
                        <section>
                            <h1>{post.title}</h1>
                            <p>ID: {post.slug}</p>

                            <PostForm postRef={postRef} defaultValues={post} />
                            <Link href={`/${post.company}/${post.slug}`}>
                                <button className="btn-blue">Live view</button>
                            </Link>
                        </section>
                    </>
                )}
            </main>
        </>
    );
}

function PostForm({ defaultValues, postRef }) {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [data, setData] = useState("");

    const updatePost = async ({ info, published }) => {
        console.log(data)
        await postRef.update({
            info: data,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ info, published });

        toast.success('Post updated successfully!')
    };

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            <div>

                <Editor name="infoText" onChange={(data) => {setData(data);}} editorLoaded={editorLoaded} value={defaultValues.info}></Editor>

                <button type="submit" className="btn-green">
                    Save Changes
                </button>
            </div>
        </form>
    );
}