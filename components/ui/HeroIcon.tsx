import React from 'react';

// This SVG is a simplified representation of a Gopuram (temple tower), inspired by the Tamil Nadu emblem.
export const HeroIcon: React.FC = () => (
    <div className="p-2 bg-emerald-700 text-white rounded-lg shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18h12V9.83l-1.83-1.83H15v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.67H9v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.67H5.83L4 9.83V18h2z" opacity=".3" />
            <path d="M20 21H4v-2h16v2zM18 9.83 16.17 8H15V7c0-1.1-.9-2-2-2s-2 .9-2 2v1H9V7c0-1.1-.9-2-2-2s-2 .9-2 2v1H3.83L2 9.83V18h2v-5h12v5h2V9.83zM16 12H8v-2h8v2z" />
        </svg>
    </div>
);