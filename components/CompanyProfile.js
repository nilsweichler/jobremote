// UI component for user profile
export default function CompanyProfile({ user }) {
    return (
        <div className="box-center">
            <img src={user.photoURL || '/hacker.png'} className="card-img-center" />
            <p>
                <i>@{user.company}</i>
            </p>
            <h1>{user.displayName || 'Anonymous User'}</h1>
        </div>
    );
}