import { AuthProvider } from '@/app/contexts/AuthContext'
import { getCurrentUserServer } from '@/app/lib/serverAuth'
import '../../globals.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const initialUser = await getCurrentUserServer()

	return (
		<html lang="en">
			<head>
				{/* Google OAuth */}
				<script src="https://accounts.google.com/gsi/client" async></script>
			</head>
			<body className="antialiased flex flex-col min-h-screen">
				<AuthProvider initialUser={initialUser}>
					<main className="flex-1 h-full">{children}</main>
				</AuthProvider>
			</body>
		</html>
	)
}
