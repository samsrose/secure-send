import { Google_Sans, Google_Sans_Code } from "next/font/google";

export const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-google-sans",
});

export const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-google-sans-code",
});
