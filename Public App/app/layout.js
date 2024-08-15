import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import NavBar from "./_ui/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"]});
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "Blog App",
  description: "A simple blog app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body className={poppins.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
