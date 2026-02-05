import { Bellefair, Lora, Roboto } from "next/font/google";

export const bellefair = Bellefair({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-bellefair",
});

export const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});
