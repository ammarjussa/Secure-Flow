import Header from "@/components/Header";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Header />
      <main>{children}</main>
    </section>
  );
}
