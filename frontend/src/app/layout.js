import React from 'react'
import Dashboard from './components/Dashboard';
import Tabs from './components/Tabs';
import Inventory from './inventory/page';
import Link from 'next/link';

export default function RootLayout ({ children }) {
    return (
      <html lang="en">
        <body>
          <Tabs />
          <Link href="/"></Link>
          <Link href="/inventory"></Link>
          <Link href="/dashboard"></Link>
          <main>{children}</main>
        </body>
      </html>
    );
   }

   // All other components that aren't being used for Will and Peter ticket below

        {/* <SelectItemButton />
        <DeleteItemButton />
        <EditNoteButton />
        <Popup/>
        <AddItemButton/>
        <SortAlphaButton />
        <SelectByTag />
        <BorrowButton />
        // <Inventory/>  
    <Filters /> */}
      {/* <main>{children}</main> */}
      {/* <Tabs /> */}
      {/* <Inventory /> */}