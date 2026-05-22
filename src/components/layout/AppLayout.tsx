import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-layout__main">{children}</main>
      <footer className="app-layout__footer">
        <p>
          &copy; {new Date().getFullYear()} Smart Job Portal. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
