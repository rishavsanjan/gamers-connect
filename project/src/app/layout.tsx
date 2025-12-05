
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import { auth } from "@/auth";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from 'react-hot-toast';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const initialUser = session
    ? {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      username: session.user.username
    }
    : null;


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider initialUser={initialUser}>
          <Providers>
            <NextTopLoader
              color="#831FB0"
              height={4}
              showSpinner={false}
            />

            <Navbar />
            {children}

          </Providers>
          <Toaster position="top-right" />
        </UserProvider>



      </body>
    </html>
  );
}