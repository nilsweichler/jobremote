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
import Metatags from "../../components/Metatags";

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
            <Metatags title="Jobremote.io | Edit your Job"/>
            <Sidebar></Sidebar>
            <main className='withSidebar'>
                {post && (
                    <>
                        <section>
                            <h1>{post.title}</h1>
                            <p>ID: {post.slug}</p>
                            <PostForm postRef={postRef} defaultValues={post} />
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
    const [benefits, setBenefits] = useState(defaultValues.benefits);
    const [jobType, setType] = useState(defaultValues.type);
    const [city, setCity] = useState(defaultValues.companyCity);
    const [country, setCountry] = useState(defaultValues.companyCountry);
    const [contactPerson, setContactPerson] = useState(defaultValues.contactPerson);
    const [contactEmail, setContactEmail] = useState(defaultValues.contactEmail);

    const updatePost = async () => {
        await postRef.update({
            info: info,
            profile: profile,
            tasks: tasks,
            benefits: benefits,
            type: jobType,
            companyCity: city,
            companyCountry: country,
            contactPerson: contactPerson,
            contactEmail: contactEmail,
            published: false,
            updatedAt: serverTimestamp(),
        });

        toast.success('Post updated successfully!')
    };

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            <div className="edit-post-container">
                <h2>Infos ??ber das Unternehmen</h2>
                <Editor name="infoText" onChange={(info) => {setInfo(info);}} editorLoaded={editorLoaded} value={defaultValues.info}></Editor>

                <h2>Profil des Bewerbers</h2>
                <Editor name="profileText" onChange={(profile) => {setProfile(profile);}} editorLoaded={editorLoaded} value={defaultValues.profile}></Editor>

                <h2>Aufgaben des Bewerbers</h2>
                <Editor name="tasksText" onChange={(tasks) => {setTasks(tasks);}} editorLoaded={editorLoaded} value={defaultValues.tasks}></Editor>

                <h2>Benefits</h2>
                <Editor name="benefitsText" onChange={(benefits) => {setBenefits(benefits);}} editorLoaded={editorLoaded} value={defaultValues.benefits}></Editor>

                <h2>Art der Anstellung</h2>
                <select name="type" defaultValue={defaultValues.type} onChange={(jobType) => {setType(jobType.target.value);}} required>
                    <option value="">W??hle eine Kategorie</option>
                    <option value="Vollzeit">Vollzeit</option>
                    <option value="Teilzeit">Teilzeit</option>
                    <option value="Praktikum">Praktikum</option>
                    <option value="Freelance">Freelance</option>
                </select>

                <h2>Anstellungsort</h2>
                <input name="companyCity" placeholder="City" onChange={(city) => {setCity(city.target.value);}} defaultValue={defaultValues.companyCity} required/>
                <input name="companyCountry" placeholder="Country" onChange={(country) => {setCountry(country.target.value);}} defaultValue={defaultValues.companyCountry} required/>

                <h2>Kontaktperson</h2>
                <input name="contact" placeholder="Contact Person" onChange={(contact) => {setContactPerson(contact.target.value);}} defaultValue={defaultValues.contactPerson} required/>
                <input name="contact-mail" type="email" placeholder="Contact Person Email" onChange={(contact) => {setContactEmail(contact.target.value);}} defaultValue={defaultValues.contactEmail} required/>

                <button type="submit" className="btn-green">
                    Speichern
                </button>
            </div>
        </form>
    );
}