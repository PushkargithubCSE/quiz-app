import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuizMaster — Test Your Knowledge",
  description: "An elegant 10-question quiz with real-time scoring and analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
