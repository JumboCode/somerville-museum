
import localFont from "next/font/local";
import "./globals.css";
import SortAlphaButton from "../components/SortAlphaButton.jsx";
import EditNoteButton from "@/components/EditNoteButton";
import './components/Popup.css'; // Ensure this is imported after Bootstrap CSS
import Popup from "./components/Popup";
import SelectItemButton from "./components/SelectItem";
import DeleteItemButton from "./components/DeleteItemButton";
import ExpandedEntry from "./components/ExpandedEntry";

import AddItemButton from "./components/AddItemButton";

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
      <body>
      <SelectItemButton />
      <DeleteItemButton />
      <AddItemButton/>
      <SortAlphaButton /> 
      <EditNoteButton />
      <Popup/>
      <ExpandedEntry/>
      </body>
    </html>
  );
 }