import "./globals.css";
import { AppProvider } from "./context/AppContext"; // Verify this path too!
import { Toaster } from 'sonner';

export const metadata = {
  title: "ZK-Sentinel",
  description: "Verifiable Financial Identity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProvider>
           <Toaster position="top-right" />
           {children}
        </AppProvider>
      </body>
    </html>
  );
}