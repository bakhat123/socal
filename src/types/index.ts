// Centralized types for the admin panel

export interface User {
  _id?: string
  id?: string
  email: string
  role?: string
  createdAt: string
  status?: string
}

export interface Blog {
  _id?: string
  slug: string
  title: string
  subtitle?: string
  category: string
  author: {
    name: string
    title: string
    avatar: string
    bio: string
    url?: string
  }
  date: string
  readTime: string
  featured: boolean
  heroImage: string
  heroImageAlt: string
  canonicalUrl: string
  language: string
  city: string
  topic: string
  keyword: string
  group_id: number
  seo: {
    metaTitle: string
    metaDescription: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterCard?: string
  }
  hreflang_tags: Array<{
    hreflang: string
    href: string
  }>
  internal_links: Array<{
    href: string
    anchor: string
    context?: string
  }>
  schema_markup?: object
  images: Array<{
    url: string
    alt: string
    local_path: string
  }>
  word_count: number
  ctaSection: {
    title: string
    subtitle?: string
    ctaText: string
    ctaLink: string
  }
  content: {
    lead: string
    sections: Array<{
      title: string
      content: string
      quote?: {
        text: string
        author: string
      }
      additional?: string
      subsections?: Array<{
        title: string
        content: string
      }>
    }>
  }
  status?: string
  views?: number
  likes?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface City {
  _id?: string
  id?: string
  slug: string
  name: string
  state: string
  language?: string
  shortDescription: string
  fullDescription?: string
  heroImage?: string
  heroImageAlt?: string
  population: string
  avgHomePrice: string
  tags: string[]
  neighborhoods: Array<{
    name: string
    type: 'neighborhood' | 'city'
    slug: string
    description: string
    image: string
    imageAlt?: string
    distance: string
    avgHomePrice: string
    county: string
  }>

  highlights: Array<{
    title: string
    description: string
    icon: string
    bgImage: string
    bgImageAlt?: string
  }>
  faqs: Array<{
    question: string
    answer: string
    category: string
  }>
  clients?: Array<{
    name: string
    description: string
    image: string
    imageAlt?: string
    rating: number
    review: string
  }>
  canonicalUrl?: string
  hreflang_tags?: Array<{
    hreflang: string
    href: string
  }>
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogImageAlt?: string
    twitterCard?: string
  }
  schema_markup?: object[]
  internal_links?: Array<{
    href: string
    anchor: string
    context?: string
  }>

  city?: string
  county?: string
  url_slug?: string
  meta_title?: string
  meta_description?: string
  h1_title?: string
  primary_keywords?: string[]
  secondary_keywords?: string[]
  express_keywords?: string[]
  agent_keywords?: string[]
  landing_page_text?: string
  express_service?: string
  neighborhood_guide?: string
  market_analysis?: string
  agent_name?: string
  company_name?: string
  contact_phone?: string
  contact_email?: string
  cta_text?: string
  bgImage?: string
  bgImageAlt?: string

}

export interface DashboardStats {
  users: number
  cities: number
  blogs: number
}

export interface HomeSection {
  id: string
  title: string
  subtitle: string
  backgroundImage?: string
  stats?: {
    number: string
    label: string
  }[]
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export interface HomeData {
  hero: {
    badge: string
    title: string
    subtitle: string
    viewProperties: string
    contactUs: string
    scrollDown: string
    backgroundImage?: string
  }
  stats: {
    yearsExperience: string
    yearsExperienceLabel: string
    billionInSales: string
    billionInSalesLabel: string
    countriesServed: string
    countriesServedLabel: string
    clientSatisfaction: string
    clientSatisfactionLabel: string
  }
  services: {
    title: string
    subtitle: string
    propertyAcquisition: {
      title: string
      description: string
      icon: string
    }
    investmentAdvisory: {
      title: string
      description: string
      icon: string
    }
    relocationServices: {
      title: string
      description: string
      icon: string
    }
  }
  cities?: {
    title: string
    subtitle: string
  }
  blog?: {
    title: string
    subtitle: string
  }
  testimonials: {
    title: string
    subtitle: string
    items: Array<{
      id: string
      quote: string
      author: string
      rating: number
      image: string
    }>
  }
  cta: {
    title: string
    text: string
    button: string
  }
}

export interface ContactData {
  hero: {
    profileStatus: string
    profileCompany: string
    profileTitle: string
    profileBadges: {
      topProducer: string
      fiveStarRated: string
    }
    recentSales: {
      title: string
      seeAll: string
      sold: string
      properties: Array<{
        address: string
        price: string
        year: string
        imageUrl: string
      }>
    }
  }
  form: {
    header: {
      badge: string
      title: string
      subtitle: string
    }
    fields: {
      name: {
        label: string
        placeholder: string
        required: string
      }
      phone: {
        label: string
        placeholder: string
        required: string
      }
      email: {
        label: string
        placeholder: string
        required: string
      }
      message: {
        label: string
        placeholder: string
        required: string
      }
    }
    consent: {
      title: string
      text: string
    }
    submit: {
      sending: string
      send: string
    }
    footer: {
      responseTime: string
    }
  }
  info: {
    description: {
      title: string
      subtitle: string
      text1: string
      text2: string
      text3: string
    }
    specialties: {
      title: string
      tags: string[]
      languages: string
    }
  }
  author: {
    name: string
    photo: string
  }
  newProperty?: {
    address: string
    price: string
    year: string
    imageUrl: string
  }
}
