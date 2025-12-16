import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Privacy Policy | Riddonkulous',
	description: 'Privacy Policy for Riddonkulous - Learn how we collect, use, and protect your personal information.',
	openGraph: {
		title: 'Privacy Policy | Riddonkulous',
		description:
			'Privacy Policy for Riddonkulous - Learn how we collect, use, and protect your personal information.',
		url: 'https://riddonkulous.com/privacy-policy',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Privacy Policy | Riddonkulous',
		description: 'Privacy Policy for Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/privacy-policy',
	},
}

export default function PrivacyPolicyPage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Privacy Policy</h1>

				<div className="prose prose-invert max-w-none">
					<p className="text-white/70 mb-4">Last updated: December 2025</p>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Introduction</h2>
						<p className="text-white/80 mb-4">
							In the digital world, data plays a crucial role in the operation and enhancement of online
							services, including ours. Recognizing this, we aim to strike a balance between necessary
							data collection for service improvement and our users&apos; right to privacy.
						</p>
						<p className="text-white/80 mb-4">
							<strong>Our Commitment to Data Collection and Privacy:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								Like any online service, we collect data that is essential for delivering and improving
								our services. Our goal is to enhance user experience while minimizing data collection to
								what is strictly necessary.
							</li>
							<li>
								We are committed to respecting your privacy. Therefore, we do not collect data that
								falls into special or sensitive categories, such as racial or ethnic origins, political
								opinions, or religious beliefs. Your personal and sensitive information is your own, and
								we aim to keep it that way.
							</li>
							<li>
								Protecting the privacy of younger users is especially important to us. We do not
								knowingly collect any personal information from minors who fall under certain age
								categories, adhering to the strictest data protection laws.
							</li>
						</ul>
						<p className="text-white/80 mb-4">
							Transparency is the cornerstone of trust. We understand the importance of clear
							communication about our data handling practices. Should you have any inquiries or concerns
							regarding our approach to privacy and data collection, we encourage you to reach out to us
							via{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Collection</h2>
						<p className="text-white/80 mb-4">
							Riddonkulous does not knowingly collect sensitive user data. We only store data necessary to
							maintain the platform&apos;s functionality and provide you with our services.
						</p>
						<p className="text-white/80 mb-4">The data we collect includes:</p>

						<h3 className="text-xl mb-3 text-white mt-6">Account Information</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Email address</strong> - Collected when you create an account through Google
								Sign-In (OAuth 2.0)
							</li>
							<li>
								<strong>Google Sub ID</strong> - A unique identifier provided by Google for account
								authentication
							</li>
							<li>
								<strong>Account Creation and Update Timestamps</strong> - For account management and
								audit purposes
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">User-Generated Content</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Riddles</strong> - Word, riddle text, background information, and explanations
								you submit
							</li>
							<li>
								<strong>Riddle Metadata</strong> - Tags (including AI-generated tags), status
								(IN_REVIEW, APPROVED, REJECTED, REMOVED), engagement metrics (scores, guess counts)
							</li>
							<li>
								<strong>Content Status</strong> - Moderation status assigned through automated AI
								evaluation or manual review
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Authentication and Session Data</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Session Tokens</strong> - Encrypted session identifiers stored in HTTP-only
								cookies (`session_riddonk`)
							</li>
							<li>
								<strong>Authentication Tokens</strong> - OAuth tokens from Google Sign-In for account
								verification
							</li>
							<li>
								<strong>IP Addresses</strong> - Collected for rate limiting, security, and abuse
								prevention (not stored long-term)
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Usage and Engagement Data</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Riddle Engagement Metrics</strong> - Score, guess count, correct guess count,
								give-up count, solve status
							</li>
							<li>
								<strong>Popularity Scores</strong> - Calculated metrics based on engagement data
							</li>
							<li>
								<strong>Platform Activity</strong> - Riddle creation timestamps, modification dates,
								user interactions
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Analytics Data</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Usage Analytics</strong> - Through Plausible Analytics, which is GDPR compliant
								and does not collect personally identifiable information
							</li>
							<li>
								<strong>Rate Limiting Data</strong> - Temporary tracking of request frequency per user
								ID for abuse prevention (1 riddle per minute limit)
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">AI and Machine Learning Usage</h2>

						<h3 className="text-xl mb-3 text-white mt-6">Content Moderation</h3>
						<p className="text-white/80 mb-4">
							We use <strong>AI-powered content evaluation</strong> to automatically assess user-submitted
							riddles for content safety and quality. This AI evaluation helps us:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Automated Content Review</strong> - New riddles are automatically assessed for
								appropriateness, safety, and quality
							</li>
							<li>
								<strong>Status Assignment</strong> - Riddles are automatically assigned a status
								(APPROVED or IN_REVIEW) based on AI evaluation
							</li>
							<li>
								<strong>Content Safety</strong> - AI checks for explicit content, hate speech, spam, and
								other policy violations
							</li>
							<li>
								<strong>Quality Assessment</strong> - AI evaluates riddle coherence, relevance, and
								adherence to platform guidelines
							</li>
						</ul>

						<p className="text-white/80 mb-4">
							<strong>What data is sent to AI services:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Riddle word (solution)</li>
							<li>Riddle text</li>
							<li>Background information (if provided)</li>
							<li>Explanation (if provided)</li>
						</ul>

						<p className="text-white/80 mb-4">
							<strong>What is NOT sent to AI services:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>User email addresses</li>
							<li>User IDs or usernames</li>
							<li>Session tokens or authentication data</li>
							<li>Personal information beyond the riddle content itself</li>
						</ul>

						<p className="text-white/80 mb-4">
							<strong>Data Processing:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Riddle content is sent to AI service providers for evaluation</li>
							<li>
								AI providers process this data according to their privacy policy and terms of service
							</li>
							<li>Evaluation results (status: APPROVED or IN_REVIEW) are stored in our database</li>
							<li>No personal user information is included in AI evaluation requests</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">AI Tag Generation</h3>
						<p className="text-white/80 mb-4">
							We use <strong>AI-powered tag generation</strong> to automatically generate relevant tags
							for riddles:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Tag Assignment</strong> - AI analyzes riddle content and assigns 2-5 relevant
								tags from our available tag database
							</li>
							<li>
								<strong>Content Analysis</strong> - Only riddle word and text are sent to AI services
								for tag generation
							</li>
							<li>
								<strong>Tag Validation</strong> - Generated tags are validated against our tag database
								before assignment
							</li>
						</ul>

						<p className="text-white/80 mb-4">
							<strong>Data Processing:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Only riddle word and text are sent to AI services</li>
							<li>No user identifiers or personal information are included</li>
							<li>Tags are stored in our database and associated with the riddle</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">AI Riddle Generation (Platform Features)</h3>
						<p className="text-white/80 mb-4">
							We use <strong>AI-powered content generation</strong> for platform features such as:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Daily riddle generation</li>
							<li>Theme-based riddle creation</li>
							<li>Hint generation</li>
							<li>User-requested riddle creation</li>
						</ul>
						<p className="text-white/80 mb-4">
							These features use AI-generated content for platform enhancement and do not involve user
							data beyond the riddle content itself.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Use</h2>
						<p className="text-white/80 mb-4">
							At Hammertime e.U., the data we collect is used with a singular focus: to effectively
							operate and enhance Riddonkulous, its functionalities, and features.
						</p>

						<p className="text-white/80 mb-4">
							<strong>Primary Uses:</strong>
						</p>
						<ol className="list-decimal list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Service Delivery</strong> - To provide and maintain the riddle platform
								functionality
							</li>
							<li>
								<strong>User Authentication</strong> - To verify user identity and manage account access
							</li>
							<li>
								<strong>Content Moderation</strong> - To ensure platform safety and content quality
								through AI and manual review
							</li>
							<li>
								<strong>Platform Improvement</strong> - To analyze usage patterns and enhance user
								experience
							</li>
							<li>
								<strong>Abuse Prevention</strong> - Rate limiting and security measures to prevent spam
								and abuse
							</li>
							<li>
								<strong>Content Organization</strong> - Tag generation and categorization for better
								content discovery
							</li>
							<li>
								<strong>Engagement Tracking</strong> - To measure riddle popularity and user engagement
							</li>
						</ol>

						<p className="text-white/80 mb-4">
							<strong>AI Processing Uses:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Automated Moderation</strong> - Evaluating user-submitted content for safety and
								quality
							</li>
							<li>
								<strong>Content Enhancement</strong> - Generating tags and metadata to improve content
								discoverability
							</li>
							<li>
								<strong>Platform Features</strong> - Creating daily riddles, themed content, and hints
							</li>
						</ul>

						<p className="text-white/80 mb-4">
							The use of this data is conducted with the utmost respect for privacy, strictly adhering to
							our principles of transparency and responsibility.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Sharing</h2>
						<p className="text-white/80 mb-4">
							Our approach to data sharing is guided by the principles of minimal necessity and
							transparency. Riddonkulous does not sell, rent, or trade user data with third parties.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Third-Party Services We Use:</h3>

						<h4 className="text-lg mb-2 text-white mt-4">AI Service Providers</h4>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Purpose:</strong> Content moderation, tag generation, and platform feature
								enhancement
							</li>
							<li>
								<strong>Data Shared:</strong> Riddle content (word, text, background, explanation) - NO
								personal user information
							</li>
							<li>
								<strong>Privacy:</strong> AI providers process data according to their privacy policies
								and terms of service
							</li>
						</ul>

						<h4 className="text-lg mb-2 text-white mt-4">Google (Authentication)</h4>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Purpose:</strong> User authentication via Google Sign-In (OAuth 2.0)
							</li>
							<li>
								<strong>Data Shared:</strong> Email address, Google Sub ID (for account creation and
								authentication)
							</li>
							<li>
								<strong>Privacy:</strong> Google processes authentication data according to their
								privacy policy
							</li>
							<li>
								<strong>Scope:</strong> Limited to authentication purposes only
							</li>
						</ul>

						<h4 className="text-lg mb-2 text-white mt-4">Plausible Analytics</h4>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Purpose:</strong> Website usage analytics and traffic analysis
							</li>
							<li>
								<strong>Data Shared:</strong> Aggregated, anonymized usage statistics
							</li>
							<li>
								<strong>Privacy:</strong> GDPR compliant, no personally identifiable information
								collected, no cookies used
							</li>
							<li>
								<strong>Privacy Policy:</strong>{' '}
								<a
									href="https://plausible.io/privacy"
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-primary"
								>
									https://plausible.io/privacy
								</a>
							</li>
						</ul>

						<h4 className="text-lg mb-2 text-white mt-4">Database Hosting</h4>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Purpose:</strong> Data storage and persistence
							</li>
							<li>
								<strong>Data Stored:</strong> All user data, riddles, and platform content
							</li>
							<li>
								<strong>Privacy:</strong> Data is stored securely according to industry-standard
								security practices
							</li>
						</ul>

						<p className="text-white/80 mb-4">
							<strong>Data Sharing Scenarios:</strong>
						</p>
						<p className="text-white/80 mb-4">
							Data sharing is strictly limited to scenarios essential for:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Providing and improving our services</li>
							<li>Complying with legal obligations</li>
							<li>Enhancing the user experience through AI-powered features</li>
							<li>Maintaining platform security and preventing abuse</li>
						</ul>

						<p className="text-white/80 mb-4">
							Our priority is to ensure the integrity and confidentiality of your data while maintaining
							the trust you place in us.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Analytics</h2>
						<p className="text-white/80 mb-4">
							We use <strong>Plausible Analytics</strong>, a privacy-friendly analytics service that is
							GDPR compliant. Plausible does not collect personally identifiable information and does not
							use cookies. The analytics data helps us understand how our platform is used so we can
							improve the user experience.
						</p>

						<p className="text-white/80 mb-4">
							<strong>What We Track:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Page views and navigation patterns</li>
							<li>Referral sources</li>
							<li>Device types and browsers (anonymized)</li>
							<li>General usage statistics</li>
						</ul>

						<p className="text-white/80 mb-4">
							<strong>What We Don&apos;t Track:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Individual user behavior</li>
							<li>Personal identifiers</li>
							<li>Cross-site tracking</li>
							<li>Cookie-based tracking</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Rate Limiting and Usage Tracking</h2>
						<p className="text-white/80 mb-4">
							To prevent abuse and ensure fair platform usage, we implement rate limiting:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Riddle Creation:</strong> Limited to 1 riddle per minute per user
							</li>
							<li>
								<strong>Tracking Method:</strong> Rate limits are tracked by user ID (not IP address)
								for authenticated users
							</li>
							<li>
								<strong>Data Retention:</strong> Rate limit data is temporary and not stored permanently
							</li>
							<li>
								<strong>Purpose:</strong> Abuse prevention and platform stability
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Content Moderation and Status Tracking</h2>

						<h3 className="text-xl mb-3 text-white mt-6">Automated Moderation Process:</h3>
						<ol className="list-decimal list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>AI Evaluation</strong> - New riddles are automatically evaluated by AI-powered
								systems
							</li>
							<li>
								<strong>Status Assignment</strong> - Riddles receive an initial status:
								<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
									<li>
										<strong>APPROVED</strong> - Content is safe, appropriate, and meets quality
										standards (automatically visible)
									</li>
									<li>
										<strong>IN_REVIEW</strong> - Content needs human review (hidden from public
										until approved)
									</li>
								</ul>
							</li>
							<li>
								<strong>Manual Review</strong> - Moderators and admins can review IN_REVIEW riddles and
								change status
							</li>
							<li>
								<strong>Status Tracking</strong> - All status changes are logged with timestamps
							</li>
						</ol>

						<h3 className="text-xl mb-3 text-white mt-6">Status Types:</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>IN_REVIEW</strong> - Awaiting moderator review
							</li>
							<li>
								<strong>APPROVED</strong> - Visible to all users
							</li>
							<li>
								<strong>REJECTED</strong> - Rejected by moderator (visible only to author)
							</li>
							<li>
								<strong>REMOVED</strong> - Removed after approval (visible only to author)
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Data Associated with Moderation:</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Riddle content and metadata</li>
							<li>Status history (current status only, not full audit trail)</li>
							<li>Moderator actions (for admin/moderator accounts)</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Retention</h2>

						<h3 className="text-xl mb-3 text-white mt-6">Account Data:</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Active Accounts:</strong> Retained while your account is active
							</li>
							<li>
								<strong>Deleted Accounts:</strong> Account data is deleted upon account deletion,
								except:
								<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
									<li>
										Riddles you created remain on the platform (associated with your username if
										provided)
									</li>
									<li>Engagement data (scores, guesses) remains for platform analytics</li>
								</ul>
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Riddle Content:</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Published Riddles:</strong> Retained indefinitely for platform content
							</li>
							<li>
								<strong>Rejected/Removed Riddles:</strong> Retained but hidden from public view
							</li>
							<li>
								<strong>Author Association:</strong> Riddles remain associated with your username even
								after account deletion
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Session Data:</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Active Sessions:</strong> Stored while session is valid
							</li>
							<li>
								<strong>Expired Sessions:</strong> Automatically deleted upon expiration
							</li>
							<li>
								<strong>Session Tokens:</strong> Stored in HTTP-only cookies, expire according to
								session policy
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Analytics Data:</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Plausible Analytics:</strong> Retained according to Plausible&apos;s data
								retention policy
							</li>
							<li>
								<strong>Aggregated Metrics:</strong> Retained for platform improvement purposes
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Children&apos;s Privacy</h2>
						<p className="text-white/80 mb-4">
							Our Service does not knowingly collect, use, or disclose personal information from children
							under the age of 13 (or a higher age threshold as required by local laws) without prior
							parental consent or as otherwise permitted by law.
						</p>

						<p className="text-white/80 mb-4">
							<strong>Age Restrictions:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								We require users to be at least 13 years old (or the age of majority in their
								jurisdiction)
							</li>
							<li>Google Sign-In requires users to meet Google&apos;s age requirements</li>
							<li>We do not collect age verification data beyond what Google provides</li>
						</ul>

						<p className="text-white/80 mb-4">
							If we become aware that we have collected personal information from a child without verified
							parental consent, we will take prompt action to delete that information.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Your Rights</h2>
						<p className="text-white/80 mb-4">You have the right to:</p>

						<h3 className="text-xl mb-3 text-white mt-6">Data Access</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Access your personal information</strong> - View your account data, email,
								username, and role
							</li>
							<li>
								<strong>Access your content</strong> - View all riddles you&apos;ve created, including
								their status
							</li>
							<li>
								<strong>Request a copy of your data</strong> - Receive an export of your account data
								and riddles
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Data Management</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Update your personal information</strong> - Change your username and email (via
								Google account)
							</li>
							<li>
								<strong>Delete your account</strong> - Remove your account and associated data (note:
								riddles remain on platform)
							</li>
							<li>
								<strong>View your riddles</strong> - Access all your riddles regardless of moderation
								status
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Data Control</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Opt-out of certain data collection</strong> - While some data collection is
								necessary for service functionality, you can:
								<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
									<li>Delete your account to stop data collection</li>
									<li>Request data deletion (subject to platform content retention policies)</li>
								</ul>
							</li>
							<li>
								<strong>Moderation Transparency</strong> - View the status of your riddles and
								understand moderation decisions
							</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Account Deletion</h3>
						<p className="text-white/80 mb-4">When you delete your account:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Your account information (email, username, role) is deleted</li>
							<li>Your session tokens are invalidated</li>
							<li>Your riddles remain on the platform (associated with your username if provided)</li>
							<li>Engagement data (scores, guesses) remains for platform analytics</li>
							<li>Admin accounts cannot be deleted (for security reasons)</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Security</h2>
						<p className="text-white/80 mb-4">
							We implement appropriate technical and organizational measures to protect your personal
							information:
						</p>

						<p className="text-white/80 mb-4">
							<strong>Security Measures:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Encrypted Sessions</strong> - Session tokens stored in HTTP-only, secure cookies
							</li>
							<li>
								<strong>OAuth Authentication</strong> - Secure authentication through Google Sign-In
							</li>
							<li>
								<strong>Database Security</strong> - Databases secured with access controls
							</li>
							<li>
								<strong>Rate Limiting</strong> - Protection against abuse and DDoS attacks
							</li>
							<li>
								<strong>Input Validation</strong> - All user inputs are validated and sanitized
							</li>
							<li>
								<strong>Secure API Endpoints</strong> - Authentication required for sensitive operations
							</li>
						</ul>

						<p className="text-white/80 mb-4">
							<strong>Data Transmission:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>HTTPS Encryption</strong> - All data transmission uses encrypted HTTPS
								connections
							</li>
							<li>
								<strong>Secure Cookies</strong> - Session cookies use secure flags in production
							</li>
							<li>
								<strong>API Security</strong> - Protected endpoints require authentication tokens
							</li>
						</ul>

						<p className="text-white/80 mb-4">
							However, no method of transmission over the Internet or electronic storage is 100% secure.
							While we strive to use commercially acceptable means to protect your personal information,
							we cannot guarantee absolute security.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">International Data Transfers</h2>
						<p className="text-white/80 mb-4">
							Your data may be transferred to and processed in countries other than your country of
							residence:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>AI Service Providers</strong> - Data may be processed in various jurisdictions
								where AI providers operate
							</li>
							<li>
								<strong>Google</strong> - Authentication data processed according to Google&apos;s
								global infrastructure
							</li>
							<li>
								<strong>Database Hosting</strong> - Database hosting location as specified in our
								configuration
							</li>
							<li>
								<strong>Plausible Analytics</strong> - Analytics data processed in EU-compliant
								infrastructure
							</li>
						</ul>
						<p className="text-white/80 mb-4">
							We ensure that appropriate safeguards are in place for international data transfers in
							accordance with applicable data protection laws.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Changes to This Privacy Policy</h2>
						<p className="text-white/80 mb-4">
							We reserve the right to update or modify this Privacy Policy at any time and for any reason,
							without prior notice.
						</p>
						<p className="text-white/80 mb-4">
							Any changes to our Privacy Policy will become effective upon updating the revised policy on
							this page. We encourage you to periodically review this page to stay informed about our
							privacy practices.
						</p>
						<p className="text-white/80 mb-4">
							<strong>Last Updated:</strong> December 2025
						</p>
						<p className="text-white/80 mb-4">
							Your continued use of the Service following any changes or revisions to this Privacy Policy
							signifies your agreement to the updated terms.
						</p>
						<p className="text-white/80 mb-4">
							If you do not agree with the revised Privacy Policy, you should discontinue use of the
							Service immediately.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Contact Us</h2>
						<p className="text-white/80 mb-4">
							If you have questions about this Privacy Policy, please contact us at{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Data Protection Inquiries:</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Account Data Access:</strong> Request your account data export
							</li>
							<li>
								<strong>Account Deletion:</strong> Request account deletion
							</li>
							<li>
								<strong>Privacy Concerns:</strong> Questions about data collection and usage
							</li>
							<li>
								<strong>Moderation Questions:</strong> Inquiries about content moderation process
							</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	)
}
