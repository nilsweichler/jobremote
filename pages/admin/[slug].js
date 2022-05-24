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
    const [info, setInfo] = useState(defaultValues.info);
    const [profile, setProfile] = useState(defaultValues.profile);
    const [tasks, setTasks] = useState(defaultValues.tasks);
    const [jobType, setType] = useState(defaultValues.type);
    const [city, setCity] = useState(defaultValues.companyCity);
    const [country, setCountry] = useState(defaultValues.companyCountry);

    const updatePost = async ({ info, published }) => {
        console.log(info)
        await postRef.update({
            info: info,
            profile: profile,
            tasks: tasks,
            type: jobType,
            companyCity: city,
            companyCountry: country,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ info, published });

        toast.success('Post updated successfully!')
    };

    useEffect(() => {
        setEditorLoaded(true);
        console.log(jobType);
    }, []);

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            <div>
                <h2>Post Info</h2>
                <Editor name="infoText" onChange={(info) => {setInfo(info);}} editorLoaded={editorLoaded} value={defaultValues.info}></Editor>

                <h2>Profile</h2>
                <Editor name="profileText" onChange={(profile) => {setProfile(profile);}} editorLoaded={editorLoaded} value={defaultValues.profile}></Editor>

                <h2>Tasks</h2>
                <Editor name="tasksText" onChange={(tasks) => {setTasks(tasks);}} editorLoaded={editorLoaded} value={defaultValues.tasks}></Editor>

                <h2>Type</h2>
                <select name="type" defaultValue={defaultValues.type} onChange={(jobType) => {setType(jobType.target.value);}} required>
                    <option value="">Select a category</option>
                    <option value="Fulltime">Fulltime</option>
                    <option value="Parttime">Parttime</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                </select>

                <h2>Job Location</h2>
                <input name="companyCity" placeholder="City" onChange={(city) => {setCity(city.target.value);}} defaultValue={defaultValues.companyCity} required/>
                <input name="companyCountry" placeholder="Country" onChange={(country) => {setCountry(country.target.value);}} defaultValue={defaultValues.companyCountry} required/>


                <button type="submit" className="btn-green">
                    Save Changes
                </button>
            </div>
        </form>
    );
}