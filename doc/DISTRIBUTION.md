# Distribution Guide for Web Apps

> Reusable checklist for launching and distributing indie web apps.
> Based on FacturaView's launch (February 2026).

---

## Phase 1: Software Directories

### AlternativeTo
- **URL:** https://alternativeto.net/contribute/new/
- **What you need:**
  - Name, short description (1 sentence), full description
  - Website URL
  - Supported languages
  - Pricing (Free / Freemium / Paid)
  - Tags (up to ~15): pick the most specific ones
  - Screenshots (3-5 recommended)
- **Tips:**
  - Highlight differentiators vs existing tools (no signup, free, privacy, etc.)
  - Don't force "alternatives to" if no matching apps exist on the platform
  - Approval takes hours to days — you'll get an email
- **Warning:** AlternativeTo rejects apps that are too niche or region-specific (e.g., FacturaView was rejected for being specific to Spanish invoices). They also reject simple converters, viewers, formatters, generators, and similar utility tools. If your app targets a narrow audience or falls in those categories, skip this platform.
- **Time:** ~30 min

### Product Hunt
- **URL:** https://www.producthunt.com/posts/new
- **What you need:**
  - Product name
  - Tagline (max 60 chars)
  - Description (max 500 chars)
  - Thumbnail (square icon)
  - Gallery images (3-5 screenshots)
  - Launch tags (3 from their list)
  - First comment (as maker — explain the why, be genuine)
  - Shoutouts (tools you used to build it — optional but recommended)
  - Product categories (up to 3, with sub-categories)
  - Maker bio: headline (max 40 chars) + about
- **Tips:**
  - Best launch days: Tuesday or Wednesday
  - Schedule for 00:01 PT to compete from the start of the day
  - Shoutouts give you backlinks from the shoutout product's page
  - You can edit your post even after creating the draft
  - "Strongly Recommended" items (video, additional makers) are optional
- **Time:** ~45 min

### Secondary Directories
- **Peerlist:** https://peerlist.io — developer-focused, good for portfolio
- **DevHunt:** https://devhunt.org — dev tools directory
- **BetaList:** https://betalist.com — for early-stage products

---

## Phase 2: Tech Communities

### Hacker News (Show HN)
- **URL:** https://news.ycombinator.com/submit
- **Title format:** `Show HN: [Name] – [What it does in one line]`
- **Title limit:** 80 characters
- **Body:** 3-4 short paragraphs:
  1. The problem (why this exists)
  2. What it does (features, how it works)
  3. Privacy/technical angle (HN values this)
  4. Tech stack + test count (shows rigor)
- **Tips:**
  - Be honest and technical — HN hates marketing speak
  - Respond to every comment quickly on launch day
  - Best times: weekday mornings US time (14:00-16:00 CET)

### Reddit
- **r/SideProject** — short post, show what you built
- **r/spain or r/es** — post in Spanish, explain the local problem
- **Subreddits for your niche** — find 2-3 relevant subs
- **Tips:**
  - Don't be salesy — explain the problem you solved
  - Engage in comments
  - Each subreddit has its own rules — read them first
- **Warning:** Reddit has aggressive anti-self-promotion filters. Posts may be auto-removed even in subreddits that allow project sharing. Don't spend too much time here if blocked.

### Indie Hackers
- **URL:** https://www.indiehackers.com
- **Format:** project page + community post
- **Tips:**
  - Share the journey, not just the product
  - Revenue/metrics transparency is valued even if it's $0
- **Warning:** Best suited for products with a monetization path. If your tool is free and niche, the audience (other makers) is not your target user — consider skipping.

---

## Phase 3: Niche Communities

Find communities where your target users hang out. For FacturaView (Spanish freelancers):

- **Rankia Autónomos** (https://www.rankia.com/foro/autonomos) — 27,500+ subscribers, largest Spanish freelancer forum
- **Área de Pymes** (https://foros.areadepymes.com/) — invoicing, Verifactu, tax sections
- **Mundo Autónomos** (https://mundoautonomos.org/forums/) — invoicing, VAT, tax office
- **Facebook groups** — search for groups of your target audience
- **LinkedIn company page** — create a separate company page for your indie projects to avoid cluttering your personal profile with self-promotion. Post from there and share occasionally from your personal profile.

### Tips for niche communities:
- Write in the community's language
- Be genuine: "I built this free tool because I had this problem"
- Don't spam — one thoughtful post per community
- Answer questions and take feedback seriously

---

## Phase 4: Measure & Decide

Wait 4-6 weeks after distribution, then review:

- **Google Search Console** — impressions, clicks, keywords
- **Analytics** (Umami, Plausible, etc.) — events, visitors, traffic sources
- **Feedback channels** — contact form messages, comments, emails

### Decisions based on data:
- More SEO content? (if organic traffic signals exist)
- New features? (if users request something specific)
- Which channels worked? (double down on those)
- Drop channels that produced nothing

---

## Checklist Template

Copy and adapt for your project:

```markdown
### Directories
- [ ] AlternativeTo
- [ ] Product Hunt (schedule for Tue/Wed)
- [ ] Peerlist
- [ ] DevHunt
- [ ] BetaList

### Tech Communities
- [ ] Hacker News (Show HN)
- [ ] Reddit r/SideProject
- [ ] Reddit (niche subs)
- [ ] Indie Hackers

### Niche Communities
- [ ] Forum 1: ___
- [ ] Forum 2: ___
- [ ] Facebook groups: ___
- [ ] LinkedIn post + groups

### Measure (after 4-6 weeks)
- [ ] Review analytics
- [ ] Review feedback
- [ ] Decide next steps
```

---

## Content Templates

### Short description (1 sentence)
> [Name] lets [audience] [do what] — [key differentiator].

### Full description (~500 chars)
> [Name] lets [audience] [do what]. [Problem context — why existing solutions suck]. [How it works — 1-2 sentences]. [Key features — 2-3 bullet points as prose]. [Privacy/trust angle]. [Platforms/languages].

### Show HN body
> [Problem paragraph]. [Solution paragraph]. [Technical details]. [Stack + tests].

### Community post (genuine tone)
> I built [name] because [personal frustration]. [What it does]. [It's free and your data stays private]. [Link]. Would love feedback!