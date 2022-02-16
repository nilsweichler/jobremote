import Link from 'next/link';

// Top navbar
export default function Navbar() {
  const user = null;
  const company = null;

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo"><img src="jobremote-logo.svg"/></button>
          </Link>
        </li>

        {/* user is signed-in and has company */}
        {company && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Poste einen Job</button>
              </Link>
            </li>
            <li>
              <Link href={`/${company}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created company */}
        {!company && (
          <li>
            <Link href="/login">
              <button className="btn-blue">Register/Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
