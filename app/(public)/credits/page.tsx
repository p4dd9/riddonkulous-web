import Image from 'next/image'
import Link from 'next/link'

export default function CreditsPage() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-2xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Credits</h1>
				<div className="flex justify-center mb-4">
					<Image
						src="/pals/PAL054.gif"
						alt="Credits character"
						width={200}
						height={200}
						className="object-contain"
						unoptimized
					/>
				</div>

				<p className="text-gray-300 text-center mb-6">
					I want honor this page to contributors for their awesome work. They were involved for comissions,
					awesome Asset Packs or contributed majorly to the community and development. Everyone of those I
					have worked with was fun and professional. Please checkout their work.
				</p>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<h2 className="text-xl ">Visuals</h2>
						<ul className="flex flex-col gap-3 list-none">
							<li>
								<Link
									href="https://elthen.itch.io/"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline text-primary"
								>
									Elthen
								</Link>
								<span className="text-gray-400 ml-2">- Characters &quot;Pals&quot;</span>
							</li>
							<li>
								<Link
									href="https://chierit.itch.io/"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline text-primary"
								>
									Chierit
								</Link>
								<span className="text-gray-400 ml-2">- Logo/Decoration</span>
							</li>
							<li>
								<Link
									href="https://www.clrcrs.com/"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline text-primary"
								>
									Nino
								</Link>
								<span className="text-gray-400 ml-2">- Animated Background</span>
							</li>
							<li>
								<Link
									href="https://zeromatrix.itch.io/"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline text-primary"
								>
									Justin Arnold
								</Link>
								<span className="text-gray-400 ml-2">- Icons</span>
							</li>
							<li>
								<Link
									href="https://ci.itch.io/"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline text-primary"
								>
									Chequered Ink
								</Link>
								<span className="text-gray-400 ml-2">- Fonts</span>
							</li>
						</ul>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-xl ">Authors</h2>
						<p className="text-gray-400 mb-2">Medusa and The Gorgons Adventure</p>
						<ul className="flex flex-col gap-2 list-none">
							<li>James Baillie</li>
							<li>Asther Kane</li>
							<li>Deloria Patton</li>
						</ul>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-xl ">Special Thanks</h2>
						<ul className="flex flex-col gap-2 list-none">
							<li>
								<span className="">D.E.M</span>
								<span className="text-gray-400 ml-2">
									- Community Work and Outstanding Contributions to the Community
								</span>
							</li>
							<li>
								<span className="">Samira, Boris, Sevi, Matthias, Florian, Denise and Reddit Team</span>
								<span className="text-gray-400 ml-2">
									- for listening to my ideas and providing exceptional feedback
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
