import "./globals.css";
import Web3Provider from "./components/Web3Provider"; // Import the provider

export const metadata = {
  title: "ZK-Sentinel",
  description: "Verifiable Financial Identity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* Wrap the entire app so context is available everywhere */}
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}