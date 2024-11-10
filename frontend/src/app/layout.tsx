import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Meme Museum</title>
        <link href={"/images/logo1.png"} rel="icon" type="image/png" sizes="32x32"/>
      </head>
      <body className="w-full bg-slate-100 !text-gray-800">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
