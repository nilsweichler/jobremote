import Sidebar from "../../../components/Sidebar";
import Metatags from "../../../components/Metatags";

export default function JobPostsPage() {
    return (
        <>
        <Sidebar activePath='/admin/job-posts'></Sidebar>
        <main className='withSidebar'>
            <Metatags title="Job Posts"></Metatags>
            <h1>Job Posts</h1>
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
            voluptatem, quisquam, voluptatum, doloremque, quibusdam quis
            repellendus dolore, quam doloremque quisquam dolorum, quia
            voluptatem doloremque eius.
            </p>
        </main>
        </>
    )
}