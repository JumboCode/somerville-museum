import localFont from "next/font/local";
import "./globals.css";

import './components/Popup.css'; // Ensure this is imported after Bootstrap CSS

import DeleteButton from './components/DeleteButton.js';
import AddTagButton from "./components/AddTagButton";
import Popup from "./components/Popup";
import SelectDropdown from "./components/SelectDropdown";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

      <h1>Martyna and Will's Buttons!</h1>
      <DeleteButton/>
      <AddTagButton/>
      <Popup/>

      </body>
    </html>
  );
}
