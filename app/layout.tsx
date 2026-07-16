import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adventure OS",
  description: "Visual command centre for outdoor operations and connected projects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
