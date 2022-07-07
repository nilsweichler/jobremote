import Metatags from "../components/Metatags";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Impressum() {
    return (
        <>
            <Metatags
                title="Jobremote.io | Impressum"
                description="Impressum"/>
            <Navbar/>
            <main className="impressum">
                <h1>Impressum</h1>
                <h2>Angaben gemmäß §5 TMG</h2>
                <p>Nils Weichler</p>
                <p>Beidendorfer Hauptstraße 17</p>
                <p>23560 Lübeck</p>
                <h2>Kontakt</h2>
                <p>E-Mail: weichlermedia@gmail.com</p>
                <h2>Redaktionell verantwortlich</h2>
                <p>Nils Weichler</p>
                <p>Quelle: e-recht24.de</p>

            </main>
            <Footer/>
        </>
    );
}