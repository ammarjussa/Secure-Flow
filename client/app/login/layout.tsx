import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
