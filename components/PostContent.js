import Link from 'next/link';

// UI component for main post content
export default function PostContent({ post }) {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();
    
    return (
        <div className="post">
            <h1>{post?.title}</h1>
            <span className="text-sm">
        Written by{' '}
                <Link href={`/${post.company}/`}>
          <a className="text-info">@{post.company}</a>
        </Link>{' '}
                on {createdAt.toISOString()}
            </span>
            <div dangerouslySetInnerHTML={{__html: post?.info}} ></div>
        </div>
    );
}