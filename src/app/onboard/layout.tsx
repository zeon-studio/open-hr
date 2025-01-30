export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-light min-h-screen flex flex-col">{children}</div>;
}
