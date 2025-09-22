import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Portfolio Tracker",
  description: "Manage portfolios and view market data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
