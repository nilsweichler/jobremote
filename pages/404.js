import Link from 'next/link';
import Navbar from '../components/Navbar';
import Metatags from "../components/Metatags";

export default function Custom404() {
    return (
        <>
            <Metatags title="Jobremote.io | 404 Fehler" description="404 Error Page"/>
        <Navbar></Navbar>
        <main>
            <h1>404 - Diese Seite scheint nicht zu existieren!</h1>
            <iframe
                src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
                width="480"
                height="362"
                frameBorder="0"
                allowFullScreen
            ></iframe>
            <Link href="/">
                <button className="btn-blue">Zurück</button>
            </Link>
        </main>
        </>
    );
}