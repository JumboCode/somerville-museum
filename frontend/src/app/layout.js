
import localFont from "next/font/local";
import "./globals.css";
import SortAlphaButton from "./components/SortAlphaButton.jsx";
import EditNoteButton from "./components/EditNoteButton";
import './components/Popup.css'; 
import Popup from "./components/Popup";
import SelectItemButton from "./components/SelectItem";
import DeleteItemButton from "./components/DeleteItemButton";
import AddItemButton from "./components/AddItemButton";
import ELiTable from "./components/15Tablecomp/EliTable";
import SelectByTag from "./components/selectByTag";
import Dashboard from "./components/Dashboard";
import Filters from "./components/Filters";
import BorrowButton from "./components/BorrowButton.jsx";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "first page!!",
  description: "good luck team!!",
};

//on click method
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>first page!!</title>
        <meta name="description" content="good luck team!!" />
        {/* favicon svg */}
        <link rel="icon" type="image/svg+xml" href="/sm-logo.svg" />
        {/* favicon png as backup */}
        <link rel="icon" type="image/png" sizes="32x32" href="/sm-logo.png" />
      </head>
      <body>
        <SelectItemButton />
        <DeleteItemButton />
        <EditNoteButton />
        <Popup />
        <AddItemButton />
        <SortAlphaButton />
        <SelectByTag />
        <BorrowButton />
        <Dashboard />
        <ELiTable />
        <Filters />
      </body>
    </html>
  );
 }
 