import { AuthProvider } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import './globals.css';

export const metadata = {
  title: 'Smart Job Portal',
  description: 'Find your next career opportunity',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
