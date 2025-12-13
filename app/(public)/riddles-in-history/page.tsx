import { RelatedResources } from '@/app/components/articles/RelatedResources'
import type { Metadata } from 'next'
import Image from 'next/image'

export const dynamic = 'force-static'

export const metadata: Metadata = {
	title: 'Riddles in History | Riddonkulous',
	description: 'Discover how riddles have shaped cultures and civilizations throughout human history.',
}

export default function RiddlesInHistory() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col max-w-4xl mx-auto px-4 py-8 gap-8">
			<h1 className="text-3xl md:text-4xl text-center mb-4">Riddles in History</h1>

			{/* Image Block */}
			<div className="w-full flex justify-center mb-8">
				<Image
					src="/pals/PAL044.gif"
					alt="Frog Magician"
					width={200}
					height={200}
					className="w-48 h-48 md:w-64 md:h-64"
				/>
			</div>

			{/* Content Blocks */}
			<article className="w-full flex flex-col gap-6 text-base md:text-lg leading-relaxed">
				<p>
					The history of riddles is long and deserves far more words than I&apos;m going to put down here, but
					no introductory article on riddles would be complete without covering it to some extent. Riddles go
					back to some of the oldest written cultures - our oldest riddles are Babylonian era and have sadly
					long since lost their answers. One of the most famous riddles to this day is the Riddle of the
					Sphinx: what walks on four legs in the morning, two at noon, and three in the evening? The answer is
					a human: crawling as a baby, standing in their prime, then walking with a stick in old age (though
					one seventeenth century luminary did valiantly attempt to argue for &quot;the philosopher&apos;s
					stone&quot; as an alternative answer!) The association of riddles with the sphinx, and the myth of
					the sphinx killing those who could not answer, may have been a factor in associations between
					riddles and danger that later found their way into modern works of fantasy.
				</p>

				<p>
					Moving into the post-Classical era, the Saxons were also lovers of riddles, which probably also
					shapes their modern associations with a historic world of fireside storytelling. Saxon riddles often
					had two answers, with a simple &quot;correct&quot; answer lying underneath a heavy double-entendre.
					Take a look at this one:
				</p>

				{/* Quote Block */}
				<blockquote className="border-l-4 border-primary pl-6 py-4 my-4 italic bg-gray-900 rounded-r-lg">
					<p className="mb-2">
						I heard there&apos;s something growing in its nook, swelling, rising, and expanding, pushing
						against its covering. I heard a cocky-minded young woman took that boneless thing in her hands,
						covered its tumescence with a soft cloth.
					</p>
				</blockquote>

				<p>
					Anyone who guessed &quot;dough rising&quot; - congratulations, that&apos;s the right answer. Though
					you&apos;d be forgiven for certain other guesses! You&apos;ll also note that this is a lot longer
					than some of the other riddles we&apos;re discussing. It&apos;s actually quite short by the
					standards of Saxon riddles, which often tended to be long and discursive and include many obliquely
					described aspects of the creation or manufacture of common items. The focus on common items is an
					important aspect of riddles; whatever a riddle is about needs to be something that the audience will
					reliably latch onto, so it needs to be an item or concept that will not only be easily recognisable
					to the reader but of which the details needed to get the riddle will also be known. The modern
					riddle <em>I take what you receive, but surrender it by raising my flag</em>, for example, is very
					hard for many Europeans to get as it relies on the reader being familiar with the style of outdoor
					mailbox common in the US that raises a side-lever (the flag) when it opens.
				</p>

				<p>
					It&apos;s worth thinking about the functions of riddles in past societies and cultures. Whilst they
					tend to universally be something of a game, the associations in different cultures about what
					function that game had and when it was played are pretty variable. Many societies seem to have had
					direct riddle contests as a sort of intellectual sport, probably including at symposia parties in
					the ancient Greek world but also in many cultures since. Longer riddles like those of the Saxons
					could be used as a framed way of discussing or presenting information more generally; a longer
					riddle that goes right through the production process for a certain item can give room for
					additional useful information to be added. Riddles could be put to innovative uses, too. In 12th
					Armenia, the Catholicos Nerses Shnorhali used riddles as a religious teaching tool, creating a wide
					variety of riddles with biblical references as a way of getting his flock engaged with the texts he
					wanted them to read. This is an interesting reverse of the problem of the reader needing cultural
					familiarity - using a riddle as a tool to create or provoke cultural familiarity by needing the
					reader to know the text to find the answers.
				</p>

				<p>
					It would be wrong to leave this section simply looking at western examples though. Riddles are a
					worldwide phenomenon, and have been attested from around Africa, across Asia, and into the Americas,
					though our knowledge of traditional native American riddles is comparatively patchy. The following:{' '}
					<em>Riddle, riddle, I&apos;m no priest or king, but I&apos;ve clothes as fine as anything</em> is a
					rough translation of a Bugtong, a Filipino riddle - the answer is a washing line. The bugtong is
					apparently usually used as a game at a funeral wake, giving yet another context and association for
					riddling. Chinese riddles are also numerous - they have a range of visual options for puns thanks to
					the diversity and complexity of Chinese characters which are unavailable in many simpler alphabet
					systems. Chinese riddles were mostly collected in the modern era; the survival of older riddles from
					many cultures is likely to have varied depending on how literary the cultures were and whether
					riddles were considered a folk game unworthy of higher study, or a worthy literary pursuit.
				</p>
			</article>

			<RelatedResources excludePage="riddles-in-history" />
		</div>
	)
}
