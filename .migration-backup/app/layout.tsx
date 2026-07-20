import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://samiam3d.com"),
  title: "Sam Gutierrez | Art Director and Game Maker",
  description:
    "Sam Gutierrez directs game art, interactive stories, and scalable creative teams across Mattel, Tales, Battlefield, and 2K.",
  icons: {
    icon: [
      {
        url: "/assets/images/2024/01/cropped-HombreBatz1-32x32.png",
        sizes: "32x32",
      },
      {
        url: "/assets/images/2024/01/cropped-HombreBatz1-192x192.png",
        sizes: "192x192",
      },
    ],
    apple: "/assets/images/2024/01/cropped-HombreBatz1-180x180.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/css/fonts.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
