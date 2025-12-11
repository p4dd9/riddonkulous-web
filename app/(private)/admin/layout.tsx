import '../../globals.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="antialiased flex flex-col min-h-screen">
				<main className="flex-1 h-full">{children}</main>
			</body>
		</html>
	)
}
