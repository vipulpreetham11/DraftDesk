# DraftDesk — Brand Guidelines

---

## 1. Brand overview

**Name:** DraftDesk
**Tagline:** Your content, scripted & tracked.
**One-liner:** AI-powered content planner and tracker for solo creators.
**Domain options:** getdraftdesk.com · draftdesk.io · draftdesk.co
**Social handles:** @draftdesk · @getdraftdesk

### Brand personality

Three words: **Friendly · Clear · Encouraging**

### Brand axes

```
Playful  ———●————→ Serious         (slightly playful)
Warm     ●————————→ Cool            (very warm)
Loud     ————●————→ Quiet           (balanced)
Organic  ——●——————→ Geometric       (leaning organic/soft)
Premium  ————————●→ Accessible      (very accessible)
```

### Visual direction

**Warm Studio** — Canva's friendliness meets Notion's clarity. Warm coral tones with cream backgrounds create an inviting workspace that doesn't feel corporate or intimidating. The warmth signals "this is for creators, not enterprises."

---

## 2. Color system

### Primary

| Token           | Hex       | Usage                                        |
|-----------------|-----------|----------------------------------------------|
| Primary         | `#E8734A` | CTAs, links, active states, key UI elements  |
| Primary Light   | `#F4A98B` | Hover states, light backgrounds, badges      |
| Primary Dark    | `#C45A32` | Pressed states, text on light coral bg       |

### Secondary

| Token           | Hex       | Usage                                   |
|-----------------|-----------|----------------------------------------|
| Charcoal        | `#2D2A26` | Headings, strong text, dark backgrounds |
| Charcoal Light  | `#4A4540` | Subheadings, secondary dark elements    |

### Accent

| Token           | Hex       | Usage                                    |
|-----------------|-----------|------------------------------------------|
| Amber           | `#F5C563` | Highlights, badges, notifications, stars |
| Amber Light     | `#FCE8B8` | Light amber backgrounds, tag fills       |

### Neutrals (warm gray scale)

| Stop | Hex       | Usage                   |
|------|-----------|------------------------|
| 50   | `#FAF8F5` | Page background         |
| 100  | `#F3F0EB` | Card background, subtle |
| 200  | `#E8E4DE` | Borders, dividers       |
| 300  | `#C9C4BC` | Disabled text           |
| 400  | `#A09A91` | Placeholder text        |
| 500  | `#787269` | Secondary text          |
| 600  | `#5C5750` | Body text               |
| 700  | `#3D3935` | Strong body text        |
| 800  | `#2D2A26` | Headings                |
| 900  | `#1A1816` | Darkest text            |

### Semantic

| Token   | Hex       |
|---------|-----------|
| Success | `#34A853` |
| Warning | `#F5C563` |
| Error   | `#DC4B4B` |
| Info    | `#4A90D9` |

### Backgrounds

| Token      | Hex       |
|------------|-----------|
| Page BG    | `#FAF8F5` |
| Card BG    | `#FFFFFF` |
| Sidebar BG | `#F3F0EB` |

### Color rules

- Primary coral passes WCAG AA on white (contrast ratio: 4.51:1)
- Never use pure black `#000000` for text — use `#2D2A26` (Gray 800)
- Never use pure white `#FFFFFF` for page bg — use `#FAF8F5` (warm tint)
- Amber accent is visually distinct from coral primary — warm gold vs warm orange
- All neutrals have a warm undertone (slightly yellow/brown, never blue-gray)

### Dark mode variants

| Token       | Light       | Dark        |
|-------------|-------------|-------------|
| Page BG     | `#FAF8F5`   | `#1A1816`   |
| Card BG     | `#FFFFFF`   | `#2D2A26`   |
| Sidebar BG  | `#F3F0EB`   | `#232019`   |
| Borders     | `#E8E4DE`   | `#3D3935`   |
| Body text   | `#5C5750`   | `#C9C4BC`   |
| Headings    | `#2D2A26`   | `#F3F0EB`   |
| Primary     | `#E8734A`   | `#F4A98B`   |

---

## 3. Typography

### Heading font

- **Font:** Outfit
- **Google Fonts:** `https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=swap`
- **Weights:** 500 (subheads), 600 (section heads), 700 (hero/page titles)
- **Style:** Geometric sans-serif, modern and warm with rounded terminals

### Body font

- **Font:** Source Sans 3
- **Google Fonts:** `https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&display=swap`
- **Weights:** 400 (body), 500 (emphasis), 600 (bold inline)
- **Style:** Humanist sans-serif, excellent readability, Adobe's open-source workhorse

### Mono font

- **Font:** JetBrains Mono
- **Weights:** 400, 500
- **Usage:** Tags, metadata, timestamps, code snippets

### Type scale

```
text-xs:    12px / 16px line-height    (captions, timestamps)
text-sm:    14px / 20px                (secondary text, labels)
text-base:  16px / 24px                (body text)
text-lg:    18px / 28px                (large body, intros)
text-xl:    20px / 28px                (card titles)
text-2xl:   24px / 32px                (section headings)
text-3xl:   30px / 36px                (page titles)
text-4xl:   36px / 40px                (hero subheading)
text-5xl:   48px / 48px                (hero heading)
text-6xl:   60px / 60px                (landing page hero only)
```

### Pairing rationale

Outfit (geometric, rounded) + Source Sans 3 (humanist, open) creates clear contrast between heading and body. Both are warm and approachable but distinct enough to create visual hierarchy.

---

## 4. Spacing & layout

### Border radius

```
sm:   6px    (small buttons, input fields)
md:   10px   (buttons, badges, tags)
lg:   12px   (cards, modals, dropdowns)
xl:   16px   (hero cards, feature sections)
full: 9999px (pills, avatars, toggles)
```

### Spacing scale (base 4px)

```
1:   4px      8:   32px
2:   8px      10:  40px
3:   12px     12:  48px
4:   16px     16:  64px
5:   20px     20:  80px
6:   24px     24:  96px
```

### Shadows

```
sm:   0 1px 3px rgba(45,42,38, 0.06)
md:   0 4px 8px rgba(45,42,38, 0.08)
lg:   0 12px 24px rgba(45,42,38, 0.10)
xl:   0 24px 48px rgba(45,42,38, 0.12)
```

Note: shadow color uses charcoal `#2D2A26` as base (warm shadow, not blue-gray).

---

## 5. UI style tokens

### Style direction: Soft Warm

```
BUTTON STYLES:
─────────────
Primary:    bg #E8734A, text #FFFFFF, radius 10px, shadow-sm, 
            hover: bg #C45A32, transform scale(1.02)
Secondary:  bg transparent, text #2D2A26, border 1.5px #E8E4DE, radius 10px,
            hover: bg #F3F0EB
Ghost:      bg transparent, text #E8734A, no border,
            hover: bg #FAF8F5
Disabled:   bg #F3F0EB, text #C9C4BC, no border

CARD STYLES:
────────────
Default:    bg #FFFFFF, border 1.5px #E8E4DE, radius 12px, shadow-none,
            hover: shadow-sm, border-color #C9C4BC
Active:     bg #FFFFFF, border 1.5px #E8734A, radius 12px
Glass:      bg rgba(255,255,255,0.7), backdrop-blur 12px, border 1px rgba(232,228,222,0.5)

INPUT STYLES:
─────────────
Default:    bg #FFFFFF, border 1.5px #E8E4DE, radius 10px, padding 10px 14px
Focus:      border-color #E8734A, ring 3px rgba(232,115,74, 0.15)
Error:      border-color #DC4B4B, ring 3px rgba(220,75,75, 0.15)

NAVIGATION:
───────────
Style:      Top bar (landing) + Sidebar (app)
App bg:     #FAF8F5 (page) with #F3F0EB (sidebar)
Blur nav:   For landing page — backdrop-blur with warm cream tint
```

---

## 6. Logo direction

### Concept

**Style:** Wordmark + subtle icon
**Icon idea:** A stylized pencil tip or draft page with a small spark/dot — represents "ideas becoming scripts." The icon should be simple enough to work as a favicon (16x16).

### AI prompt for logo generation

Use this in Ideogram, Midjourney, or DALL-E:

```
Minimal logo for "DraftDesk", a content creation SaaS tool. 
Wordmark in Outfit font, weight 600, warm coral color #E8734A. 
Small icon to the left: a simplified pencil nib or folded page corner 
with a tiny spark dot. Clean, flat design, no gradients. 
White background. Modern SaaS aesthetic, friendly and approachable.
Aspect ratio 3:1.
```

### Variations needed

1. Full logo (icon + wordmark) — horizontal
2. Icon only (for favicon, app icon, social avatar)
3. Wordmark only (for nav bar, narrow spaces)
4. Monochrome (all charcoal `#2D2A26`)
5. Reversed (all white, for dark backgrounds)

### Logo clear space

Minimum clear space around logo = height of the icon on all sides. Never place the logo on busy backgrounds or images without a semi-transparent overlay.

---

## 7. Voice & tone

### Voice attributes

**Friendly** — Talk like a helpful friend, never like a corporate bot
**Clear** — No jargon, no filler, every word earns its place
**Encouraging** — Celebrate progress, make the user feel capable

### Word lists

**Use:** create, craft, plan, track, generate, script, idea, publish, grow, easy, simple, your, done, ready, fresh, spark, build, save, quick

**Avoid:** leverage, utilize, revolutionary, synergy, cutting-edge, robust, scalable, disruptive, enterprise, optimize, paradigm, streamline, solution, empower, unlock

### Tone by context

| Context         | Tone                                        | Example                                           |
|-----------------|--------------------------------------------|----------------------------------------------------|
| Headlines       | Bold, benefit-driven                        | "From idea to upload, faster."                     |
| Body copy       | Conversational, clear                       | "Stop staring at a blank page."                    |
| UI microcopy    | Friendly, helpful                           | "Nice! Script saved."                              |
| Error messages  | Empathetic, solution-first                  | "Something went sideways. Try again?"              |
| Empty states    | Encouraging, action-oriented                | "No scripts yet. Let's create your first one."     |
| CTA buttons     | Action verbs, warm                          | "Start creating", "Generate script", "Mark as done"|
| Success states  | Celebratory, brief                          | "Published! You're on a roll."                     |

---

## 8. Tailwind config snippet

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: {
          50:  '#FEF0EB',
          100: '#F4A98B',
          200: '#F09070',
          400: '#E8734A',
          600: '#C45A32',
          800: '#8B3D1F',
          900: '#5C2714',
        },
        charcoal: {
          DEFAULT: '#2D2A26',
          light:   '#4A4540',
        },
        amber: {
          DEFAULT: '#F5C563',
          light:   '#FCE8B8',
        },
        warm: {
          50:  '#FAF8F5',
          100: '#F3F0EB',
          200: '#E8E4DE',
          300: '#C9C4BC',
          400: '#A09A91',
          500: '#787269',
          600: '#5C5750',
          700: '#3D3935',
          800: '#2D2A26',
          900: '#1A1816',
        },
        success: '#34A853',
        warning: '#F5C563',
        error:   '#DC4B4B',
        info:    '#4A90D9',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body:    ['"Source Sans 3"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '12px',
        xl:  '16px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(45,42,38,0.06)',
        md: '0 4px 8px rgba(45,42,38,0.08)',
        lg: '0 12px 24px rgba(45,42,38,0.10)',
        xl: '0 24px 48px rgba(45,42,38,0.12)',
      },
    },
  },
}
```

### CSS variables version

```css
:root {
  /* Primary */
  --color-primary: #E8734A;
  --color-primary-light: #F4A98B;
  --color-primary-dark: #C45A32;

  /* Secondary */
  --color-charcoal: #2D2A26;
  --color-charcoal-light: #4A4540;

  /* Accent */
  --color-amber: #F5C563;
  --color-amber-light: #FCE8B8;

  /* Neutrals */
  --color-warm-50: #FAF8F5;
  --color-warm-100: #F3F0EB;
  --color-warm-200: #E8E4DE;
  --color-warm-300: #C9C4BC;
  --color-warm-400: #A09A91;
  --color-warm-500: #787269;
  --color-warm-600: #5C5750;
  --color-warm-700: #3D3935;
  --color-warm-800: #2D2A26;
  --color-warm-900: #1A1816;

  /* Semantic */
  --color-success: #34A853;
  --color-warning: #F5C563;
  --color-error: #DC4B4B;
  --color-info: #4A90D9;

  /* Backgrounds */
  --bg-page: #FAF8F5;
  --bg-card: #FFFFFF;
  --bg-sidebar: #F3F0EB;

  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Source Sans 3', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

---

## 9. Social media kit direction

### Profile picture

Coral background (`#E8734A`) with white icon (pencil nib or D lettermark). Simple, recognizable at 40x40px.

### Banner / cover image

Warm cream background (`#FAF8F5`) with the tagline "Your content, scripted & tracked" in Outfit 600, charcoal text. Subtle coral accent line or shape. Keep it minimal.

### Post template style

- Background: warm cream `#FAF8F5` or white
- Accent: coral border on left or bottom
- Heading: Outfit 600, charcoal
- Body: Source Sans 3, warm-500
- Consistent 24px padding on all sides
- No more than 2 colors per post (coral + charcoal, or amber + charcoal)

---

## 10. Do's and don'ts

### Do

- Use warm neutrals for backgrounds (never pure white or cool gray)
- Keep coral for interactive/important elements only — don't flood the UI with it
- Use amber sparingly for highlights and badges
- Maintain generous whitespace — the brand breathes
- Round corners consistently (10-12px for most elements)

### Don't

- Use blue-gray or cool-toned grays (the entire system is warm)
- Use gradients (flat fills only)
- Use more than 2 font families on any screen
- Use coral on coral (e.g., coral text on coral background)
- Make shadows blue-tinted (use warm charcoal-based shadows)
- Use Inter, Roboto, or Poppins anywhere
