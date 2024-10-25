
import localFont from "next/font/local";
import "./globals.css";
import './components/Popup.css'; // Ensure this is imported after Bootstrap CSS
import Popup from "./components/Popup";

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

      <h1>Martyna and Will's Button!</h1>
      <br></br>
      <Popup/>

      </body>
    </html>
  );
