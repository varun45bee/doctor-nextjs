# Dr. Pratima Agale — Homeopathy Website (Next.js 14)

A complete, SEO-optimized Next.js website for Dr. Pratima Agale's homeopathic practice in Kalyan, Mumbai.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000
```

---

## 📁 Project Structure

```
app/
├── page.tsx                    # 🏠 Homepage
├── about/page.tsx              # 👩‍⚕️ About Dr. Pratima
├── services/
│   ├── womens-health/          # 🌸 PCOD, Thyroid, Menopause
│   ├── pediatric/              # 🌱 Child Immunity, ADHD
│   └── chronic-disease/        # 💚 Arthritis, Migraines, IBS
├── why-homeopathy/page.tsx     # ⚗️ Why Homeopathy
├── case-studies/page.tsx       # 📖 Patient Success Stories
├── patient-journey/page.tsx    # 🗺️ What to Expect
├── blog/page.tsx               # 📰 Knowledge Hub
├── contact/page.tsx            # 📞 Contact & Appointment Form
├── sitemap.ts                  # 🗺️ Auto-generated sitemap
└── robots.ts                   # 🤖 SEO robots

components/
├── Navbar.tsx                  # Navigation with language switcher
└── Footer.tsx                  # Footer with all links

lib/
├── translations.ts             # 🌐 English, Hindi, Marathi strings
└── language-context.tsx        # Language state provider
```

---

## 🔧 What To Update (Priority Order)

### 1. Doctor Info & Clinic Details
Search for these placeholders and replace:

| Placeholder | Replace With |
|---|---|
| `[Your Clinic Address]` | Full street address |
| `+91 XXXXX XXXXX` | Actual phone number |
| `10+` (years) | Actual years of experience |
| `5000+` (patients) | Actual patient count |
| `info@pratimaagale.in` | Actual email |

### 2. Add Real Photos
Replace emoji placeholders in `app/about/page.tsx` with actual `<Image>` components:

```tsx
import Image from "next/image";
// ...
<Image src="/images/dr-pratima-portrait.jpg" alt="Dr. Pratima Agale" fill className="object-cover" />
```

Add photos to `public/images/` folder.

### 3. Update JSON-LD Schema (`app/layout.tsx`)
Fill in the real address, phone, and Google Maps link.

### 4. Connect the Contact Form
The form in `app/contact/page.tsx` has a simulated submission. 
Connect it to a real service:
- **EmailJS** (free, easy): https://emailjs.com
- **Formspree**: https://formspree.io
- **Custom API route**: Create `app/api/contact/route.ts`

### 5. Add Google Analytics
```tsx
// In app/layout.tsx head:
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

### 6. Add Real Blog Articles
Each article gets its own file:
```
app/blog/your-article-slug/page.tsx
```

---

## 🌐 Multi-Language Support

The site supports English, Hindi, and Marathi. To add/edit translations:
- Edit `lib/translations.ts`
- Add new keys under all three locales (`en`, `hi`, `mr`)
- Use in components: `const { t } = useLanguage();`

---

## 🎯 SEO Strategy

### Local SEO Keywords Targeted:
- "homeopathy doctor kalyan"
- "best homeopathy doctor mumbai"
- "PCOD homeopathy kalyan"
- "pediatric homeopathy andheri"
- "thyroid homeopathy treatment"
- Hindi/Marathi: "होम्योपैथी कल्याण" / "होमिओपॅथी कल्याण"

### SEO Features Built In:
- ✅ `metadata` exports on every page
- ✅ JSON-LD local business schema
- ✅ Auto-generated sitemap.xml
- ✅ robots.txt
- ✅ OpenGraph & Twitter cards
- ✅ Semantic HTML headings (H1, H2, H3)
- ✅ Alt text on images
- ✅ Mobile-first responsive design
- ✅ Fast page loads (Next.js App Router)

### Recommended Next Steps for SEO:
1. **Google Business Profile** — Register and verify at google.com/business
2. **JustDial / Practo** — List the clinic on Indian health directories
3. **Backlinks** — Get listed on Maharashtra health portals
4. **Blog regularly** — 2–4 articles/month targets long-tail searches
5. **Google Search Console** — Submit sitemap.xml

---

## 🚀 Deployment

### Vercel (Recommended — Free)
```bash
npm install -g vercel
vercel
# Follow prompts, connect to pratimaagale.in domain
```

### Alternative: Netlify
```bash
npm run build
# Upload .next folder to Netlify
```

---

## 📝 Adding New Pages

```tsx
// app/services/skin-disorders/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skin Disorder Homeopathy | Eczema, Psoriasis Treatment Kalyan",
  description: "...",
};

export default function SkinPage() {
  return <div>...</div>;
}
```

Then add the link to `Navbar.tsx` services dropdown.

---

Built with ❤️ for Dr. Pratima Agale's healing mission in Kalyan, Maharashtra.
