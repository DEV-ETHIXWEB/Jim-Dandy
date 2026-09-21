/**
 * City landing pages, rebuilt from the two the previous site ranked with:
 * /service-area/shoreline and /service-area/mountlake-terrace. Both were
 * substantial local-SEO pages (about 17,000 characters each) and were being
 * 301'd into the generic /service-area page, which throws away the local
 * ranking signal that matters most to a plumber.
 *
 * The copy is the business's own, adapted to house style. Anything specific to
 * a city - the neighbourhoods, the tree roots, the permitting authority - is
 * from that city's original page and must stay true to it: do not clone a page
 * for a new city by find-and-replacing the city name, because the local detail
 * is the entire reason these pages rank.
 */
export type CitySection = {
  title: string;
  body?: string[];
  bullets?: { label: string; text: string }[];
};

export type CityPage = {
  slug: string;
  city: string;
  /** Page <title> and meta description, carried over from the original page. */
  seoTitle: string;
  seoDescription: string;
  h1: string;
  /** Hero paragraph. The rest of the opening runs in `intro`. */
  lead: string;
  intro: string[];
  sections: CitySection[];
  why: { title: string; intro: string; points: { label: string; text: string }[] };
  faqs: { question: string; answer: string }[];
};

export const cityPages: CityPage[] = [
  {
    slug: "shoreline",
    city: "Shoreline",
    seoTitle: "Shoreline Plumber | Jim Dandy Sewer & Plumbing",
    seoDescription:
      "Licensed Shoreline plumbers since 1908. Tree-root drain cleaning, trenchless sewer repair, water heaters and 24/7 emergency service, priced upfront.",
    h1: "Plumber in Shoreline, WA",
    lead:
      "From the older neighborhoods near Aurora Avenue to the newer builds in Ballinger, Shoreline homes get a licensed local plumber with over a century behind them - and an upfront price before any work starts.",
    intro: [
      "We understand the challenges specific to Shoreline plumbing: aggressive tree roots in mature landscapes, aging sewer lines, and the need for high-efficiency systems in our Pacific Northwest climate.",
      "Whether you're facing a main line backup, need a modern tankless water heater, or require a sudden emergency response, our licensed plumbers provide fast, professional service with honest pricing and guaranteed workmanship.",
    ],
    sections: [
      {
        title: "Water Heater Repair and Installation",
        body: [
          "Shoreline families depend on consistent hot water, especially through the cool, damp months. If you're getting cold water, leaks, or strange noises, we'll diagnose it and give you a repair-or-replace recommendation you can actually act on.",
        ],
        bullets: [
          { label: "Traditional Units", text: "We service and install all gas and electric tank-style water heaters, restoring your home's hot water supply quickly." },
          { label: "Eco-Friendly Tankless", text: "For maximum efficiency and lower utility bills, we install tankless systems - endless hot water on demand while reducing energy use." },
        ],
      },
      {
        title: "Drain Cleaning Built for Shoreline's Tree Roots",
        body: [
          "The towering evergreens and mature landscaping that make Shoreline beautiful also create a perfect storm for drain blockages. Aggressive roots, heavy rainfall, and organic debris all work against your drain and sewer lines.",
        ],
        bullets: [
          { label: "Fast Clog Removal", text: "For everyday blockages from hair, soap, or food waste, professional snaking and mechanical augers clear the line and restore the fixture immediately." },
          { label: "High-Powered Hydro Jetting", text: "Pressurized water scours the pipe wall clean - grease, soap scum, hair, even minor root intrusion - with no chemicals." },
          { label: "Professional Rooter Service", text: "Specialized root-cutting equipment eliminates the stubborn root systems that have infiltrated aging pipe." },
        ],
      },
      {
        title: "24/7 Emergency Plumber Service",
        body: [
          "Plumbing emergencies never wait for a convenient time, which is why Jim Dandy keeps licensed, on-call plumbers ready around the clock for all of Shoreline. A burst pipe flooding a basement, a severe leak, any critical failure - our response team is trained and equipped to secure your property, diagnose the issue, and stabilize the situation fast.",
        ],
      },
      {
        title: "Sewer Repair and Trenchless Technology",
        body: [
          "Your sewer line is under constant pressure from Shoreline's mature tree roots and settling soil. As specialists in this field, we provide lasting repairs rather than repeat visits.",
        ],
        bullets: [
          { label: "Sewer Camera Inspection", text: "We pinpoint the exact issue - root intrusion, a crack, or a severe blockage - using non-invasive sewer scope video." },
          { label: "Trenchless Repair", text: "Pipe lining and pipe bursting repair or replace damaged lines with minimal digging, protecting the gardens and landscaping that make your home desirable." },
        ],
      },
      {
        title: "Comprehensive Plumbing for Shoreline Homes",
        bullets: [
          { label: "Toilet Repair and Installation", text: "Fast repair for running, leaking, or clogged toilets, plus installation of modern high-efficiency low-flow units." },
          { label: "Faucets, Fixtures & Disposals", text: "Persistent drips, worn-out fixtures, high-efficiency faucet upgrades, and garbage disposal replacement." },
          { label: "Sump Pumps", text: "A reliable defense against basement and crawlspace flooding when the PNW rain arrives - installation, repair, and service." },
          { label: "Water Softeners & Filtration", text: "Whole-home softeners and filtration to improve the quality, taste, and safety of your water." },
          { label: "Water Line Repair & Repiping", text: "Cost-effective whole-home repiping in modern, durable materials like PEX, protecting you from low pressure and poor water quality." },
        ],
      },
    ],
    why: {
      title: "Why Shoreline Trusts Jim Dandy",
      intro: "Choosing a plumber means choosing a partner you trust. Here's what over a century of local work gets you.",
      points: [
        { label: "Seattle's Original Plumbers, Established 1908", text: "We've handled every plumbing and sewer challenge specific to this region for over a century." },
        { label: "Upfront Pricing with No Surprises", text: "Clear, detailed quotes after diagnosis, so you know the full cost before work begins. Financing is available for larger jobs." },
        { label: "Committed to Eco-Friendly Solutions", text: "High-efficiency fixtures, tankless heaters, low-flow toilets and faucets, and chemical-free hydro-jetting for drain clearing." },
        { label: "Fully Licensed, Bonded & Insured", text: "Comprehensive protection and peace of mind for your property and your investment." },
        { label: "Permitting Experts", text: "We handle the permit applications and inspections the City of Shoreline requires on major projects, so you don't have to." },
      ],
    },
    faqs: [
      {
        question: "If I have an emergency, can I call Jim Dandy 24 hours a day?",
        answer:
          "Yes. Plumbing crises don't keep business hours, and neither do we. Jim Dandy provides 24/7 emergency plumbing service to Shoreline. Whether it's a burst pipe, a severe leak, or a main line backup, call us any time, day or night - our on-call plumbers are equipped to secure your property and stabilize the situation fast.",
      },
      {
        question: "Do you offer a warranty or guarantee on your plumbing and sewer work?",
        answer:
          "Yes. We back all of our repair and replacement projects with a comprehensive warranty on both labor and equipment. As a company established in 1908, we're committed to long-lasting, guaranteed solutions - the goal is complete peace of mind with the quality of your installation or repair.",
      },
      {
        question: "Does Shoreline require special permits for major plumbing work?",
        answer:
          "Yes. The City of Shoreline requires specific permits and inspections for major work such as sewer line repairs. We know the process is complicated, so we handle the permit application and inspection process with the city. That keeps your project fully compliant and takes the burden off you as the homeowner.",
      },
      {
        question: "How do I get a detailed estimate for plumbing service in Shoreline?",
        answer:
          "Book your service call by phone or online and a licensed technician comes out to assess the job. For smaller jobs we give you a clear service cost on the spot. For extensive projects like sewer repair or a water heater installation, we inspect thoroughly and give you a detailed, upfront estimate for the complete scope of work. Once you approve it, we secure any necessary permits and begin.",
      },
    ],
  },
  {
    slug: "mountlake-terrace",
    city: "Mountlake Terrace",
    seoTitle: "Mountlake Terrace Plumber | Plumbing Services | Jim Dandy",
    seoDescription:
      "Your local Mountlake Terrace plumber since 1908. Water heaters, drain cleaning, sewer repair, repiping and 24/7 emergency service, priced upfront.",
    h1: "Mountlake Terrace Plumber",
    lead:
      "We're headquartered right here in Mountlake Terrace. When a plumbing crisis hits your home, you get a local company that can respond immediately - with upfront, honest pricing before any work begins.",
    intro: [
      "For over a century, Jim Dandy Sewer and Plumbing has been the reliable choice for plumbing repair and service in the Mountlake Terrace community.",
      "A running toilet, a faulty water heater, or a sudden leak that needs a 24/7 emergency response - our licensed plumbers are ready with fast, professional service across the entire community.",
    ],
    sections: [
      {
        title: "Water Heater Repair and Replacement",
        body: [
          "Cold water, leaks, or strange noises mean it's time to call. We service and install all traditional tank-style units, gas and electric, to restore your hot water quickly and safely.",
          "For homeowners looking for maximum efficiency and savings, we also install tankless water heaters for endless hot water on demand. Either way you get transparency about what your unit actually needs.",
        ],
      },
      {
        title: "Professional Drain Cleaning Services",
        body: [
          "Don't let slow drains or recurring clogs frustrate you. We clear blockages in sinks, showers, toilets, and main line drains using the most effective technology available - high-powered hydro-jetting to blast away stubborn grease, soap scum, and hair, and professional snaking to restore clear, full flow before a minor clog becomes a major backup.",
        ],
      },
      {
        title: "24/7 Emergency Plumber",
        body: [
          "Jim Dandy keeps licensed, on-call plumbers ready 24/7 for all of Mountlake Terrace. A burst pipe flooding your basement, a main line water leak, any critical plumbing failure - our technicians are trained and equipped to respond immediately, secure your property, and diagnose the issue.",
        ],
      },
      {
        title: "Sewer Repair and Replacement",
        body: [
          "The sewer line is the most critical and complex part of your home's plumbing infrastructure, and our solutions are tailored to local soil and infrastructure conditions.",
          "We start with an accurate sewer scope video inspection to pinpoint the exact issue - root intrusion, a crack, or a severe blockage. Then we use non-invasive methods like trenchless repair and pipe bursting to fix or replace the line with minimal disruption to your yard.",
        ],
      },
      {
        title: "Comprehensive Plumbing Services",
        body: [
          "Beyond the specialties above, our licensed local team handles every component of your home's water system - a simple fixture repair, a complex upgrade, or routine preventative maintenance.",
        ],
        bullets: [
          { label: "Toilet Repair and Installation", text: "Constantly running, leaking at the base, or frequently clogging - we service all makes and models, and install high-efficiency low-flow upgrades." },
          { label: "Faucets, Fixtures & Garbage Disposals", text: "Kitchen and bathroom sinks, shower valves, hose bibs, and disposals that are jammed or past replacing." },
          { label: "Water Line Repair & Whole-Home Repiping", text: "Replacing old, corroding pipe with modern PEX, and repairing the water line from the street to your home." },
          { label: "Sump Pump Installation & Repair", text: "Heavy rainfall and a high water table make a reliable sump pump critical - we install, replace, maintain, and repair them." },
          { label: "Water Softeners and Filtration", text: "Whole-home softeners to fight hard water scale, and filtration to remove contaminants and unpleasant odors." },
        ],
      },
    ],
    why: {
      title: "The Jim Dandy Guarantee: Local Authority Since 1908",
      intro: "Choosing a plumber means trusting them with one of your home's most essential systems.",
      points: [
        { label: "Mountlake Terrace's Longest-Standing Authority", text: "Operating since 1908, we've handled every plumbing challenge specific to this region's climate, soil, and aging infrastructure - right here in the community." },
        { label: "Permitting Expertise", text: "For major projects like a water line replacement, we manage the permit applications and inspections required in the Mountlake Terrace area on your behalf." },
        { label: "Guaranteed Workmanship", text: "We back all of our repair and replacement projects with a comprehensive warranty." },
        { label: "Protection and Peace of Mind", text: "Fully licensed, bonded, and insured, with comprehensive protection for your property and investment." },
        { label: "Transparent Pricing & Financing", text: "Clear, upfront pricing after inspection, plus financing options so necessary work can start immediately." },
      ],
    },
    faqs: [
      {
        question: "How do I get a detailed estimate for my plumbing service?",
        answer:
          "Book your service call by phone or online and a licensed technician comes to your Mountlake Terrace property to assess the job. For smaller jobs we give you a clear service cost upfront after diagnosis. For extensive projects like sewer repair, repiping, or a water heater installation, we inspect thoroughly and give you a detailed, upfront estimate for the complete scope of work. Once you approve it, we secure any necessary permits and begin.",
      },
      {
        question: "Does Mountlake Terrace require special permits for major plumbing work?",
        answer:
          "Yes. Mountlake Terrace requires specific permits and inspections for major work including sewer line repairs, new water line installations, and certain water heater or repiping projects, to ensure compliance with local building codes. We handle the entire permit application and inspection process with the city on your behalf.",
      },
      {
        question: "If I have an emergency, can I call Jim Dandy 24 hours a day?",
        answer:
          "Yes. Plumbing crises don't keep business hours, and neither do we. Jim Dandy provides 24/7 emergency plumbing service to the Mountlake Terrace area. Whether it's a burst pipe, a severe leak, or a main line backup, you can call any time - day or night - and our on-call plumbers will secure your property and stabilize the situation fast.",
      },
      {
        question: "Is Jim Dandy fully licensed and insured to work in Mountlake Terrace, WA?",
        answer:
          "Absolutely. Jim Dandy is a fully licensed, bonded, and insured plumbing company and contractor in the state of Washington. We maintain the certifications and insurance required to perform plumbing, sewer, and water line services safely and legally within the city limits. Choosing a properly insured contractor means comprehensive protection for your property and investment.",
      },
    ],
  },
];

export function findCityPage(slug: string) {
  return cityPages.find((c) => c.slug === slug);
}
