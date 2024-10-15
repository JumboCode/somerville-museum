import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import SelectItem from "../components/SelectItem";
import DeleteItemButton from "../components/DeleteItemButton";

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

        <h1>Hello, World?!?!?!?!?!?!?</h1>

        <div>
            <DeleteItemButton />
        </div>

      </body>
    </html>
  );
}
