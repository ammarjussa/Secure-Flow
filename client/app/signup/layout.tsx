import Header from "@/components/Header";
import { AuthContextProvider } from "@/context/AuthContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Header />
      <main>
        <AuthContextProvider>{children}</AuthContextProvider>
      </main>
    </section>
  );
}
