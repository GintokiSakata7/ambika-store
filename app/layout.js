import "./globals.css";
import { StoreProvider } from "../context/StoreContext";

export const metadata = {
  title: "Margin Studios Chemicals | House Cleaning Supplies by Margin Studio",
  description: "Shop quality house cleaning chemicals, concentrated phenyl, bathroom acids, naphthalene balls, bleaching powder, brooms, mops & scrubbers. Direct doorstep delivery for orders above ₹500 via WhatsApp at +91 9491554114.",
  keywords: "house cleaning chemicals, white phenyl, bathroom acid, naphthalene balls, bleaching powder, brooms, mops, scrubbers, Margin Studio, Margin Studios Chemicals",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
