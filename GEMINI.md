# Korean Skin Food — Project Instructions

This document provides foundational guidance for AI assistants and developers working on the Korean Skin Food project. It complements the more detailed [MASTER_AI_AGENT.md](./.agents/MASTER_AI_AGENT.md), which serves as the production-grade source of truth for architecture and system logic.

## 🚀 Project Overview
Korean Skin Food is a premium e-commerce platform specializing in K-beauty products for the Bangladesh market. It features a mobile-first PWA frontend, an AI-powered customer assistant (Sabiha), and a comprehensive admin command center.

## 🛠 Tech Stack
- **Frontend:** React 19 + Vite 6 + TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Backend:** Node.js (Express) proxying to Google Apps Script REST API
- **Database:** Google Sheets (via Apps Script)
- **AI:** Google Gemini API (1.5-flash / 2.0-flash)
- **Hosting:** Firebase Hosting (Primary) / Netlify (Secondary)
- **State Management:** Context API + TanStack Query

## 🏛 Architecture & Patterns
- **SPA Mandatory:** Built as a Single Page Application using React Router DOM.
- **Backend Proxy:** The local `server.ts` proxies requests to the Google Apps Script backend to handle CORS and sensitive logic.
- **Mobile-First Design:** All UI components must prioritize mobile viewports (375px+).
- **Bangla-First UX:** The public chatbot (Sabiha) and customer-facing interactions must use Bangla by default.
- **Role-Based Access:** Admin routes (`/admin/*`) require authentication and role verification.

## 📋 Critical Directives
- **Production-Ready Code:** No placeholders, TODOs, or fake data in production-bound code.
- **Security:** API keys must only reside in `.env` files. Never commit secrets.
- **No Full Page Reloads:** Always use React Router for navigation.
- **Consistent Styling:** Adhere to the defined K-beauty aesthetic (Hot Pink `--primary: #E91E8C`, soft shadows, rounded corners).

## 📂 Key Resources
- **Detailed System Specs:** [.agents/MASTER_AI_AGENT.md](./.agents/MASTER_AI_AGENT.md)
- **Agent Rules:** [.agents/rules/core-agent-rules.md](./.agents/rules/core-agent-rules.md)
- **Workflow Guide:** [.agents/workflows/agent-workflow.md](./.agents/workflows/agent-workflow.md)

## 🔄 Common Workflows
- **Running Locally:** `npm run dev` (Starts Express server + Vite middleware)
- **Building for Production:** `npm run build`
- **Linting:** `npm run lint` (Type checks with `tsc`)

Refer to `MASTER_AI_AGENT.md` for exhaustive details on database schemas, API contracts, and AI agent personalities.


# Skills Configuration

You have access to specialized skills that extend your capabilities. For a complete directory of all available technical and marketing skills, refer to [SKILLS.md](./SKILLS.md).

## Core Technical & Platform Skills

### customer-support
Elite AI-powered customer support specialist mastering conversational AI, automated ticketing, sentiment analysis, and omnichannel support experiences.
Invoke: `skillkit read customer-support`

### firebase-basics
Foundational setup, authentication, and project management workflows for Firebase using the Firebase CLI.
Invoke: `skillkit read firebase-basics`

### firebase-firestore
Sets up, manages, and executes queries against Cloud Firestore database instances.
Invoke: `skillkit read firebase-firestore`

### firebase-auth-basics
Guide for setting up and using Firebase Authentication for user sign-in and management.
Invoke: `skillkit read firebase-auth-basics`

### firebase-hosting-basics
Working with Firebase Hosting (Classic) for static web apps and SPAs.
Invoke: `skillkit read firebase-hosting-basics`

### firebase-app-hosting-basics
Deploy and manage web apps with Firebase App Hosting (Next.js/Angular with backends).
Invoke: `skillkit read firebase-app-hosting-basics`

### firebase-data-connect
Builds and deploys Firebase SQL Connect backends with PostgreSQL securely.
Invoke: `skillkit read firebase-data-connect`

### firebase-ai-logic-basics
Integrating Gemini API into web applications via Firebase AI Logic.
Invoke: `skillkit read firebase-ai-logic-basics`

### firebase-security-rules-auditor
Evaluate and harden Firestore security rules for robustness and security.
Invoke: `skillkit read firebase-security-rules-auditor`

### firebase-development
Firebase development guidelines for Firestore, Auth, Functions, and Storage with TypeScript and Angular.
Invoke: `skillkit read firebase-development`

### developing-genkit-js
AI-powered app development using Genkit in Node.js/TypeScript.
Invoke: `skillkit read developing-genkit-js`

### developing-genkit-python
AI-powered app development using Genkit in Python.
Invoke: `skillkit read developing-genkit-python`

### developing-genkit-go
AI-powered app development using Genkit in Go.
Invoke: `skillkit read developing-genkit-go`

### developing-genkit-dart
AI-powered app development using Genkit in Dart/Flutter.
Invoke: `skillkit read developing-genkit-dart`

### image-optimization-cdn
Automatic image resizing, conversion, lazy loading, and CDN serving.
Invoke: `skillkit read image-optimization-cdn`

### xcode-project-setup
Safely modifies Xcode projects (.pbxproj) to add Swift Packages and link files.
Invoke: `skillkit read xcode-project-setup`

## Marketing & Growth Skills (managed via SkillKit)

### ab-testing
When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program. Also use when the user mentions "A/B test," "split test," "experiment," "test this change," "variant copy," "multivariate test," "hypothesis," "should I test this," "which version is better," "test two versions," "statistical significance," "how long should I run this test," "growth experiments," "experiment velocity," "experiment backlog," "ICE score," "experimentation program," or "experiment playbook." Use this whenever someone is comparing two approaches and wants to measure which performs better, or when they want to build a systematic experimentation practice. For tracking implementation, see analytics. For page-level conversion optimization, see cro.

Invoke: `skillkit read ab-testing`

### ad-creative
When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad variations — for any paid advertising platform. Also use when the user mentions 'ad copy variations,' 'ad creative,' 'generate headlines,' 'RSA headlines,' 'bulk ad copy,' 'ad iterations,' 'creative testing,' 'ad performance optimization,' 'write me some ads,' 'Facebook ad copy,' 'Google ad headlines,' 'LinkedIn ad text,' or 'I need more ad variations.' Use this whenever someone needs to produce ad copy at scale or iterate on existing ads. For campaign strategy and targeting, see ads. For landing page copy, see copywriting.

Invoke: `skillkit read ad-creative`

### ads
When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X, or other ad platforms. Also use when the user mentions 'PPC,' 'paid media,' 'ROAS,' 'CPA,' 'ad campaign,' 'retargeting,' 'audience targeting,' 'Google Ads,' 'Facebook ads,' 'LinkedIn ads,' 'ad budget,' 'cost per click,' 'ad spend,' or 'should I run ads.' Use this for campaign strategy, audience targeting, bidding, and optimization. For bulk ad creative generation and iteration, see ad-creative. For landing page optimization, see cro.

Invoke: `skillkit read ads`

### ai-seo
When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Also use when the user mentions 'AI SEO,' 'AEO,' 'GEO,' 'LLMO,' 'answer engine optimization,' 'generative engine optimization,' 'LLM optimization,' 'AI Overviews,' 'optimize for ChatGPT,' 'optimize for Perplexity,' 'AI citations,' 'AI visibility,' 'zero-click search,' 'how do I show up in AI answers,' 'LLM mentions,' or 'optimize for Claude/Gemini.' Use this whenever someone wants their content to be cited or surfaced by AI assistants and AI search engines. For traditional technical and on-page SEO audits, see seo-audit. For structured data implementation, see schema.

Invoke: `skillkit read ai-seo`

### analytics
When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions "set up tracking," "GA4," "Google Analytics," "conversion tracking," "event tracking," "UTM parameters," "tag manager," "GTM," "analytics implementation," "tracking plan," "how do I measure this," "track conversions," "attribution," "Mixpanel," "Segment," "are my events firing," or "analytics isn't working." Use this whenever someone asks how to know if something is working or wants to measure marketing results. For A/B test measurement, see ab-testing.

Invoke: `skillkit read analytics`

### aso
When the user wants to audit or optimize an App Store or Google Play listing. Also use when the user mentions 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'improve app visibility,' 'app store ranking,' 'audit my listing,' 'why aren't people downloading my app,' 'improve my app conversion,' 'keyword optimization for app,' or 'compare my app to competitors.' Use when the user shares an App Store or Google Play URL and wants to improve it.

Invoke: `skillkit read aso`

### churn-prevention
When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or implement retention strategies. Also use when the user mentions 'churn,' 'cancel flow,' 'offboarding,' 'save offer,' 'dunning,' 'failed payment recovery,' 'win-back,' 'retention,' 'exit survey,' 'pause subscription,' 'involuntary churn,' 'people keep canceling,' 'churn rate is too high,' 'how do I keep users,' or 'customers are leaving.' Use this whenever someone is losing subscribers or wants to build systems to prevent it. For post-cancel win-back email sequences, see emails. For in-app upgrade paywalls, see paywalls.

Invoke: `skillkit read churn-prevention`

### co-marketing
When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportunities. Use when the user says 'co-marketing,' 'partner marketing,' 'joint campaign,' 'who should we partner with,' 'integration marketing,' 'cross-promotion,' 'collaborate with another company,' 'partnership ideas,' or 'co-brand.' For customer referral programs, see referrals. For launch-specific partnerships, see launch.

Invoke: `skillkit read co-marketing`

### cold-email
Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write cold outreach emails, prospecting emails, cold email campaigns, sales development emails, or SDR emails. Also use when the user mentions "cold outreach," "prospecting email," "outbound email," "email to leads," "reach out to prospects," "sales email," "follow-up email sequence," "nobody's replying to my emails," or "how do I write a cold email." Covers subject lines, opening lines, body copy, CTAs, personalization, and multi-touch follow-up sequences. For warm/lifecycle email sequences, see emails. For sales collateral beyond emails, see sales-enablement.

Invoke: `skillkit read cold-email`

### community-marketing
Build and leverage online communities to drive product growth and brand loyalty. Use when the user wants to create a community strategy, grow a Discord or Slack community, manage a forum or subreddit, build brand advocates, increase word-of-mouth, drive community-led growth, engage users post-signup, or turn customers into evangelists. Trigger phrases: "build a community," "community strategy," "Discord community," "Slack community," "community-led growth," "brand advocates," "user community," "forum strategy," "community engagement," "grow our community," "ambassador program," "community flywheel."

Invoke: `skillkit read community-marketing`

### competitor-profiling
When the user wants to research, profile, or analyze competitors from their URLs. Also use when the user mentions 'competitor profile,' 'competitor research,' 'competitor analysis,' 'profile this competitor,' 'analyze competitor,' 'competitive intelligence,' 'competitor deep dive,' 'who are my competitors,' 'competitor landscape,' 'competitor dossier,' 'competitive audit,' or 'research these competitors.' Input is a list of competitor URLs. Output is structured competitor profile markdown files. For creating comparison/alternative pages from profiles, see competitors. For sales-specific battle cards, see sales-enablement.

Invoke: `skillkit read competitor-profiling`

### competitors
When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. Also use when the user mentions 'alternative page,' 'vs page,' 'competitor comparison,' 'comparison page,' '[Product] vs [Product],' '[Product] alternative,' 'competitive landing pages,' 'how do we compare to X,' 'battle card,' or 'competitor teardown.' Use this for any content that positions your product against competitors. Covers four formats: singular alternative, plural alternatives, you vs competitor, and competitor vs competitor. For sales-specific competitor docs, see sales-enablement.

Invoke: `skillkit read competitors`

### content-strategy
When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. Also use when the user mentions "content strategy," "what should I write about," "content ideas," "blog strategy," "topic clusters," "content planning," "editorial calendar," "content marketing," "content roadmap," "what content should I create," "blog topics," "content pillars," or "I don't know what to write." Use this whenever someone needs help deciding what content to produce, not just writing it. For writing individual pieces, see copywriting. For SEO-specific audits, see seo-audit. For social media content specifically, see social.

Invoke: `skillkit read content-strategy`

### copy-editing
When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. Also use when the user mentions 'edit this copy,' 'review my copy,' 'copy feedback,' 'proofread,' 'polish this,' 'make this better,' 'copy sweep,' 'tighten this up,' 'this reads awkwardly,' 'clean up this text,' 'too wordy,' 'sharpen the messaging,' 'refresh this content,' 'update this page,' 'this content is outdated,' or 'content audit.' Use this when the user already has copy and wants it improved or refreshed rather than rewritten from scratch. For writing new copy, see copywriting.

Invoke: `skillkit read copy-editing`

### copywriting
When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages, or product pages. Also use when the user says "write copy for," "improve this copy," "rewrite this page," "marketing copy," "headline help," "CTA copy," "value proposition," "tagline," "subheadline," "hero section copy," "above the fold," "this copy is weak," "make this more compelling," or "help me describe my product." Use this whenever someone is working on website text that needs to persuade or convert. For email copy, see emails. For popup copy, see popups. For editing existing copy, see copy-editing.

Invoke: `skillkit read copywriting`

### cro
When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage, landing pages, pricing pages, feature pages, lead capture forms, or contact forms. Also use when the user says 'CRO,' 'conversion rate optimization,' 'this page isn't converting,' 'improve conversions,' 'why isn't this page working,' 'my landing page sucks,' 'form abandonment,' 'nobody's converting,' 'low conversion rate,' or 'this page needs work.' Use this even if the user just shares a URL and asks for feedback. For signup/registration flows, see signup. For post-signup activation, see onboarding. For popups/modals, see popups.

Invoke: `skillkit read cro`

### customer-research
When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions "customer research," "ICP research," "talk to customers," "analyze transcripts," "customer interviews," "survey analysis," "support ticket analysis," "voice of customer," "VOC," "build personas," "customer personas," "jobs to be done," "JTBD," "what do customers say," "what are customers struggling with," "Reddit mining," "G2 reviews," "review mining," "digital watering holes," "community research," "forum research," "competitor reviews," "customer sentiment," or "find out why customers churn/convert/buy." Use for both analyzing existing research assets AND gathering new research from online sources. For writing copy informed by research, see copywriting. For acting on research to improve pages, see cro.

Invoke: `skillkit read customer-research`

### directory-submissions
When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for backlinks, domain rating, and discovery. Also use when the user mentions "directory submissions," "submit to directories," "backlinks from directories," "list my product," "submit to Product Hunt," "BetaList," "TAAFT," "Futurepedia," "G2 listing," "Capterra listing," "AlternativeTo," "SaaSHub," "AI directories," "MCP registry," "agent directory," "dofollow backlinks," "launch directories," or "directory tracker." Use this whenever someone is planning the directory layer of a product launch or an ongoing backlink campaign. For the broader launch moment, see launch. For programmatic SEO pages that should live behind these backlinks, see programmatic-seo. For AI citation optimization, see ai-seo.

Invoke: `skillkit read directory-submissions`

### emails
When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email program. Also use when the user mentions "email sequence," "drip campaign," "nurture sequence," "onboarding emails," "welcome sequence," "re-engagement emails," "email automation," "lifecycle emails," "trigger-based emails," "email funnel," "email workflow," "what emails should I send," "welcome series," or "email cadence." Use this for any multi-email automated flow. For cold outreach emails, see cold-email. For in-app onboarding, see onboarding.

Invoke: `skillkit read emails`

### free-tools
When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or brand awareness. Also use when the user mentions "engineering as marketing," "free tool," "marketing tool," "calculator," "generator," "interactive tool," "lead gen tool," "build a tool for leads," "free resource," "ROI calculator," "grader tool," "audit tool," "should I build a free tool," or "tools for lead gen." Use this whenever someone wants to build something useful and give it away to attract leads or earn links. For downloadable content lead magnets (ebooks, checklists, templates), see lead-magnets.

Invoke: `skillkit read free-tools`

### image
When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product mockups, profile banners, listing visuals, or brand assets. Also use when the user mentions 'AI image generation,' 'generate an image,' 'create a graphic,' 'product mockup,' 'hero image,' 'social media graphic,' 'banner image,' 'cover photo,' 'profile banner,' 'listing screenshot,' 'Flux,' 'Flux Kontext,' 'Midjourney,' 'DALL-E,' 'GPT Image,' 'ChatGPT Images,' 'Ideogram,' 'Gemini image,' 'Nano Banana,' 'Recraft,' 'Stable Diffusion,' 'Canva,' 'Figma,' 'image optimization,' 'compress images,' 'WebP,' or 'OG image.' Use this for general-purpose marketing image creation and optimization. For paid ad image creative and platform-specific ad specs, see ad-creative. For video production, see video.

Invoke: `skillkit read image`

### launch
When the user wants to plan a product launch, feature announcement, or release strategy. Also use when the user mentions 'launch,' 'Product Hunt,' 'feature release,' 'announcement,' 'go-to-market,' 'beta launch,' 'early access,' 'waitlist,' 'product update,' 'how do I launch this,' 'launch checklist,' 'GTM plan,' or 'we're about to ship.' Use this whenever someone is preparing to release something publicly. For ongoing marketing after launch, see marketing-ideas.

Invoke: `skillkit read launch`

### lead-magnets
When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. Also use when the user mentions "lead magnet," "gated content," "content upgrade," "downloadable," "ebook," "cheat sheet," "checklist," "template download," "opt-in," "freebie," "PDF download," "resource library," "content offer," "email capture content," "Notion template," "spreadsheet template," or "what should I give away for emails." Use this for planning what to create and how to distribute it. For interactive tools as lead magnets, see free-tools. For writing the actual content, see copywriting. For the email sequence after capture, see emails.

Invoke: `skillkit read lead-magnets`

### marketing-ideas
When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. Also use when the user asks for 'marketing ideas,' 'growth ideas,' 'how to market,' 'marketing strategies,' 'marketing tactics,' 'ways to promote,' 'ideas to grow,' 'what else can I try,' 'I don't know how to market this,' 'brainstorm marketing,' or 'what marketing should I do.' Use this as a starting point whenever someone is stuck or looking for inspiration on how to grow. For specific channel execution, see the relevant skill (ads, social, emails, etc.).

Invoke: `skillkit read marketing-ideas`

### marketing-psychology
When the user wants to apply psychological principles, mental models, or behavioral science to marketing. Also use when the user mentions 'psychology,' 'mental models,' 'cognitive bias,' 'persuasion,' 'behavioral science,' 'why people buy,' 'decision-making,' 'consumer behavior,' 'anchoring,' 'social proof,' 'scarcity,' 'loss aversion,' 'framing,' or 'nudge.' Use this whenever someone wants to understand or leverage how people think and make decisions in a marketing context. For applying psychology to specific pages, see cro; for pricing tactics, see pricing; for copy framing, see copywriting.

Invoke: `skillkit read marketing-psychology`

### onboarding
When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. Also use when the user mentions "onboarding flow," "activation rate," "user activation," "first-run experience," "empty states," "onboarding checklist," "aha moment," "new user experience," "users aren't activating," "nobody completes setup," "low activation rate," "users sign up but don't use the product," "time to value," or "first session experience." Use this whenever users are signing up but not sticking around. For signup/registration optimization, see signup. For ongoing email sequences, see emails.

Invoke: `skillkit read onboarding`

### paywalls
When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. Also use when the user mentions "paywall," "upgrade screen," "upgrade modal," "upsell," "feature gate," "convert free to paid," "freemium conversion," "trial expiration screen," "limit reached screen," "plan upgrade prompt," "in-app pricing," "free users won't upgrade," "trial to paid conversion," or "how do I get users to pay." Use this for any in-product moment where you're asking users to upgrade. Distinct from public pricing pages (see cro) — this focuses on in-product upgrade moments where the user has already experienced value. For pricing decisions, see pricing.

Invoke: `skillkit read paywalls`

### popups
When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also use when the user mentions "exit intent," "popup conversions," "modal optimization," "lead capture popup," "email popup," "announcement banner," "overlay," "collect emails with a popup," "exit popup," "scroll trigger," "sticky bar," or "notification bar." Use this for any overlay or interrupt-style conversion element. For forms outside of popups, see cro. For general page conversion optimization, see cro.

Invoke: `skillkit read popups`

### pricing
When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions 'pricing,' 'pricing tiers,' 'freemium,' 'free trial,' 'packaging,' 'price increase,' 'value metric,' 'Van Westendorp,' 'willingness to pay,' 'monetization,' 'how much should I charge,' 'my pricing is wrong,' 'pricing page,' 'annual vs monthly,' 'per seat pricing,' or 'should I offer a free plan.' Use this whenever someone is figuring out what to charge or how to structure their plans. For in-app upgrade screens, see paywalls.

Invoke: `skillkit read pricing`

### product-marketing
When the user wants to create or update their product marketing context document. Also use when the user mentions 'product context,' 'marketing context,' 'set up context,' 'positioning,' 'who is my target audience,' 'describe my product,' 'ICP,' 'ideal customer profile,' or wants to avoid repeating foundational information across marketing tasks. Use this at the start of any new project before using other marketing skills — it creates `.agents/product-marketing.md` that all other skills reference for product, audience, and positioning context.

Invoke: `skillkit read product-marketing`

### programmatic-seo
When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions "programmatic SEO," "template pages," "pages at scale," "directory pages," "location pages," "[keyword] + [city] pages," "comparison pages," "integration pages," "building many pages for SEO," "pSEO," "generate 100 pages," "data-driven pages," or "templated landing pages." Use this whenever someone wants to create many similar pages targeting different keywords or locations. For auditing existing SEO issues, see seo-audit. For content strategy planning, see content-strategy.

Invoke: `skillkit read programmatic-seo`

### referrals
When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy. Also use when the user mentions 'referral,' 'affiliate,' 'ambassador,' 'word of mouth,' 'viral loop,' 'refer a friend,' 'partner program,' 'referral incentive,' 'how to get referrals,' 'customers referring customers,' or 'affiliate payout.' Use this whenever someone wants existing users or partners to bring in new customers. For launch-specific virality, see launch.

Invoke: `skillkit read referrals`

### revops
When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes. Also use when the user mentions 'RevOps,' 'revenue operations,' 'lead scoring,' 'lead routing,' 'MQL,' 'SQL,' 'pipeline stages,' 'deal desk,' 'CRM automation,' 'marketing-to-sales handoff,' 'data hygiene,' 'leads aren't getting to sales,' 'pipeline management,' 'lead qualification,' or 'when should marketing hand off to sales.' Use this for anything involving the systems and processes that connect marketing to revenue. For cold outreach emails, see cold-email. For email drip campaigns, see emails. For pricing decisions, see pricing.

Invoke: `skillkit read revops`

### sales-enablement
When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. Also use when the user mentions 'sales deck,' 'pitch deck,' 'one-pager,' 'leave-behind,' 'objection handling,' 'deal-specific ROI analysis,' 'demo script,' 'talk track,' 'sales playbook,' 'proposal template,' 'buyer persona card,' 'help my sales team,' 'sales materials,' or 'what should I give my sales reps.' Use this for any document or asset that helps a sales team close deals. For competitor comparison pages and battle cards, see competitors. For marketing website copy, see copywriting. For cold outreach emails, see cold-email.

Invoke: `skillkit read sales-enablement`

### schema
When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user mentions "schema markup," "structured data," "JSON-LD," "rich snippets," "schema.org," "FAQ schema," "product schema," "review schema," "breadcrumb schema," "Google rich results," "knowledge panel," "star ratings in search," or "add structured data." Use this whenever someone wants their pages to show enhanced results in Google. For broader SEO issues, see seo-audit. For AI search optimization, see ai-seo.

Invoke: `skillkit read schema`

### seo-audit
When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO audit," "technical SEO," "why am I not ranking," "SEO issues," "on-page SEO," "meta tags review," "SEO health check," "my traffic dropped," "lost rankings," "not showing up in Google," "site isn't ranking," "Google update hit me," "page speed," "core web vitals," "crawl errors," or "indexing issues." Use this even if the user just says something vague like "my SEO is bad" or "help with SEO" — start with an audit. For building pages at scale to target keywords, see programmatic-seo. For adding structured data, see schema. For AI search optimization, see ai-seo.

Invoke: `skillkit read seo-audit`

### signup
When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the user mentions "signup conversions," "registration friction," "signup form optimization," "free trial signup," "reduce signup dropoff," "account creation flow," "people aren't signing up," "signup abandonment," "trial conversion rate," "nobody completes registration," "too many steps to sign up," or "simplify our signup." Use this whenever the user has a signup or registration flow that isn't performing. For post-signup onboarding, see onboarding. For lead capture forms (not account creation), see cro.

Invoke: `skillkit read signup`

### site-architecture
When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal linking. Also use when the user mentions "sitemap," "site map," "visual sitemap," "site structure," "page hierarchy," "information architecture," "IA," "navigation design," "URL structure," "breadcrumbs," "internal linking strategy," "website planning," "what pages do I need," "how should I organize my site," or "site navigation." Use this whenever someone is planning what pages a website should have and how they connect. NOT for XML sitemaps (that's technical SEO — see seo-audit). For SEO audits, see seo-audit. For structured data, see schema.

Invoke: `skillkit read site-architecture`

### social
When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, or other platforms. Also use when the user mentions 'LinkedIn post,' 'Twitter thread,' 'social media,' 'content calendar,' 'social scheduling,' 'engagement,' 'viral content,' 'what should I post,' 'repurpose this content,' 'tweet ideas,' 'LinkedIn carousel,' 'social media strategy,' 'grow my following,' 'TikTok video,' 'Reels,' 'Shorts,' 'video script,' 'video hook,' 'short-form video,' or 'create a reel.' Use this for social media content creation, repurposing, scheduling, and short-form video scripting. For broader content strategy, see content-strategy. For paid video ads, see ad-creative.

Invoke: `skillkit read social`

### video
When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. Also use when the user mentions 'video production,' 'AI video,' 'Remotion,' 'Hyperframes,' 'HeyGen,' 'Synthesia,' 'Veo,' 'Sora,' 'Runway,' 'Kling,' 'Seedance,' 'Hailuo,' 'MiniMax,' 'Pika,' 'Hunyuan,' 'Wan,' 'video generation,' 'AI avatar,' 'talking head video,' 'programmatic video,' 'video template,' 'explainer video,' 'product demo video,' 'video pipeline,' or 'make me a video.' Use this for video creation, generation, and production workflows. For video content strategy and what to post, see social. For paid video ad creative, see ad-creative.

Invoke: `skillkit read video`

## Skills Data

```json
[
  {
    "name": "ab-testing",
    "description": "When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program. Also use when the user mentions \"A/B test,\" \"split test,\" \"experiment,\" \"test this change,\" \"variant copy,\" \"multivariate test,\" \"hypothesis,\" \"should I test this,\" \"which version is better,\" \"test two versions,\" \"statistical significance,\" \"how long should I run this test,\" \"growth experiments,\" \"experiment velocity,\" \"experiment backlog,\" \"ICE score,\" \"experimentation program,\" or \"experiment playbook.\" Use this whenever someone is comparing two approaches and wants to measure which performs better, or when they want to build a systematic experimentation practice. For tracking implementation, see analytics. For page-level conversion optimization, see cro.",
    "invoke": "skillkit read ab-testing",
    "location": "project"
  },
  {
    "name": "ad-creative",
    "description": "When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad variations — for any paid advertising platform. Also use when the user mentions 'ad copy variations,' 'ad creative,' 'generate headlines,' 'RSA headlines,' 'bulk ad copy,' 'ad iterations,' 'creative testing,' 'ad performance optimization,' 'write me some ads,' 'Facebook ad copy,' 'Google ad headlines,' 'LinkedIn ad text,' or 'I need more ad variations.' Use this whenever someone needs to produce ad copy at scale or iterate on existing ads. For campaign strategy and targeting, see ads. For landing page copy, see copywriting.",
    "invoke": "skillkit read ad-creative",
    "location": "project"
  },
  {
    "name": "ads",
    "description": "When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X, or other ad platforms. Also use when the user mentions 'PPC,' 'paid media,' 'ROAS,' 'CPA,' 'ad campaign,' 'retargeting,' 'audience targeting,' 'Google Ads,' 'Facebook ads,' 'LinkedIn ads,' 'ad budget,' 'cost per click,' 'ad spend,' or 'should I run ads.' Use this for campaign strategy, audience targeting, bidding, and optimization. For bulk ad creative generation and iteration, see ad-creative. For landing page optimization, see cro.",
    "invoke": "skillkit read ads",
    "location": "project"
  },
  {
    "name": "ai-seo",
    "description": "When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Also use when the user mentions 'AI SEO,' 'AEO,' 'GEO,' 'LLMO,' 'answer engine optimization,' 'generative engine optimization,' 'LLM optimization,' 'AI Overviews,' 'optimize for ChatGPT,' 'optimize for Perplexity,' 'AI citations,' 'AI visibility,' 'zero-click search,' 'how do I show up in AI answers,' 'LLM mentions,' or 'optimize for Claude/Gemini.' Use this whenever someone wants their content to be cited or surfaced by AI assistants and AI search engines. For traditional technical and on-page SEO audits, see seo-audit. For structured data implementation, see schema.",
    "invoke": "skillkit read ai-seo",
    "location": "project"
  },
  {
    "name": "analytics",
    "description": "When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions \"set up tracking,\" \"GA4,\" \"Google Analytics,\" \"conversion tracking,\" \"event tracking,\" \"UTM parameters,\" \"tag manager,\" \"GTM,\" \"analytics implementation,\" \"tracking plan,\" \"how do I measure this,\" \"track conversions,\" \"attribution,\" \"Mixpanel,\" \"Segment,\" \"are my events firing,\" or \"analytics isn't working.\" Use this whenever someone asks how to know if something is working or wants to measure marketing results. For A/B test measurement, see ab-testing.",
    "invoke": "skillkit read analytics",
    "location": "project"
  },
  {
    "name": "aso",
    "description": "When the user wants to audit or optimize an App Store or Google Play listing. Also use when the user mentions 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'improve app visibility,' 'app store ranking,' 'audit my listing,' 'why aren't people downloading my app,' 'improve my app conversion,' 'keyword optimization for app,' or 'compare my app to competitors.' Use when the user shares an App Store or Google Play URL and wants to improve it.",
    "invoke": "skillkit read aso",
    "location": "project"
  },
  {
    "name": "churn-prevention",
    "description": "When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or implement retention strategies. Also use when the user mentions 'churn,' 'cancel flow,' 'offboarding,' 'save offer,' 'dunning,' 'failed payment recovery,' 'win-back,' 'retention,' 'exit survey,' 'pause subscription,' 'involuntary churn,' 'people keep canceling,' 'churn rate is too high,' 'how do I keep users,' or 'customers are leaving.' Use this whenever someone is losing subscribers or wants to build systems to prevent it. For post-cancel win-back email sequences, see emails. For in-app upgrade paywalls, see paywalls.",
    "invoke": "skillkit read churn-prevention",
    "location": "project"
  },
  {
    "name": "co-marketing",
    "description": "When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportunities. Use when the user says 'co-marketing,' 'partner marketing,' 'joint campaign,' 'who should we partner with,' 'integration marketing,' 'cross-promotion,' 'collaborate with another company,' 'partnership ideas,' or 'co-brand.' For customer referral programs, see referrals. For launch-specific partnerships, see launch.",
    "invoke": "skillkit read co-marketing",
    "location": "project"
  },
  {
    "name": "cold-email",
    "description": "Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write cold outreach emails, prospecting emails, cold email campaigns, sales development emails, or SDR emails. Also use when the user mentions \"cold outreach,\" \"prospecting email,\" \"outbound email,\" \"email to leads,\" \"reach out to prospects,\" \"sales email,\" \"follow-up email sequence,\" \"nobody's replying to my emails,\" or \"how do I write a cold email.\" Covers subject lines, opening lines, body copy, CTAs, personalization, and multi-touch follow-up sequences. For warm/lifecycle email sequences, see emails. For sales collateral beyond emails, see sales-enablement.",
    "invoke": "skillkit read cold-email",
    "location": "project"
  },
  {
    "name": "community-marketing",
    "description": "Build and leverage online communities to drive product growth and brand loyalty. Use when the user wants to create a community strategy, grow a Discord or Slack community, manage a forum or subreddit, build brand advocates, increase word-of-mouth, drive community-led growth, engage users post-signup, or turn customers into evangelists. Trigger phrases: \"build a community,\" \"community strategy,\" \"Discord community,\" \"Slack community,\" \"community-led growth,\" \"brand advocates,\" \"user community,\" \"forum strategy,\" \"community engagement,\" \"grow our community,\" \"ambassador program,\" \"community flywheel.\"",
    "invoke": "skillkit read community-marketing",
    "location": "project"
  },
  {
    "name": "competitor-profiling",
    "description": "When the user wants to research, profile, or analyze competitors from their URLs. Also use when the user mentions 'competitor profile,' 'competitor research,' 'competitor analysis,' 'profile this competitor,' 'analyze competitor,' 'competitive intelligence,' 'competitor deep dive,' 'who are my competitors,' 'competitor landscape,' 'competitor dossier,' 'competitive audit,' or 'research these competitors.' Input is a list of competitor URLs. Output is structured competitor profile markdown files. For creating comparison/alternative pages from profiles, see competitors. For sales-specific battle cards, see sales-enablement.",
    "invoke": "skillkit read competitor-profiling",
    "location": "project"
  },
  {
    "name": "competitors",
    "description": "When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. Also use when the user mentions 'alternative page,' 'vs page,' 'competitor comparison,' 'comparison page,' '[Product] vs [Product],' '[Product] alternative,' 'competitive landing pages,' 'how do we compare to X,' 'battle card,' or 'competitor teardown.' Use this for any content that positions your product against competitors. Covers four formats: singular alternative, plural alternatives, you vs competitor, and competitor vs competitor. For sales-specific competitor docs, see sales-enablement.",
    "invoke": "skillkit read competitors",
    "location": "project"
  },
  {
    "name": "content-strategy",
    "description": "When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. Also use when the user mentions \"content strategy,\" \"what should I write about,\" \"content ideas,\" \"blog strategy,\" \"topic clusters,\" \"content planning,\" \"editorial calendar,\" \"content marketing,\" \"content roadmap,\" \"what content should I create,\" \"blog topics,\" \"content pillars,\" or \"I don't know what to write.\" Use this whenever someone needs help deciding what content to produce, not just writing it. For writing individual pieces, see copywriting. For SEO-specific audits, see seo-audit. For social media content specifically, see social.",
    "invoke": "skillkit read content-strategy",
    "location": "project"
  },
  {
    "name": "copy-editing",
    "description": "When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. Also use when the user mentions 'edit this copy,' 'review my copy,' 'copy feedback,' 'proofread,' 'polish this,' 'make this better,' 'copy sweep,' 'tighten this up,' 'this reads awkwardly,' 'clean up this text,' 'too wordy,' 'sharpen the messaging,' 'refresh this content,' 'update this page,' 'this content is outdated,' or 'content audit.' Use this when the user already has copy and wants it improved or refreshed rather than rewritten from scratch. For writing new copy, see copywriting.",
    "invoke": "skillkit read copy-editing",
    "location": "project"
  },
  {
    "name": "copywriting",
    "description": "When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages, or product pages. Also use when the user says \"write copy for,\" \"improve this copy,\" \"rewrite this page,\" \"marketing copy,\" \"headline help,\" \"CTA copy,\" \"value proposition,\" \"tagline,\" \"subheadline,\" \"hero section copy,\" \"above the fold,\" \"this copy is weak,\" \"make this more compelling,\" or \"help me describe my product.\" Use this whenever someone is working on website text that needs to persuade or convert. For email copy, see emails. For popup copy, see popups. For editing existing copy, see copy-editing.",
    "invoke": "skillkit read copywriting",
    "location": "project"
  },
  {
    "name": "cro",
    "description": "When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage, landing pages, pricing pages, feature pages, lead capture forms, or contact forms. Also use when the user says 'CRO,' 'conversion rate optimization,' 'this page isn't converting,' 'improve conversions,' 'why isn't this page working,' 'my landing page sucks,' 'form abandonment,' 'nobody's converting,' 'low conversion rate,' or 'this page needs work.' Use this even if the user just shares a URL and asks for feedback. For signup/registration flows, see signup. For post-signup activation, see onboarding. For popups/modals, see popups.",
    "invoke": "skillkit read cro",
    "location": "project"
  },
  {
    "name": "customer-research",
    "description": "When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions \"customer research,\" \"ICP research,\" \"talk to customers,\" \"analyze transcripts,\" \"customer interviews,\" \"survey analysis,\" \"support ticket analysis,\" \"voice of customer,\" \"VOC,\" \"build personas,\" \"customer personas,\" \"jobs to be done,\" \"JTBD,\" \"what do customers say,\" \"what are customers struggling with,\" \"Reddit mining,\" \"G2 reviews,\" \"review mining,\" \"digital watering holes,\" \"community research,\" \"forum research,\" \"competitor reviews,\" \"customer sentiment,\" or \"find out why customers churn/convert/buy.\" Use for both analyzing existing research assets AND gathering new research from online sources. For writing copy informed by research, see copywriting. For acting on research to improve pages, see cro.",
    "invoke": "skillkit read customer-research",
    "location": "project"
  },
  {
    "name": "directory-submissions",
    "description": "When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for backlinks, domain rating, and discovery. Also use when the user mentions \"directory submissions,\" \"submit to directories,\" \"backlinks from directories,\" \"list my product,\" \"submit to Product Hunt,\" \"BetaList,\" \"TAAFT,\" \"Futurepedia,\" \"G2 listing,\" \"Capterra listing,\" \"AlternativeTo,\" \"SaaSHub,\" \"AI directories,\" \"MCP registry,\" \"agent directory,\" \"dofollow backlinks,\" \"launch directories,\" or \"directory tracker.\" Use this whenever someone is planning the directory layer of a product launch or an ongoing backlink campaign. For the broader launch moment, see launch. For programmatic SEO pages that should live behind these backlinks, see programmatic-seo. For AI citation optimization, see ai-seo.",
    "invoke": "skillkit read directory-submissions",
    "location": "project"
  },
  {
    "name": "emails",
    "description": "When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email program. Also use when the user mentions \"email sequence,\" \"drip campaign,\" \"nurture sequence,\" \"onboarding emails,\" \"welcome sequence,\" \"re-engagement emails,\" \"email automation,\" \"lifecycle emails,\" \"trigger-based emails,\" \"email funnel,\" \"email workflow,\" \"what emails should I send,\" \"welcome series,\" or \"email cadence.\" Use this for any multi-email automated flow. For cold outreach emails, see cold-email. For in-app onboarding, see onboarding.",
    "invoke": "skillkit read emails",
    "location": "project"
  },
  {
    "name": "free-tools",
    "description": "When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or brand awareness. Also use when the user mentions \"engineering as marketing,\" \"free tool,\" \"marketing tool,\" \"calculator,\" \"generator,\" \"interactive tool,\" \"lead gen tool,\" \"build a tool for leads,\" \"free resource,\" \"ROI calculator,\" \"grader tool,\" \"audit tool,\" \"should I build a free tool,\" or \"tools for lead gen.\" Use this whenever someone wants to build something useful and give it away to attract leads or earn links. For downloadable content lead magnets (ebooks, checklists, templates), see lead-magnets.",
    "invoke": "skillkit read free-tools",
    "location": "project"
  },
  {
    "name": "image",
    "description": "When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product mockups, profile banners, listing visuals, or brand assets. Also use when the user mentions 'AI image generation,' 'generate an image,' 'create a graphic,' 'product mockup,' 'hero image,' 'social media graphic,' 'banner image,' 'cover photo,' 'profile banner,' 'listing screenshot,' 'Flux,' 'Flux Kontext,' 'Midjourney,' 'DALL-E,' 'GPT Image,' 'ChatGPT Images,' 'Ideogram,' 'Gemini image,' 'Nano Banana,' 'Recraft,' 'Stable Diffusion,' 'Canva,' 'Figma,' 'image optimization,' 'compress images,' 'WebP,' or 'OG image.' Use this for general-purpose marketing image creation and optimization. For paid ad image creative and platform-specific ad specs, see ad-creative. For video production, see video.",
    "invoke": "skillkit read image",
    "location": "project"
  },
  {
    "name": "launch",
    "description": "When the user wants to plan a product launch, feature announcement, or release strategy. Also use when the user mentions 'launch,' 'Product Hunt,' 'feature release,' 'announcement,' 'go-to-market,' 'beta launch,' 'early access,' 'waitlist,' 'product update,' 'how do I launch this,' 'launch checklist,' 'GTM plan,' or 'we're about to ship.' Use this whenever someone is preparing to release something publicly. For ongoing marketing after launch, see marketing-ideas.",
    "invoke": "skillkit read launch",
    "location": "project"
  },
  {
    "name": "lead-magnets",
    "description": "When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. Also use when the user mentions \"lead magnet,\" \"gated content,\" \"content upgrade,\" \"downloadable,\" \"ebook,\" \"cheat sheet,\" \"checklist,\" \"template download,\" \"opt-in,\" \"freebie,\" \"PDF download,\" \"resource library,\" \"content offer,\" \"email capture content,\" \"Notion template,\" \"spreadsheet template,\" or \"what should I give away for emails.\" Use this for planning what to create and how to distribute it. For interactive tools as lead magnets, see free-tools. For writing the actual content, see copywriting. For the email sequence after capture, see emails.",
    "invoke": "skillkit read lead-magnets",
    "location": "project"
  },
  {
    "name": "marketing-ideas",
    "description": "When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. Also use when the user asks for 'marketing ideas,' 'growth ideas,' 'how to market,' 'marketing strategies,' 'marketing tactics,' 'ways to promote,' 'ideas to grow,' 'what else can I try,' 'I don't know how to market this,' 'brainstorm marketing,' or 'what marketing should I do.' Use this as a starting point whenever someone is stuck or looking for inspiration on how to grow. For specific channel execution, see the relevant skill (ads, social, emails, etc.).",
    "invoke": "skillkit read marketing-ideas",
    "location": "project"
  },
  {
    "name": "marketing-psychology",
    "description": "When the user wants to apply psychological principles, mental models, or behavioral science to marketing. Also use when the user mentions 'psychology,' 'mental models,' 'cognitive bias,' 'persuasion,' 'behavioral science,' 'why people buy,' 'decision-making,' 'consumer behavior,' 'anchoring,' 'social proof,' 'scarcity,' 'loss aversion,' 'framing,' or 'nudge.' Use this whenever someone wants to understand or leverage how people think and make decisions in a marketing context. For applying psychology to specific pages, see cro; for pricing tactics, see pricing; for copy framing, see copywriting.",
    "invoke": "skillkit read marketing-psychology",
    "location": "project"
  },
  {
    "name": "onboarding",
    "description": "When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. Also use when the user mentions \"onboarding flow,\" \"activation rate,\" \"user activation,\" \"first-run experience,\" \"empty states,\" \"onboarding checklist,\" \"aha moment,\" \"new user experience,\" \"users aren't activating,\" \"nobody completes setup,\" \"low activation rate,\" \"users sign up but don't use the product,\" \"time to value,\" or \"first session experience.\" Use this whenever users are signing up but not sticking around. For signup/registration optimization, see signup. For ongoing email sequences, see emails.",
    "invoke": "skillkit read onboarding",
    "location": "project"
  },
  {
    "name": "paywalls",
    "description": "When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. Also use when the user mentions \"paywall,\" \"upgrade screen,\" \"upgrade modal,\" \"upsell,\" \"feature gate,\" \"convert free to paid,\" \"freemium conversion,\" \"trial expiration screen,\" \"limit reached screen,\" \"plan upgrade prompt,\" \"in-app pricing,\" \"free users won't upgrade,\" \"trial to paid conversion,\" or \"how do I get users to pay.\" Use this for any in-product moment where you're asking users to upgrade. Distinct from public pricing pages (see cro) — this focuses on in-product upgrade moments where the user has already experienced value. For pricing decisions, see pricing.",
    "invoke": "skillkit read paywalls",
    "location": "project"
  },
  {
    "name": "popups",
    "description": "When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also use when the user mentions \"exit intent,\" \"popup conversions,\" \"modal optimization,\" \"lead capture popup,\" \"email popup,\" \"announcement banner,\" \"overlay,\" \"collect emails with a popup,\" \"exit popup,\" \"scroll trigger,\" \"sticky bar,\" or \"notification bar.\" Use this for any overlay or interrupt-style conversion element. For forms outside of popups, see cro. For general page conversion optimization, see cro.",
    "invoke": "skillkit read popups",
    "location": "project"
  },
  {
    "name": "pricing",
    "description": "When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions 'pricing,' 'pricing tiers,' 'freemium,' 'free trial,' 'packaging,' 'price increase,' 'value metric,' 'Van Westendorp,' 'willingness to pay,' 'monetization,' 'how much should I charge,' 'my pricing is wrong,' 'pricing page,' 'annual vs monthly,' 'per seat pricing,' or 'should I offer a free plan.' Use this whenever someone is figuring out what to charge or how to structure their plans. For in-app upgrade screens, see paywalls.",
    "invoke": "skillkit read pricing",
    "location": "project"
  },
  {
    "name": "product-marketing",
    "description": "When the user wants to create or update their product marketing context document. Also use when the user mentions 'product context,' 'marketing context,' 'set up context,' 'positioning,' 'who is my target audience,' 'describe my product,' 'ICP,' 'ideal customer profile,' or wants to avoid repeating foundational information across marketing tasks. Use this at the start of any new project before using other marketing skills — it creates `.agents/product-marketing.md` that all other skills reference for product, audience, and positioning context.",
    "invoke": "skillkit read product-marketing",
    "location": "project"
  },
  {
    "name": "programmatic-seo",
    "description": "When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions \"programmatic SEO,\" \"template pages,\" \"pages at scale,\" \"directory pages,\" \"location pages,\" \"[keyword] + [city] pages,\" \"comparison pages,\" \"integration pages,\" \"building many pages for SEO,\" \"pSEO,\" \"generate 100 pages,\" \"data-driven pages,\" or \"templated landing pages.\" Use this whenever someone wants to create many similar pages targeting different keywords or locations. For auditing existing SEO issues, see seo-audit. For content strategy planning, see content-strategy.",
    "invoke": "skillkit read programmatic-seo",
    "location": "project"
  },
  {
    "name": "referrals",
    "description": "When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy. Also use when the user mentions 'referral,' 'affiliate,' 'ambassador,' 'word of mouth,' 'viral loop,' 'refer a friend,' 'partner program,' 'referral incentive,' 'how to get referrals,' 'customers referring customers,' or 'affiliate payout.' Use this whenever someone wants existing users or partners to bring in new customers. For launch-specific virality, see launch.",
    "invoke": "skillkit read referrals",
    "location": "project"
  },
  {
    "name": "revops",
    "description": "When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes. Also use when the user mentions 'RevOps,' 'revenue operations,' 'lead scoring,' 'lead routing,' 'MQL,' 'SQL,' 'pipeline stages,' 'deal desk,' 'CRM automation,' 'marketing-to-sales handoff,' 'data hygiene,' 'leads aren't getting to sales,' 'pipeline management,' 'lead qualification,' or 'when should marketing hand off to sales.' Use this for anything involving the systems and processes that connect marketing to revenue. For cold outreach emails, see cold-email. For email drip campaigns, see emails. For pricing decisions, see pricing.",
    "invoke": "skillkit read revops",
    "location": "project"
  },
  {
    "name": "sales-enablement",
    "description": "When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. Also use when the user mentions 'sales deck,' 'pitch deck,' 'one-pager,' 'leave-behind,' 'objection handling,' 'deal-specific ROI analysis,' 'demo script,' 'talk track,' 'sales playbook,' 'proposal template,' 'buyer persona card,' 'help my sales team,' 'sales materials,' or 'what should I give my sales reps.' Use this for any document or asset that helps a sales team close deals. For competitor comparison pages and battle cards, see competitors. For marketing website copy, see copywriting. For cold outreach emails, see cold-email.",
    "invoke": "skillkit read sales-enablement",
    "location": "project"
  },
  {
    "name": "schema",
    "description": "When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user mentions \"schema markup,\" \"structured data,\" \"JSON-LD,\" \"rich snippets,\" \"schema.org,\" \"FAQ schema,\" \"product schema,\" \"review schema,\" \"breadcrumb schema,\" \"Google rich results,\" \"knowledge panel,\" \"star ratings in search,\" or \"add structured data.\" Use this whenever someone wants their pages to show enhanced results in Google. For broader SEO issues, see seo-audit. For AI search optimization, see ai-seo.",
    "invoke": "skillkit read schema",
    "location": "project"
  },
  {
    "name": "seo-audit",
    "description": "When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions \"SEO audit,\" \"technical SEO,\" \"why am I not ranking,\" \"SEO issues,\" \"on-page SEO,\" \"meta tags review,\" \"SEO health check,\" \"my traffic dropped,\" \"lost rankings,\" \"not showing up in Google,\" \"site isn't ranking,\" \"Google update hit me,\" \"page speed,\" \"core web vitals,\" \"crawl errors,\" or \"indexing issues.\" Use this even if the user just says something vague like \"my SEO is bad\" or \"help with SEO\" — start with an audit. For building pages at scale to target keywords, see programmatic-seo. For adding structured data, see schema. For AI search optimization, see ai-seo.",
    "invoke": "skillkit read seo-audit",
    "location": "project"
  },
  {
    "name": "signup",
    "description": "When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the user mentions \"signup conversions,\" \"registration friction,\" \"signup form optimization,\" \"free trial signup,\" \"reduce signup dropoff,\" \"account creation flow,\" \"people aren't signing up,\" \"signup abandonment,\" \"trial conversion rate,\" \"nobody completes registration,\" \"too many steps to sign up,\" or \"simplify our signup.\" Use this whenever the user has a signup or registration flow that isn't performing. For post-signup onboarding, see onboarding. For lead capture forms (not account creation), see cro.",
    "invoke": "skillkit read signup",
    "location": "project"
  },
  {
    "name": "site-architecture",
    "description": "When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal linking. Also use when the user mentions \"sitemap,\" \"site map,\" \"visual sitemap,\" \"site structure,\" \"page hierarchy,\" \"information architecture,\" \"IA,\" \"navigation design,\" \"URL structure,\" \"breadcrumbs,\" \"internal linking strategy,\" \"website planning,\" \"what pages do I need,\" \"how should I organize my site,\" or \"site navigation.\" Use this whenever someone is planning what pages a website should have and how they connect. NOT for XML sitemaps (that's technical SEO — see seo-audit). For SEO audits, see seo-audit. For structured data, see schema.",
    "invoke": "skillkit read site-architecture",
    "location": "project"
  },
  {
    "name": "social",
    "description": "When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, or other platforms. Also use when the user mentions 'LinkedIn post,' 'Twitter thread,' 'social media,' 'content calendar,' 'social scheduling,' 'engagement,' 'viral content,' 'what should I post,' 'repurpose this content,' 'tweet ideas,' 'LinkedIn carousel,' 'social media strategy,' 'grow my following,' 'TikTok video,' 'Reels,' 'Shorts,' 'video script,' 'video hook,' 'short-form video,' or 'create a reel.' Use this for social media content creation, repurposing, scheduling, and short-form video scripting. For broader content strategy, see content-strategy. For paid video ads, see ad-creative.",
    "invoke": "skillkit read social",
    "location": "project"
  },
  {
    "name": "video",
    "description": "When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. Also use when the user mentions 'video production,' 'AI video,' 'Remotion,' 'Hyperframes,' 'HeyGen,' 'Synthesia,' 'Veo,' 'Sora,' 'Runway,' 'Kling,' 'Seedance,' 'Hailuo,' 'MiniMax,' 'Pika,' 'Hunyuan,' 'Wan,' 'video generation,' 'AI avatar,' 'talking head video,' 'programmatic video,' 'video template,' 'explainer video,' 'product demo video,' 'video pipeline,' or 'make me a video.' Use this for video creation, generation, and production workflows. For video content strategy and what to post, see social. For paid video ad creative, see ad-creative.",
    "invoke": "skillkit read video",
    "location": "project"
  }
]
```

## Usage Instructions

1. When a task matches a skill's description, load it using the invoke command
2. Skills provide step-by-step instructions for complex tasks
3. Each skill is self-contained with its own resources
