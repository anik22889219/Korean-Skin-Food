<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `skillkit read <skill-name>` or `npx skillkit read <skill-name>`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>copywriting</name>
<description>When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages, or product pages. Also use when the user says &quot;write copy for,&quot; &quot;improve this copy,&quot; &quot;rewrite this page,&quot; &quot;marketing copy,&quot; &quot;headline help,&quot; &quot;CTA copy,&quot; &quot;value proposition,&quot; &quot;tagline,&quot; &quot;subheadline,&quot; &quot;hero section copy,&quot; &quot;above the fold,&quot; &quot;this copy is weak,&quot; &quot;make this more compelling,&quot; or &quot;help me describe my product.&quot; Use this whenever someone is working on website text that needs to persuade or convert. For email copy, see emails. For popup copy, see popups. For editing existing copy, see copy-editing.</description>
<location>project</location>
</skill>

<skill>
<name>cro</name>
<description>When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage, landing pages, pricing pages, feature pages, lead capture forms, or contact forms. Also use when the user says &apos;CRO,&apos; &apos;conversion rate optimization,&apos; &apos;this page isn&apos;t converting,&apos; &apos;improve conversions,&apos; &apos;why isn&apos;t this page working,&apos; &apos;my landing page sucks,&apos; &apos;form abandonment,&apos; &apos;nobody&apos;s converting,&apos; &apos;low conversion rate,&apos; or &apos;this page needs work.&apos; Use this even if the user just shares a URL and asks for feedback. For signup/registration flows, see signup. For post-signup activation, see onboarding. For popups/modals, see popups.</description>
<location>project</location>
</skill>

<skill>
<name>api-designer</name>
<description>Use when designing REST or GraphQL APIs, creating OpenAPI specifications, or planning API architecture. Invoke for resource modeling, versioning strategies, pagination patterns, error handling standards.</description>
<location>global</location>
</skill>

<skill>
<name>claude-api</name>
<description>Build apps with the Claude API or Anthropic SDK. TRIGGER when: code imports `anthropic`/`@anthropic-ai/sdk`/`claude_agent_sdk`, or user asks to use Claude API, Anthropic SDKs, or Agent SDK. DO NOT TRIGGER when: code imports `openai`/other AI SDK, general programming, or ML/data-science tasks.</description>
<location>global</location>
</skill>

<skill>
<name>debugging-wizard</name>
<description>Parses error messages, traces execution flow through stack traces, correlates log entries to identify failure points, and applies systematic hypothesis-driven methodology to isolate and resolve bugs. Use when investigating errors, analyzing stack traces, finding root causes of unexpected behavior, troubleshooting crashes, or performing log analysis, error investigation, or root cause analysis.</description>
<location>global</location>
</skill>

<skill>
<name>deep-research</name>
<description>This skill should be used when the user needs deep, multi-step research using native web tools (WebSearch/WebFetch) without external API keys.</description>
<location>global</location>
</skill>

<skill>
<name>devops-engineer</name>
<description>Creates Dockerfiles, configures CI/CD pipelines, writes Kubernetes manifests, and generates Terraform/Pulumi infrastructure templates. Handles deployment automation, GitOps configuration, incident response runbooks, and internal developer platform tooling. Use when setting up CI/CD pipelines, containerizing applications, managing infrastructure as code, deploying to Kubernetes clusters, configuring cloud platforms, automating releases, or responding to production incidents. Invoke for pipelines, Docker, Kubernetes, GitOps, Terraform, GitHub Actions, on-call, or platform engineering.</description>
<location>global</location>
</skill>

<skill>
<name>docker-development</name>
<description>Docker and container development agent skill and plugin for Dockerfile optimization, docker-compose orchestration, multi-stage builds, and container security hardening. Use when: user wants to optimize a Dockerfile, create or improve docker-compose configurations, implement multi-stage builds, audit container security, reduce image size, or follow container best practices. Covers build performance, layer caching, secret management, and production-ready container patterns.</description>
<location>global</location>
</skill>

<skill>
<name>python-pro</name>
<description>Use when building Python 3.11+ applications requiring type safety, async programming, or robust error handling. Generates type-annotated Python code, configures mypy in strict mode, writes pytest test suites with fixtures and mocking, and validates code with black and ruff. Invoke for type hints, async/await patterns, dataclasses, dependency injection, logging configuration, and structured error handling.</description>
<location>global</location>
</skill>

<skill>
<name>react-expert</name>
<description>Use when building React 18+ applications in .jsx or .tsx files, Next.js App Router projects, or create-react-app setups. Creates components, implements custom hooks, debugs rendering issues, migrates class components to functional, and implements state management. Invoke for Server Components, Suspense boundaries, useActionState forms, performance optimization, or React 19 features.</description>
<location>global</location>
</skill>

<skill>
<name>test-master</name>
<description>Generates test files, creates mocking strategies, analyzes code coverage, designs test architectures, and produces test plans and defect reports across functional, performance, and security testing disciplines. Use when writing unit tests, integration tests, or E2E tests; creating test strategies or automation frameworks; analyzing coverage gaps; performance testing with k6 or Artillery; security testing with OWASP methods; debugging flaky tests; or working on QA, regression, test automation, quality gates, shift-left testing, or test maintenance.</description>
<location>global</location>
</skill>

<skill>
<name>typescript-pro</name>
<description>Implements advanced TypeScript type systems, creates custom type guards, utility types, and branded types, and configures tRPC for end-to-end type safety. Use when building TypeScript applications requiring advanced generics, conditional or mapped types, discriminated unions, monorepo setup, or full-stack type safety with tRPC.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>