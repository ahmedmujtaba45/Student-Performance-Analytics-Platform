import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Classroom Analytics | Student Performance",
    template: "%s | Classroom Analytics",
  },
  description:
    "An interactive student performance analytics dashboard for exploring class trends, attendance, student profiles, and classroom records.",
  applicationName: "Classroom Analytics",
  openGraph: {
    type: "website",
    title: "Classroom Analytics | Student Performance",
    description:
      "Explore student progress, attendance trends, class reports, and teacher-recorded updates.",
    siteName: "Classroom Analytics",
  },
  twitter: {
    card: "summary",
    title: "Classroom Analytics | Student Performance",
    description:
      "An interactive dashboard for student progress and classroom insights.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
