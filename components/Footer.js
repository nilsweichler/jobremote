// footer component

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
        <div className="footer-container">
            <div className="footer-logo">
                <Link href="/">
                    <a>
                        <img src="jobremote-logo.svg" />
                    </a>
                </Link>
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

