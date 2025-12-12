import '../globals.css'

export default function PasswordLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className="antialiased flex flex-col min-h-screen">{children}</body>
		</html>
	)
}

