// Free downloadable guides offered as lead magnets. Each has its own landing
// page at /guides/[slug]; blog posts link to the best-matching one.
export type Guide = {
  slug: "buyers-guide" | "golf-home-guide";
  source: string; // Lead.source value, so the CRM shows which guide converted
  title: string;
  short: string;
  description: string;
  pdfUrl: string;
  downloadName: string;
  cover: string;
  pages: number;
  bullets: string[];
};

export const GUIDES: Record<Guide["slug"], Guide> = {
  "buyers-guide": {
    slug: "buyers-guide",
    source: "GUIDE_BUYERS",
    title: "The Buyer's Guide to a New-Build Home in Murcia",
    short: "Buyer's Guide",
    description:
      "A step-by-step guide for UK and Irish buyers, from your first viewing to collecting your keys, with the costs, legal checks and paperwork explained in plain English.",
    pdfUrl: "https://ynyfywabzgrvilcbyvov.supabase.co/storage/v1/object/public/media/guides/medsol-buyers-guide-2026.pdf?download=MedSol-Buyers-Guide-New-Build-Murcia-2026.pdf",
    downloadName: "MedSol-Buyers-Guide-New-Build-Murcia-2026.pdf",
    cover: "/assets/guides/buyers-guide-cover.jpg",
    pages: 41,
    bullets: [
      "The 8-step buying journey, from viewing trip to completion at the notary",
      "Your all-in budget: taxes, fees and what to expect on top of the price",
      "What your lawyer checks, and how a power of attorney lets you buy from home",
      "A room-by-room snagging and handover checklist",
      "Running costs and your annual Modelo 210 explained",
    ],
  },
  "golf-home-guide": {
    slug: "golf-home-guide",
    source: "GUIDE_GOLF",
    title: "The Murcia Golf-Home Guide 2026",
    short: "Golf-Home Guide",
    description:
      "Where to play, where to live and why October to May is the best time of year to be on a Murcia golf resort, with real membership rates, weather data and travel times.",
    pdfUrl: "https://ynyfywabzgrvilcbyvov.supabase.co/storage/v1/object/public/media/guides/medsol-golf-home-guide-2026.pdf?download=MedSol-Murcia-Golf-Home-Guide-2026.pdf",
    downloadName: "MedSol-Murcia-Golf-Home-Guide-2026.pdf",
    cover: "/assets/guides/golf-home-guide-cover.jpg",
    pages: 39,
    bullets: [
      "The courses near the resorts, who runs them and what each is like",
      "Membership, green fees and owner rates, and which option suits how often you play",
      "A golfer's year, month by month, with weather and events",
      "Winter life beyond the fairway: food, beaches, markets and festivals",
      "Flights, airports and transfer times to every resort",
    ],
  },
};

// Posts about flights, travel, health, schools, value and place go to the golf
// guide even though they are filed under "Guides".
const GOLF_GUIDE_SLUGS = new Set([
  "murcia-or-alicante-airport-the-honest-comparison-for-a-costa-calida-home",
  "driving-from-the-uk-ireland-or-the-netherlands-to-your-murcia-home",
  "can-you-fly-to-murcia-in-winter-every-route-that-runs-january-to-march-2026",
  "do-you-need-a-car-on-a-murcia-golf-resort-an-honest-answer",
  "healthcare-near-murcia-golf-resorts",
  "international-schools-near-murcia-golf-resorts",
  "why-is-golf-resort-property-in-murcia-such-good-value-2026",
  "murcia-vs-the-algarve-an-honest-comparison-for-retirement-buyers",
  "the-month-you-view-in-decides-what-you-buy-viewing-property-in-murcia-by-season",
  "is-murcia-a-good-place-to-invest-in-property-in-2026",
]);

export function getGuideForPost(slug: string, category: string | null): Guide {
  if (GOLF_GUIDE_SLUGS.has(slug) || category === "Lifestyle" || /golf|weather|winter|beach|padel/.test(slug)) {
    return GUIDES["golf-home-guide"];
  }
  return GUIDES["buyers-guide"];
}
