import Navbar from "../components/Navbar";

export const metadata = {
  title: "Notifications App"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>

        <Navbar />

        {children}

      </body>
    </html>
  );
}