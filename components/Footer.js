// footer component

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
        <div className="footer-container">
            <div className="footer-logo">
                <img src="jobremote-logo.svg" />
            </div>
            <div className="footer-links">
            <Link href="#">Impressum</Link>
            <Link href="#">Datenschutz</Link>
            <Link href="#">AGB</Link>
            </div>
        </div>
        </footer>
    )
}

