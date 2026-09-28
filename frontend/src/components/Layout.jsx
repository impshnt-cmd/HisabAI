import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-8 md:py-12">
          {(title || subtitle) && (
            <header className="mb-8">
              {title && <h1 className="font-display text-3xl md:text-4xl">{title}</h1>}
              {subtitle && <p className="text-inkSoft mt-1.5">{subtitle}</p>}
            </header>
          )}
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
