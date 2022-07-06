// footer component

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
        <div className="footer-container">
            <div className="footer-logo">
                <Link href="/">
                    <a>
                        <img src="https://res.cloudinary.com/casinowitch/image/upload/v1656333561/jobremote-logo_rusnvs.svg" />
                    </a>
                </Link>
            </div>
            <div className="footer-links">
                <Link href="/impressum">Impressum</Link>
            </div>
        </div>
        </footer>
    )
}

