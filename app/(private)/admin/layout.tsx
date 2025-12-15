import { AuthProvider } from '@/app/contexts/AuthContext'
import '../../globals.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				{/* Google OAuth */}
				<script src="https://accounts.google.com/gsi/client" async></script>
			</head>
			<body className="antialiased flex flex-col min-h-screen">
				<AuthProvider>
					<main className="flex-1 h-full">{children}</main>
				</AuthProvider>
			</body>
		</html>
	)
}
