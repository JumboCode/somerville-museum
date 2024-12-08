
import React from 'react';
import Tabs from './components/Tabs';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="app-layout">
                    <Tabs />
                    <main className="main-content">{children}</main>
                </div>
            </body>
        </html>
    );
}