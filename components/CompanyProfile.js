// UI component for user profile
export default function CompanyProfile({ user }) {
    return (
        <div className="box-center">
            <img src={user.photoURL || '/hacker.png'} className="card-img-center" />
            <h1>{capitalizeFirstLetter(user.company) || 'Anonymous Company'}</h1>
            <p>{user.companyInfo}</p>
        </div>
    );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}