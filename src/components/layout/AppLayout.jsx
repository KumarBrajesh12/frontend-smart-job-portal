import Navbar from './Navbar';

export default function AppLayout({ children }) {
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
