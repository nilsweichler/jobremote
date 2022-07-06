import Head from 'next/head';
import script from 'next/script';

export default function Metatags({title, description, image, jsonData}) {
return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description}  />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@weichlermedia" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
            />
        </Head>
    );
}