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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <h1>Hello, World?!?!?!?!?!?!?</h1>

        <button
          className="p-2 mx-8 rounded border bg-gray-100 hover:bg-gray-200"
          onclick="clickedFunction()"
        >
            Delete an item
        </button>

        {/* <Button
          onPress={onPressLearnMore}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        /> */}



      </body>
    </html>
  );
}

function clickedFunction() {
  console.log("button clicked");
}
