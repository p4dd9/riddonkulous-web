import { GoogleAdDisplayUnit } from '@/app/components/GoogleAdDisplayUnit'
import { Header } from '@/app/components/layout/Header'
export default function Home() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-between pt-[100px]">
			<Header />

			<div>
				<h1 className="text-4xl ">Riddonkulous</h1>
				<p>Explore Daily, Fresh and Exciting Community Driven Riddles</p>

				<p>
					Welcome to Riddonkulous, the platform for creating and solving riddles. We believe in human
					creativity and fun.
				</p>
			</div>

			<GoogleAdDisplayUnit />
		</div>
	)
}
