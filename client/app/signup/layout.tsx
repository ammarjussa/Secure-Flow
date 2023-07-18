import Header from "@/components/Header";
import { AuthContextProvider } from "@/context/AuthContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          <AuthContextProvider>{children}</AuthContextProvider>
        </main>
      </body>
    </html>
  );
}
