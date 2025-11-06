import Link from 'next/link';
import React from 'react';

interface Props {
    text: string;
}

const PostDescription: React.FC<Props> = ({ text }) => {
    const words = text.split(/\s+/);

    return (
        <p className="mb-4 leading-relaxed text-gray-200 flex flex-wrap gap-1">
            {words.map((word, index) => {
                if (word.startsWith('#')) {
                    const tag = word.slice(1); 
                    return (
                        <Link
                            href={`/community/hashtag_posts/${tag}`} key={index}
                            className="text-sky-400 hover:underline hover:text-sky-300 transition"
                        >
                            {word}
                        </Link>
                    );
                } else {
                    return <span key={index}>{word} </span>;
                }
            })}
        </p>
    );
};

export default PostDescription;
