import Image from "next/image";
import Head from "next/head";
import logo from "../../public/logo.png";
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TextBender - Your Trusted AI Text Processor",
  description: "Text Summarizer, Language Detector, and Translator all in one",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          httpEquiv="origin-trial"
          content="An92Cn+zF0LljXPrwxnvojQqFCfTImoLdAJ4ilnN1TD7F9eUcC8YSBGcpOR6gpA4H2SpJVGUW21AMjre37iAyQIAAAB2eyJvcmlnaW4iOiJodHRwczovL2huZzEyLXRleHRiZW5kZXIudmVyY2VsLmFwcDo0NDMiLCJmZWF0dXJlIjoiVHJhbnNsYXRpb25BUEkiLCJleHBpcnkiOjE3NTMxNDI0MDAsImlzU3ViZG9tYWluIjp0cnVlfQ=="
        />
        <meta
          httpEquiv="origin-trial"
          content="Am/Lqnv0174l0+WE2zND4sLzxb6wRRhe5HKFyBv1v0dS4KunOb3lpniTCWpH+Ae5PYBEBLq8S1XTne4uLHr4rwsAAAB8eyJvcmlnaW4iOiJodHRwczovL2huZzEyLXRleHRiZW5kZXIudmVyY2VsLmFwcDo0NDMiLCJmZWF0dXJlIjoiTGFuZ3VhZ2VEZXRlY3Rpb25BUEkiLCJleHBpcnkiOjE3NDk1OTk5OTksImlzU3ViZG9tYWluIjp0cnVlfQ=="
        />
        <meta
          httpEquiv="origin-trial"
          content="AqGYginKlliC4fMuIKFPxeIxh/He+Xp3VSBZMRRgBGH5SxifvEhpL3XG8RQooGnaobL4RvJJU+G20q4sUPvW7gQAAAB6eyJvcmlnaW4iOiJodHRwczovL2huZzEyLXRleHRiZW5kZXIudmVyY2VsLmFwcDo0NDMiLCJmZWF0dXJlIjoiQUlTdW1tYXJpemF0aW9uQVBJIiwiZXhwaXJ5IjoxNzUzMTQyNDAwLCJpc1N1YmRvbWFpbiI6dHJ1ZX0="
        />
      </Head>
      <body
        className={`${inter.className} h-screen max-h-screen flex flex-col`}
      >
        {/* navbar */}
        <nav className="flex flex-col sm:flex-row items-center justify-between mt-3 mb-4 rounded-xl px-2 mx-auto w-full max-w-[90%]">
          <Image
            src={logo}
            as="image"
            alt="logo"
            priority={true}
            className="w-fit h-10 cursor-pointer"
          ></Image>
          <section className="flex itens-center">
         
          <h4 className="text-[0.8rem] w-fit text-center ">
            Summarize | Translate | Detect Languages.
          </h4>
          </section>

          {/* <a
            className="text-[0.7rem] hover:border-b hover:border-[var(--color-main)] hover:shadow-xl transition-all ease-in-out duration-300"
            href=""
            aria-label="about project link"
          >
            About Project
          </a> */}
        </nav>
        <Toaster position="top-center" />
        <main className="flex-grow flex flex-col w-full max-w-[95%] mx-auto overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
