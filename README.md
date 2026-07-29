# Riddonkulous Web

r/riddonkulous

# docker

docker build -t riddonkulous-web .
docker run -p 1233:1233 riddonkulous-web

# compose

docker-compose up --build
docker-compose up -d -p 1233:1233

# Traefik access logs (host Traefik, not this compose file)
# Enable access logs with client IP, path, status, UA on the Traefik host.
# After a Plausible traffic spike, inspect burstable crawl IPs, e.g.:
#   grep -E '/riddles|/riddle/' /var/log/traefik/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head
# Confirm rate-limit 429s from the riddonkulous-ratelimit middleware.

### Google Adsense Review To-Do's

- Opt-Out in Privacy Policy (Update Privacy Policy immediately: Add the "Google AdSense Cookie" and "Personalized Advertising" clauses. (Google provides a template for this).)
  : 1. Privacy Policy Review (Critical Fixes Needed)
  The current Privacy Policy is well-written for general use, but it does not meet the specific legal requirements that Google AdSense mandates for its publishers.

Missing AdSense Clause: You must explicitly state that Google uses cookies to serve ads based on a user's prior visits to your website or other websites.

Missing DART Cookie Info: You need to mention that Google’s use of advertising cookies enables it and its partners to serve ads to your users.

Missing Opt-Out Link: You must provide a link where users can opt out of personalized advertising (e.g., www.aboutads.info).

Third-Party Disclosure: While you mention Plausible and Google Sign-In, you must explicitly mention "third-party vendors, including Google" as ad providers.

- Add About-Us page (/about, /about-us): Create a dedicated "About Us" page. Currently, your site feels like a high-quality app, but Google wants to see the "Entity" behind it. Explain that "Hammertime e.U." is a real studio focused on educational gaming.
- Articles Count: Increase Article Count: While you have some great long-form articles, AdSense usually prefers 10–15 of these "High Value" blog posts. Try to add 5 more articles about the "Benefits of Riddles for Brain Health" or "How to Solve Lateral Thinking Puzzles."
- Remove Politics: Your "Politics" category (88 riddles) is a potential red flag.
- Category Explanation Riddle Categories: The Strategy: Ensure your homepage and category pages (Wordplay, Logic, etc.) have at least 200–300 words of introductory text explaining that category. Your "Riddles in History" and "Community Interview" posts should be featured prominently to prove the site has "high-value" editorial content.

## Discord

https://discord.com/api/oauth2/authorize?client_id=1454040384312184836&permissions=68608&scope=bot%20applications.commands
