import Image from "next/image";
import logo from "../../public/logo.png";
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AI Text Processor",
  description: "Text Summarizer, Language Detector, and Translator all in one",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={"h-screen flex flex-col"}>
        {/* navbar */}
        <nav className="flex items-center justify-between mt-3 mb-4 rounded-xl px-2 mx-auto w-full max-w-[90%]">
          <section className="">
            <Image
              src={logo}
              as="image"
              alt="logo"
              priority={true}
              className="w-fit h-10 cursor-pointer"
            ></Image>
            <h4 className="text-[0.6rem]">
              Summarize | Translate | Detect Languages.
            </h4>
          </section>
          <a
            className="text-[0.7rem] hover:border-b hover:border-[var(--color-main)] hover:shadow-xl transition-all ease-in-out duration-300"
            href=""
          >
            About Project
          </a>
        </nav>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
