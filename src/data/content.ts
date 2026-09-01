// src/data/content.ts

export interface ServiceItem {
  id: string;
  name: string;
  summary: string;
  image: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  image: string;
}

export interface ProcessStep {
  title: string;
  detail: string;
}

export interface SiteContent {
  company: {
    name: string;
    fullName: string;
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    hours: string;
    social: {
      instagram: string;
      facebook: string;
      linkedin: string;
    };
  };
  nav: Array<{ label: string; href: string }>;
  hero: {
    videoSrc: string;
    posterSrc: string;
    eyebrow: string;
    headline?: string;
    headlinePrefix: string;
    rotatingWords: string[];
    subhead: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    stats: Array<{ value: string; label: string }>;
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    stats: Array<{ value: string; label: string }>;
    images: string[];
  };
  services: {
    eyebrow: string;
    heading: string;
    subhead: string;
    items: ServiceItem[];
  };
  portfolio: {
    eyebrow: string;
    heading: string;
    subhead: string;
    filters: string[];
    projects: PortfolioProject[];
  };
  process: {
    eyebrow: string;
    heading: string;
    steps: ProcessStep[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    subhead: string;
    projectTypes: string[];
    formEndpoint: string;
  };
  interestModal: {
    heading: string;
    subhead: string;
    formEndpoint: string;
  };
  footer: {
    tagline: string;
    copyrightName: string;
  };
}

export const SITE_CONTENT: SiteContent = {
  company: {
    name: "Swanlake Machinery",
    fullName: "Swanlake Machinery Ltd.",
    phone: "",
    phoneHref: "",
    email: "joeyoung30@gmail.com",
    address: "202 Japka Road, Effurun, Warri, Delta State",
    hours: "",
    social: {
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      linkedin: "https://linkedin.com/"
    }
  },

  nav: [
    { label: "Fleet", href: "#portfolio" },
    { label: "Equipment", href: "#services" },
    { label: "About", href: "#about" },
    { label: "How it works", href: "#process" },
    { label: "Contact", href: "#contact" }
  ],

  hero: {
    videoSrc: "/hero-loop.mp4",
    posterSrc: "/hero-poster.jpg",
    eyebrow: "Effurun, Warri — Delta State",
    headlinePrefix: "Heavy machinery,",
    rotatingWords: [
      "ready when your site is.",
      "delivered directly on time.",
      "serviced for peak power.",
      "built for Niger Delta terrain."
    ],
    subhead: "Swanlake Machinery Ltd. leases excavators, cranes, generators, and site equipment across the Niger Delta region, with operators available on request.",
    ctaPrimary: { label: "View equipment", href: "#portfolio" },
    ctaSecondary: { label: "Request a lease", href: "#contact" },
    stats: [
      { value: "—", label: "Machines in fleet" },
      { value: "—", label: "Years leasing" },
      { value: "24/7", label: "Breakdown support" }
    ]
  },

  about: {
    eyebrow: "About us",
    heading: "Machinery leasing built around your site schedule.",
    paragraphs: [
      "Swanlake Machinery Ltd. supplies and leases heavy equipment to construction, marine, and industrial sites across Effurun, Warri, and the wider Delta State region.",
      "Every machine in our fleet is serviced and inspected before it leaves our yard, and we can supply a trained operator alongside the equipment if your crew needs one.",
      "We work on short-term and long-term lease terms, and we'll tell you plainly which machine actually fits your job rather than whatever happens to be free that week."
    ],
    stats: [
      { value: "—", label: "Machines in fleet" },
      { value: "—", label: "Years in operation" },
      { value: "—", label: "Sites served" },
      { value: "—", label: "Operators on call" }
    ],
    images: [
      "/images/about-1.jpg",
      "/images/about-2.jpg",
      "/images/about-3.jpg"
    ]
  },

  services: {
    eyebrow: "What we lease",
    heading: "Equipment categories",
    subhead: "Browse by category below, or tell us the job and we'll recommend the right machine. Every category can be leased with or without an operator.",
    items: [
      {
        id: "excavators",
        name: "Excavators",
        summary: "Mini to standard-reach excavators for digging, grading, and demolition work.",
        image: "/images/service-residential.jpg"
      },
      {
        id: "cranes",
        name: "Cranes & Lifting",
        summary: "Mobile cranes and lifting equipment for structural, marine, and industrial loads.",
        image: "/images/service-commercial.jpg"
      },
      {
        id: "generators",
        name: "Generators",
        summary: "Site power generation, from small backup units to full-site prime power.",
        image: "/images/service-renovation.jpg"
      },
      {
        id: "loaders-graders",
        name: "Loaders & Graders",
        summary: "Wheel loaders and motor graders for site clearing, grading, and material handling.",
        image: "/images/service-designbuild.jpg"
      },
      {
        id: "compaction",
        name: "Compaction Equipment",
        summary: "Rollers and plate compactors for road base, foundation, and asphalt work.",
        image: "/images/service-pm.jpg"
      },
      {
        id: "operators",
        name: "Operator-Supplied Leasing",
        summary: "Any machine above, leased together with a qualified, insured operator.",
        image: "/images/service-sitedev.jpg"
      }
    ]
  },

  portfolio: {
    eyebrow: "Our fleet",
    heading: "Equipment available now",
    subhead: "A sample of machines currently in the fleet. Filter by category, or get in touch to check availability for a specific job date.",
    filters: ["All", "Excavators", "Cranes", "Generators", "Loaders"],
    projects: [
      {
        id: "proj-01",
        title: "20-Tonne Excavator",
        category: "Excavators",
        location: "Effurun yard",
        year: "Available",
        summary: "Standard-reach excavator suited to foundation digging and general earthworks.",
        image: "/images/project-01.jpg"
      },
      {
        id: "proj-02",
        title: "Mobile Crane — 25T",
        category: "Cranes",
        location: "Effurun yard",
        year: "Available",
        summary: "Mobile crane for structural steel, precast, and marine lifting jobs.",
        image: "/images/project-02.jpg"
      },
      {
        id: "proj-03",
        title: "Prime Power Generator — 150kVA",
        category: "Generators",
        location: "Effurun yard",
        year: "Available",
        summary: "Diesel generator suited to full-site prime power on longer leases.",
        image: "/images/project-03.jpg"
      },
      {
        id: "proj-04",
        title: "Mini Excavator — 3T",
        category: "Excavators",
        location: "Effurun yard",
        year: "Available",
        summary: "Compact excavator for tight-access sites and smaller trenching jobs.",
        image: "/images/project-04.jpg"
      },
      {
        id: "proj-05",
        title: "Wheel Loader — 3m³",
        category: "Loaders",
        location: "Effurun yard",
        year: "Available",
        summary: "Wheel loader for material handling, stockpiling, and site clearing.",
        image: "/images/project-05.jpg"
      },
      {
        id: "proj-06",
        title: "Backup Generator — 60kVA",
        category: "Generators",
        location: "Effurun yard",
        year: "Available",
        summary: "Smaller backup unit suited to site offices and short-term power gaps.",
        image: "/images/project-06.jpg"
      }
    ]
  },

  process: {
    eyebrow: "How leasing works",
    heading: "Four steps to get machinery on site",
    steps: [
      { title: "Tell us the job", detail: "Share the type of work, site access, and how long you'll need the machine for." },
      { title: "We confirm the right machine", detail: "We match you to the right equipment and quote a lease rate, with or without an operator." },
      { title: "Delivery & handover", detail: "The machine is delivered, inspected on-site with you, and handed over ready to run." },
      { title: "Support through the lease", detail: "We handle servicing and breakdown support for the full length of your lease." }
    ]
  },

  contact: {
    eyebrow: "Get in touch",
    heading: "Request a machine for your site",
    subhead: "Tell us what you need and roughly when — we'll reply by email to confirm availability and rates.",
    projectTypes: [
      "Excavators",
      "Cranes & Lifting",
      "Generators",
      "Loaders & Graders",
      "Compaction Equipment",
      "Operator-Supplied Leasing",
      "Not sure yet"
    ],
    formEndpoint: "https://api.web3forms.com/submit"
  },

  interestModal: {
    heading: "Express interest",
    subhead: "Tell us a little about your job and which equipment you're asking about. We'll follow up by email.",
    formEndpoint: "https://api.web3forms.com/submit"
  },

  footer: {
    tagline: "Machinery leasing across the Niger Delta.",
    copyrightName: "Swanlake Machinery Ltd."
  }
};