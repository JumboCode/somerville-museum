import localFont from "next/font/local";
import "./globals.css";

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

import AddTagButton from './components/AddTagButton'; // Ensure correct import

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <h1>Good morning Sommerville</h1>
        <AddTagButton/> {/* Add the AddTagButton component */}
      </body>
    </html>
  );
}



