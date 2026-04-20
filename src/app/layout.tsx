import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/utils/providers";

const syne = Syne({
    variable: "--font-syne",
    subsets: ["latin"],
    weight: ["400", "500", "700", "800"],
});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "NightShift | Technical Editorial",
    description: "Your next role is one login away.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${syne.variable} ${dmSans.variable} h-full antialiased dark`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
        >
            <body className="min-h-full flex flex-col bg-black text-[#EDEDED]">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
