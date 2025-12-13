import { RelatedResources } from '@/app/components/articles/RelatedResources'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'

export const metadata: Metadata = {
	title: 'Using Riddles | Riddonkulous',
	description:
		'Learn practical ways to incorporate riddles into education, entertainment, and cognitive development.',
}

export default function UsingRiddles() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col max-w-4xl mx-auto px-4 py-8 gap-8">
			<h1 className="text-3xl md:text-4xl text-center mb-2">Using Riddles</h1>
			<p className="text-center italic mb-4 text-gray-400">
				By{' '}
				<Link
					href="https://exilian.co.uk/forum/index.php?PHPSESSID=e2ce9d37ltfs2ojc49rffcvgo1;topic=5701.msg123309#msg123309"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline text-primary"
				>
					Jubal
				</Link>
			</p>

			{/* Image Block */}
			<div className="w-full flex justify-center mb-8">
				<Image
					src="/pals/PAL056.gif"
					alt="Frog Magician"
					width={200}
					height={200}
					className="w-48 h-48 md:w-64 md:h-64"
				/>
			</div>

			{/* Content Blocks */}
			<article className="w-full flex flex-col gap-6 text-base md:text-lg leading-relaxed">
				<p>
					If you&apos;re a writer or game designer, riddles have a huge range of uses. They provide a puzzle
					for readers/players that doesn&apos;t require any further mechanical elements, and is (if well
					written) a general-purpose fair challenge. They provide a change of pace, too. In books, the
					presence of a poetic section can break up the drumbeat of paragraphs as they drop onto the page and
					give the reader something in a refreshingly different voice or tone. In games, they can shift the
					game from problems that rely on the player&apos;s stats or even on more conventional puzzle
					mechanics to something that requires the player to engage with words and wordplay in a way
					that&apos;s actually quite rare in games. Wording and the meanings of words very rarely matter in
					game design because you generally need conversations to be predictable to avoid frustrating the
					player. Riddles give you a wordplay puzzle that can be delivered in enough of a set-piece way that
					they are less likely to cause such a problem.
				</p>

				<p>
					The places to use riddles in a plot-relevant way vary, but they tend to be linked to either a
					threat, an interaction, or a clue. The riddle of the sphinx mentioned earlier, or the famous
					&quot;Riddles in the Dark&quot; chapter of The Hobbit, are examples of threat-riddle situations: in
					them, the answer must be found in order to prevent a negative action. Enemies of various sorts may
					&quot;test&quot; protagonists with riddles, or simply keep them talking as a form of amusement, with
					a slanted power dynamic adding a sense of urgency to finding the answer. Interactions meanwhile are
					a case of solving a riddle to gain a positive interaction: the riddle may be being used by a
					character to test your mental acuity, or it may be a &quot;password reminder&quot; as some sort of
					security mechanism. In my own game Adventures of Soros, one mission ends with a magic door that
					rather than having a lock instead asks you a series of riddles which will, if answered, allow you to
					retrieve an artefact; another example would be the old UK folk song Captain Wedderburn, in which a
					maiden requires the eponymous character to answer a series of riddles before she will marry him.
					Finally, riddles can simply give you the clue into some larger puzzle. Say you&apos;re a game
					developer and want to direct the player to find a certain item or go to a certain place - rather
					than giving it to them on a plate, you could encode key information in a riddle. Say my character is
					in a farmhouse and I need them to specifically look in the basket of eggs - rather than making the
					egg basket really obvious in writing or images, having someone leave the classic riddle{' '}
					<em>what has no hinges, key or lid, but inside golden treasure&apos;s hid</em> as a clue for them
					would give another way of framing the challenge that might be more satisfying when completed.
					Finally, it&apos;s worth noting that riddles certainly don&apos;t have to be plot-relevant; playing
					riddle-games for fun is a very reasonable thing for characters to do!
				</p>

				<p>
					Riddles seem to be common in fantasy settings, but less so in others, which I think is an area where
					there&apos;s perhaps a gap to be filled. The traditional rhyme-and-verse form of many riddles
					perhaps feels antiquated compared to the feel people want in, say, sci-fi settings, but I don&apos;t
					see why futuristic cultures shouldn&apos;t have plenty of riddles of their own. There&apos;s
					certainly a knack to avoiding riddles feeling contrived, and perhaps the limited use of them in
					modern culture makes it harder for them to feel a natural part of a setting, but I think one can lay
					the foundations for &quot;this is a culture that does riddles&quot; quite easily if that&apos;s
					necessary to set up the opportunities, and in general I think there&apos;s a strong pay-off for
					people interacting with your work in having access to this sort of puzzle.
				</p>
			</article>

			<RelatedResources excludePage="using-riddles" />
		</div>
	)
}
