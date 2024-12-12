
import React from 'react';
import Tabs from './components/Tabs';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Database</title>
                <meta name="description" content="Database for the Somerville Museum" />
                {/* favicon svg */}
                <link rel="icon" type="image/svg+xml" href="/sm-logo.svg" />
                {/* favicon png as backup */}
                <link rel="icon" type="image/png" sizes="32x32" href="/sm-logo.png" />
            </head>
            <body>
                <div className="app-layout">
                    <Tabs />
                    <main className="main-content">{children}</main>
                </div>
            </body>
        </html>
    );
}