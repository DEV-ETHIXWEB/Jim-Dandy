export const business = {
  name: "Jim Dandy Sewer & Plumbing",
  shortName: "Jim Dandy",
  phone: "(206) 633-1141",
  phoneHref: "tel:+12066331141",
  email: "Contact@JimDandySewer.com",
  address: {
    line1: "6202 214th St SW",
    line2: "Mountlake Terrace, WA 98043",
    full: "6202 214th St SW, Mountlake Terrace, WA 98043, United States",
  },
  hours: "Mon–Fri 7am–7pm · 24/7 Emergency",
  founded: 1908,
  yearsInBusiness: new Date().getFullYear() - 1908,
  licenses: ["JIMDADE791MG", "JIMDADS879B3"],
  rating: { value: 4.8, count: 177 },
  scheduleUrl: "/contact",
  financingUrl: "/coupons",
  social: {
    facebook: "https://www.facebook.com/",
    google: "https://share.google/L2jpUnfSMJK7ZRCk8",
    x: "https://x.com/",
  },
} as const;

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string; description: string }[];
};

export const services = [
  {
    slug: "emergency",
    label: "Emergency",
    icon: "alert-triangle",
    description: "Burst pipes, floods, and sewer backups - live dispatch 24/7.",
    intro:
      "A burst pipe or sewage backup doesn't wait for business hours, and neither do we. A real dispatcher answers day or night and gets a licensed tech routed to your door - most calls seen the same day, emergencies within the hour.",
    benefits: [
      "24/7 live phone dispatch - no answering machines",
      "Emergency techs stocked to fix most issues on the first visit",
      "Upfront pricing quoted before any work begins",
      "Water shut-off and damage-control guidance the moment you call",
    ],
    signs: [
      "A burst or actively leaking pipe",
      "Sewage backing up into a tub, sink, or floor drain",
      "No water pressure anywhere in the house",
      "Water heater leaking or making popping/banging noises",
    ],
  },
  {
    slug: "drains-clogs",
    label: "Drains & Clogs",
    icon: "filter",
    description: "Fast, camera-verified drain clearing that actually lasts.",
    intro:
      "Slow or backed-up drains are almost never just a surface clog. We clear the line and then run a camera to confirm the real cause is gone - not just pushed further down the pipe - so the same drain doesn't back up again in a month.",
    benefits: [
      "Camera inspection included on repeat or stubborn clogs",
      "Hydro-jetting for grease, roots, and scale buildup",
      "Kitchen, bathroom, floor, and main line drains",
      "Same-day appointments available",
    ],
    signs: [
      "Water draining slowly in a sink, tub, or shower",
      "Gurgling sounds from drains or toilets",
      "Recurring clogs in the same fixture",
      "Sewer odor near a floor drain or cleanout",
    ],
  },
  {
    slug: "sewer-services",
    label: "Sewer Services",
    icon: "search",
    description: "Trenchless repair, replacement, and video inspection.",
    intro:
      "Sewer line problems used to mean tearing up the yard. In most cases we can now diagnose with a video camera and repair or fully replace the line trenchlessly - less mess, less time, and no re-landscaping bill on top of the plumbing bill.",
    benefits: [
      "Video camera inspection with footage shown to you before any work",
      "Trenchless pipe lining and pipe bursting where the site allows",
      "Root intrusion, bellies, and collapsed pipe repair",
      "Coordination with the city on permits and locates",
    ],
    signs: [
      "Multiple drains backing up at the same time",
      "Sewage smell in the yard or basement",
      "Unusually lush or soggy patches of lawn",
      "Toilets gurgling when the washing machine drains",
    ],
  },
  {
    slug: "water-heaters",
    label: "Water Heaters",
    icon: "flame",
    description: "Tank and tankless install, repair, and replacement.",
    intro:
      "From a same-day tank swap to a full tankless conversion, we size the unit to your household and install it to code - then walk you through the warranty and maintenance so it actually lasts as long as it's rated for.",
    benefits: [
      "Tank and tankless install, repair, and replacement",
      "Same-day replacement for most standard tank units",
      "Gas, electric, and hybrid heat-pump systems",
      "Manufacturer warranty registration handled for you",
    ],
    signs: [
      "Lukewarm water or running out of hot water fast",
      "Rusty or metallic-tasting hot water",
      "Popping, rumbling, or banging from the tank",
      "Water pooling at the base of the water heater",
    ],
  },
  {
    slug: "all-plumbing",
    label: "All Plumbing",
    icon: "wrench",
    description: "Leaks, fixtures, repiping - the full-service list.",
    intro:
      "Not every plumbing job is an emergency - sometimes it's a leaky faucet, a fixture install, or a repipe you've been putting off. Our licensed techs handle the full range of residential plumbing with the same upfront pricing and workmanship guarantee.",
    benefits: [
      "Faucet, toilet, and fixture installs or repairs",
      "Whole-home and partial repiping",
      "Leak detection and slab leak repair",
      "Gas line inspection, repair, and installation",
    ],
    signs: [
      "A dripping faucet or running toilet",
      "Low water pressure at one or more fixtures",
      "Visible corrosion on exposed pipes",
      "Planning a remodel that touches plumbing",
    ],
  },
  {
    slug: "commercial",
    label: "Commercial",
    icon: "building-2",
    description: "Scheduled maintenance and emergency response for businesses.",
    intro:
      "Downtime costs money. We work with property managers, restaurants, and multi-family buildings on scheduled maintenance plans and back them with the same 24/7 emergency response we offer residential customers - so a plumbing issue never turns into a closed sign.",
    benefits: [
      "Preventive maintenance contracts for multi-unit properties",
      "Grease trap, backflow, and code-compliance service",
      "Priority emergency response for commercial accounts",
      "Detailed invoicing for property management and accounting",
    ],
    signs: [
      "Recurring drain or grease trap backups",
      "An upcoming backflow or code inspection",
      "Aging plumbing in a building you manage",
      "Need for an after-hours service contract",
    ],
  },
] as const;

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      label: s.label,
      href: `/services/${s.slug}`,
      description: s.description,
    })),
  },
  { label: "Commercial", href: "/commercial" },
  { label: "Coupons", href: "/coupons" },
  { label: "Service Area", href: "/service-area" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerServiceLinks = [
  { label: "Emergency", href: "/services/emergency" },
  { label: "Drains & Clogs", href: "/services/drains-clogs" },
  { label: "Sewer Services", href: "/services/sewer-services" },
  { label: "Water Heaters", href: "/services/water-heaters" },
  { label: "All Plumbing", href: "/services/all-plumbing" },
  { label: "Commercial", href: "/commercial" },
];

export const footerSitemapLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Commercial", href: "/commercial" },
  { label: "Coupons", href: "/coupons" },
  { label: "Service Area", href: "/service-area" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const howItWorks = [
  {
    step: "1",
    title: "Call or Schedule Online",
    description: "Tell us what's happening. Same-day booking for emergencies.",
  },
  {
    step: "2",
    title: "We Diagnose & Quote Upfront",
    description: "A licensed tech assesses the problem and gives you a price before touching anything.",
  },
  {
    step: "3",
    title: "Problem Solved",
    description: "We fix it right. No surprise bills. That's been our standard since 1908.",
  },
] as const;

export const reviews = [
  {
    name: "Aleen Pineda",
    timeAgo: "7 months ago",
    rating: 5,
    text: "The team at Jim Dandy were super! I got my issues corrected before winter and 100% would recommend them. Jeremy did a great job, was kind, communicative, and very knowledgeable!",
  },
  {
    name: "Marcus Webb",
    timeAgo: "3 months ago",
    rating: 5,
    text: "Called at 11pm with a burst pipe and had a tech at the door within the hour. Upfront pricing, no games. This is who I'm calling from now on.",
  },
  {
    name: "Priya Shah",
    timeAgo: "1 month ago",
    rating: 5,
    text: "Replaced our water heater same day. Clean work, explained everything, and the price matched the quote exactly. Genuinely great experience.",
  },
  {
    name: "David Ortiz",
    timeAgo: "5 months ago",
    rating: 5,
    text: "Sewer line inspection and trenchless repair - they showed me the camera footage before recommending anything. Zero pressure, honest assessment.",
  },
  {
    name: "Hannah Lee",
    timeAgo: "2 weeks ago",
    rating: 5,
    text: "118 years in business shows. Professional from the first call to the final invoice. Highly recommend Jim Dandy for anything plumbing related.",
  },
] as const;

export const serviceAreaCities = [
  "Seattle",
  "Bellevue",
  "Redmond",
  "Kirkland",
  "Renton",
  "Tacoma",
  "Burien",
  "Mountlake Terrace",
  "Shoreline",
  "Everett",
  "Edmonds",
  "Lynnwood",
  "Bothell",
  "Federal Way",
  "Auburn",
  "Kent",
];

export const faqs = [
  {
    question: "Do you offer 24/7 emergency plumbing service?",
    answer:
      "Yes. A real dispatcher answers any hour of the day, and we send a licensed technician out the same day for burst pipes, sewer backups, and other urgent issues - nights, weekends, and holidays included.",
  },
  {
    question: "Are your plumbers licensed, bonded, and insured?",
    answer:
      "Every technician is a licensed Washington State plumber, and Jim Dandy carries full bonding and insurance. Our license numbers are posted in the footer of every page - feel free to verify them with the state.",
  },
  {
    question: "How much will my repair cost?",
    answer:
      "We diagnose the problem on-site and give you flat-rate, upfront pricing before any work begins. You'll never be billed by the hour or surprised by the final invoice.",
  },
  {
    question: "Do you offer financing?",
    answer:
      "Yes. Approved customers can finance larger repairs and installations - water heaters, sewer replacement, and repiping - with flexible monthly payment plans. Ask your technician or use the \"Get Financed\" link to apply.",
  },
  {
    question: "What areas do you service?",
    answer:
      "We dispatch same-day across the Puget Sound region, including Seattle, Bellevue, Redmond, Kirkland, Renton, Tacoma, and the surrounding King, Snohomish, and Pierce County communities. See our full service area for the complete list.",
  },
  {
    question: "Is your work guaranteed?",
    answer:
      "Yes. Every repair is backed by our workmanship guarantee - if something isn't right after we leave, call us and we'll make it right at no extra charge.",
  },
] as const;

export const certifications = [
  { label: "Accredited Business", org: "BBB" },
  { label: "Angi Super Service Award", org: "2024" },
  { label: "PHCC Member", org: "PHCC" },
  { label: "Accredited Business", org: "BBB" },
];
