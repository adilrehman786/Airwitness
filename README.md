## Detailed Score Breakdown

### 1. Code Quality
Clean, modular HTML/CSS/JavaScript architecture with separated frontend, server-side API, testing, configuration, and documentation. Includes input validation, structured logic, maintainable code, and clear project organization.

### 2. Security
Gemini API credentials are protected through server-side environment variables. The API validates requests, limits payload size, restricts accepted parameters, handles errors safely, and escapes AI-generated content before rendering to reduce XSS risk.

### 3. Efficiency
Local data validation and hotspot analysis are performed before AI generation. Gemini requests are bounded by observation, row, and context limits, while the lightweight frontend and local fallback reduce unnecessary processing and external API dependency.

### 4. Testing
Added an automated Node.js test suite covering valid, missing, and invalid PM2.5 values, Ward 17 hotspot detection, and exclusion of missing readings from calculations. Current result: **5/5 tests passing**.

### 5. Accessibility
Added accessible labels, semantic controls, `lang="en"`, screen-reader-friendly labels, visible keyboard focus states, usable interactive control sizing, and `prefers-reduced-motion` support.

### 6. Problem Statement Alignment
Directly addresses the Civic Air Quality Briefing Studio through messy-data auditing, hotspot detection, evidence inspection, audience-specific civic briefings, previous-vs-current analysis, intervention scenarios, multilingual citizen advisories, and responsible Gemini-assisted analysis.
