import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Returns Viewer",
    description: "Daily returns of the MAG7 stocks",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <header className="border-b border-gray-300 bg-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 sm:px-6">
                        <p className="text-xs font-bold uppercase tracking-wide text-teal">MAG7 daily returns</p>
                        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Returns Viewer</h1>
                    </div>
                </header>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
