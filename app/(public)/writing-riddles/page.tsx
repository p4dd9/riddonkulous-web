import { RelatedResources } from '@/app/components/articles/RelatedResources'
import type { Metadata } from 'next'
import Image from 'next/image'

export const dynamic = 'force-static'

export const metadata: Metadata = {
	title: 'Writing Riddles | Riddonkulous',
	description:
		'Learn the art and craft of creating engaging riddles, from understanding structure to mastering wordplay.',
}

export default function WritingRiddles() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col max-w-4xl mx-auto px-4 py-8 gap-8">
			<h1 className="text-3xl md:text-4xl text-center mb-4">Writing Riddles</h1>

			{/* Image Block */}
			<div className="w-full flex justify-center mb-8">
				<Image
					src="/pals/PAL050.gif"
					alt="Frog Magician"
					width={200}
					height={200}
					className="w-48 h-48 md:w-64 md:h-64"
				/>
			</div>

			{/* Content Blocks */}
			<article className="w-full flex flex-col gap-6 text-base md:text-lg leading-relaxed">
				<p>
					If you want to use riddles, you may well want to write your own. This is especially true if your
					setting is one where a lot of the classic subjects of riddles are less applicable (such as a sci-fi
					or modern setting). I&apos;m just going to give a few notes on that here. I think the best thing to
					do is often to start with the item, though I sometimes find that a good line or association just
					appears in my head. Let&apos;s take some of the things on my desk and talk through how I&apos;d
					approach writing a riddle for them.
				</p>

				<p>
					A mug is the first item here. I now need to think about aspects of the mug - things that it does or
					is that other people will instinctively recognise, and which are generic to the concept of a mug.
					The fact that my mug is white, or has the url of the University of Birmingham on it, aren&apos;t
					useful details because those won&apos;t be recognisable to other people&apos;s general conception of
					what a mug is. What we can say: mugs are usually made of pottery, clay, or china, mugs have handles
					(usually one), and mugs tend to contain hot drinks, especially tea and coffee. Both of those are
					brown, which is a useful colour-hook unlike the colour of the mug itself.
				</p>

				<p>
					I now need to think of some analogies or generic variants of these aspects: similar things in
					different situations. Brown liquid could be tea but could also be wet mud, clay or pottery can be
					genericised as &quot;earth&quot;, the handle could be analogised to an arm or limb of some sort.
					Analogies to humans or aspects of human life are especially powerful, and work well with the classic
					riddle format wherein the riddle is spoken from the perspective of the object. The handle seems like
					a good starting point for this reason: &quot;I have one arm&quot; or similar.
				</p>

				<p>
					The next stage is to construct the riddle from the analogies. An especially good trick is if you can
					build in an apparent paradox. If you look at the Filipino riddle mentioned earlier, that&apos;s a
					good example: it relies on just a single property of the object (having rich clothes), juxtaposed
					with excluding the category you&apos;d expect to have that object (wealthy people and priests).
					Another example would be{' '}
					<em>I&apos;ve golden head and golden tail, and yet no eyes nor mouth to wail</em>. The idea of
					something with a head but no eyes or mouth seems paradoxical, but of course there is something in
					that category, using a different understanding of &quot;head&quot; - a coin, which has a head and
					tail as its two sides. Looking at my one-armed mug, I think a paradox presents itself -
					specifically, that something with only one arm wouldn&apos;t be expected to carry boiling liquid.
					&quot;I have one arm and no legs, but yet I hold boiling water every day. What am I?&quot; And there
					you have it, a riddle! You could neaten it up into something more poetic, but it&apos;s functional
					enough already.
				</p>

				<p>
					Let&apos;s try one more, a trickier modern one - my microphone. Aspects: it hears things, it&apos;s
					comprised of a listening grilled section at the top and a base, it&apos;s got a wire to attach it to
					a computer, it&apos;s made of metal. It&apos;s probably the core functional aspect that&apos;s best
					to focus on here, and the analogy of microphone pickup to human hearing. The paradox is easy enough
					- it&apos;s that the microphone&apos;s &quot;hearing&quot; can be done despite nobody being around.
					I could also use the paradox of it being something that hears but does not speak or make a noise.
					This then gives me the idea of hooking onto an existing cultural trope that I can expect my audience
					to know - the idea that if a tree falls in the forest with nobody to hear it, does it make a sound?
				</p>

				{/* Quote Block */}
				<blockquote className="border-l-4 border-primary pl-6 py-4 my-4 italic bg-gray-900 rounded-r-lg">
					<p className="mb-2">
						When trees fall with no soul around,
						<br />
						I&apos;ll find out if they make a sound:
						<br />
						I&apos;ll listen long, with naught to say,
						<br />
						And save your words for another day.
						<br />
						What am I?
					</p>
				</blockquote>

				<p>
					Ta-da! Again, it&apos;s not perfect, but it&apos;s serviceable enough. Why not try making one of
					your own now?
				</p>
			</article>

			<RelatedResources excludePage="writing-riddles" />
		</div>
	)
}
