"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Edit3, 
  Menu, 
  Search, 
  Bell, 
  Settings,
  Eye,
  Heart,
  User as UserIcon,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Home,
  Clock
} from "lucide-react"

// Import admin CSS files
import "@/styles/Admin/admin_navbar.css"
import "@/styles/Admin/admin_components.css"
import "@/styles/Admin/admin_page.css"
import "@/styles/Admin/admin_footer.css"

// Import types
import { User, Blog, City, DashboardStats, HomeSection, Toast, HomeData, ContactData } from "@/types"

// Import components
import Header from "@/components/admin/Header"
import Dashboard from "@/components/admin/Dashboard"
import UserManager from "@/components/admin/UserManager"
import CityManager from "@/components/admin/CityManager"
import BlogManager from "@/components/admin/BlogManager"
import HomeManager from "@/components/admin/HomeManager"
import ContactManager from "@/components/admin/ContactManager"
import UserModal from "@/components/admin/UserModal"
import { ToastContainer } from "@/components/admin/Toast"
import AdminNavbar from "@/components/admin/AdminNavbar"
import AdminFooter from "@/components/admin/AdminFooter"

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [showCityModal, setShowCityModal] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editingBlog, setEditingBlog] = useState<string | null>(null)
  const [editingCity, setEditingCity] = useState<string | null>(null)
  
  // Data states
  const [users, setUsers] = useState<User[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [filteredCities, setFilteredCities] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>>([])
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    cities: 0,
    blogs: 0
  })
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Home data
  const [homeData, setHomeData] = useState<HomeData>({
    hero: {
      badge: 'Premium Destination',
      title: 'Discover the Magic of',
      subtitle: 'Experience luxury living in the most prestigious locations across Southern California',
      viewProperties: 'View Properties',
      contactUs: 'Contact Us',
      scrollDown: 'Scroll Down',
      backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'
    },
    stats: {
      yearsExperience: '25+',
      yearsExperienceLabel: 'Years Experience',
      billionInSales: '$2.5B+',
      billionInSalesLabel: 'Billion in Sales',
      countriesServed: '500+',
      countriesServedLabel: 'Properties Sold',
      clientSatisfaction: '98%',
      clientSatisfactionLabel: 'Client Satisfaction'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive real estate solutions tailored to your needs',
      propertyAcquisition: {
        title: 'Luxury Real Estate',
        description: 'Exclusive properties in the most prestigious neighborhoods',
        icon: '🏠'
      },
      investmentAdvisory: {
        title: 'Investment Properties',
        description: 'Strategic investment opportunities with high returns',
        icon: '💰'
      },
      relocationServices: {
        title: 'Property Management',
        description: 'Professional management services for property owners',
        icon: '🔧'
      }
    },
    cities: {
      title: 'Explore California Cities',
      subtitle: 'Discover the most desirable locations across the Golden State, each offering unique lifestyle opportunities and investment potential.'
    },
    blog: {
      title: 'Latest Insights',
      subtitle: 'Discover our expert perspectives on luxury real estate markets worldwide.'
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Trusted by thousands of satisfied clients',
      items: [
        {
          id: 't1',
          quote: 'SoCal Prime Homes helped us find our dream home in Beverly Hills. The service was exceptional!',
          author: 'Sarah Johnson',
          rating: 5,
          image: '/testimonials/client1.jpg'
        },
        {
          id: 't2',
          quote: 'Professional, reliable, and truly understands the luxury market. Highly recommended!',
          author: 'Michael Chen',
          rating: 5,
          image: '/testimonials/client2.jpg'
        },
        {
          id: 't3',
          quote: 'Outstanding experience from start to finish. They made the entire process seamless.',
          author: 'Emily Rodriguez',
          rating: 5,
          image: '/testimonials/client3.jpg'
        }
      ]
    },
    cta: {
      title: 'Ready to Find Your Dream Home?',
      text: 'Let our experts guide you to the perfect property in Southern California',
      button: 'Get Started'
    }
  })
  
  // Home data locale state
  const [homeDataLocale, setHomeDataLocale] = useState<string>('en')

  // Contact data state
  const [contactData, setContactData] = useState<ContactData>({
    hero: {
      profileStatus: "Available Now",
      profileCompany: "eXp of California",
      profileTitle: "Lead of Crown Coastal Concierge",
      profileBadges: {
        topProducer: "Top Producer",
        fiveStarRated: "5-Star Rated"
      },
      recentSales: {
        title: "Recent Sales",
        seeAll: "See All",
        sold: "Sold",
        properties: [
          {
            address: "1234 Ocean View Dr, La Jolla",
            price: "$2,450,000",
            year: "2024",
            imageUrl: "/raza.jpg"
          },
          {
            address: "5678 Coastal Blvd, Del Mar",
            price: "$1,890,000",
            year: "2024",
            imageUrl: "/raza.jpg"
          },
          {
            address: "9012 Sunset Cliffs Rd, Point Loma",
            price: "$3,120,000",
            year: "2023",
            imageUrl: "/raza.jpg"
          },
          {
            address: "3456 Pacific Coast Hwy, Encinitas",
            price: "$2,850,000",
            year: "2023",
            imageUrl: "/raza.jpg"
          }
        ]
      }
    },
    form: {
      header: {
        badge: "Ready to Connect",
        title: "Contact Crown Coastal Concierge",
        subtitle: "Ready to start your real estate journey? Get in touch today and let's discuss your dream property in San Diego."
      },
      fields: {
        name: {
          label: "Full Name",
          placeholder: "Enter your full name",
          required: "*"
        },
        phone: {
          label: "Phone Number",
          placeholder: "Enter your phone number",
          required: "*"
        },
        email: {
          label: "Email Address",
          placeholder: "Enter your email address",
          required: "*"
        },
        message: {
          label: "Message",
          placeholder: "Tell us about your real estate needs, preferred locations, budget, and any specific requirements...",
          required: "*"
        }
      },
      consent: {
        title: "Privacy & Consent",
        text: "By submitting your information, you agree that the real estate professional identified above may call/text you about your search, which may involve use of automated means and pre-recorded/artificial voices. You don't need to consent as a condition of buying any property, goods, or services. Message/data rates may apply. You also agree to our Terms of Use."
      },
      submit: {
        sending: "Sending Message...",
        send: "Send Message"
      },
      footer: {
        responseTime: "We typically respond within 2 hours during business hours"
      }
    },
    info: {
      description: {
        title: "Get to know Crown Coastal Concierge",
        subtitle: "Real Estate Professional",
        text1: "With a journey that has taken him across 32 countries and over a hundred cities, Reza brings a world of experience and a unique global perspective to San Diego's real estate market. He firmly believes there's no place like San Diego, with its unparalleled coastal lines, vibrant cityscape, and endless adventures.",
        text2: "Utilizing 17 years of client management & negotiation expertise, Reza has perfected the art of understanding his clients' needs and exceeding their expectations. But it's not just about transactions for him. Whether guiding sellers to maximize their home's value or helping buyers find their dream property, Reza's true passion lies in scoring big for his clients.",
        text3: "Beyond real estate, Reza is deeply embedded in the fabric of the San Diego community. He's championed righteous causes through grassroots petitions, actively participated in beach clean-ups, and tirelessly worked to uplift underserved communities via various government-subsidized programs. For Reza, real estate isn't just business—it's a platform to further serve and enrich the community he cherishes most."
      },
      specialties: {
        title: "Specialties",
        tags: [
          "Buyer's Agent",
          "Listing Agent",
          "Relocation",
          "Vacation / Short-term Rentals"
        ],
        languages: "Speaks: English, Arabic, Farsi, Turkish"
      }
    },
    author: {
      name: "Reza Barghlameno",
      photo: "/raza.jpg"
    }
  })
  const [contactDataLocale, setContactDataLocale] = useState<string>('en')
  
  // Form states
  const [userForm, setUserForm] = useState({ _id: '', email: '', password: '', role: '', status: '' })
  // Blog form state
  const emptyBlog: Blog = {
    _id: '',
    slug: '',
    title: '',
    subtitle: '',
    category: 'Marketing',
    author: {
      name: '',
      title: '',
      avatar: '',
      bio: '',
      url: ''
    },
    date: '',
    readTime: '5 min read',
    featured: false,
    heroImage: '',
    heroImageAlt: '',
    canonicalUrl: '',
    language: 'en',
    city: '',
    topic: '',
    keyword: '',
    group_id: 1,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: ''
    },
    hreflang_tags: [],
    internal_links: [],
    schema_markup: {},
    images: [],
    word_count: 0,
    ctaSection: {
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: ''
    },
    content: {
      lead: '',
      sections: []
    },
    status: 'Draft',
    views: 0,
    likes: 0
  }
  type AdminNeighborhood = {
    name: string
    type: 'neighborhood' | 'city'
    slug: string
    description: string
    image: string
    imageAlt?: string
    distance: string
    avgHomePrice: string
    county: string
  }

  interface AdminCityForm {
    _id?: string
    slug: string
    name: string
    state: string
    population: string
    avgHomePrice: string
    heroImage?: string
    heroImageAlt?: string
    shortDescription: string
    fullDescription?: string
    tags: string[] | string
    neighborhoods: AdminNeighborhood[]
    highlights: { title: string; description: string; icon: string; bgImage: string; bgImageAlt?: string }[]
    faqs: { question: string; answer: string; category: string }[]
    seo?: { metaTitle: string; metaDescription: string; keywords?: string; ogTitle?: string; ogDescription?: string; ogImage?: string; ogImageAlt?: string; twitterCard?: string }
    schema_markup?: any[]
    language?: string

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

  }

  const [blogForm, setBlogForm] = useState<Blog>(emptyBlog)
  const [cityForm, setCityForm] = useState<AdminCityForm>({
    _id: '',
    slug: '',
    name: '',
    state: '',
    population: '',
    avgHomePrice: '',
    heroImage: '',
    heroImageAlt: '',
    shortDescription: '',
    fullDescription: '',
    tags: [],
    neighborhoods: [
      {
        name: '',
        type: 'neighborhood',
        slug: '',
        description: '',
        image: '',
        imageAlt: '',
        distance: '',
        avgHomePrice: '',
        county: ''
      }
    ],
    highlights: [{ title: '', description: '', icon: '', bgImage: '', bgImageAlt: '' }],
    faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],

    city: '',
    county: '',
    url_slug: '',
    meta_title: '',
    meta_description: '',
    h1_title: '',
    primary_keywords: [],
    secondary_keywords: [],
    express_keywords: [],
    agent_keywords: [],
    landing_page_text: '',
    express_service: '',
    neighborhood_guide: '',
    market_analysis: '',
    agent_name: '',
    company_name: '',
    contact_phone: '',
    contact_email: '',
    cta_text: '',
    
    // SEO and schema fields
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogImageAlt: '',
      twitterCard: 'summary_large_image'
    },
    schema_markup: []

  })
  
  const [loadingData, setLoadingData] = useState(false)
  const router = useRouter()

  // API functions
  const fetchUsers = async () => {
    try {
      console.log('Fetching users...')
      const response = await fetch('/admin/api/users')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched users data:', data)
        setUsers(data)
        setFilteredUsers(data)
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/admin/api/blogs')
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  const fetchCities = async () => {
    try {
      // default to 'en' if missing
      const selectedLang = (typeof window !== 'undefined' && localStorage.getItem('adminCitiesLang')) || 'en'
      const response = await fetch(`/admin/api/cities?language=${encodeURIComponent(selectedLang)}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched cities data:', data)
        setCities(data)
        setFilteredCities(data)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Calculate real stats from actual data
      setStats({
        users: users.length,
        cities: cities.length,
        blogs: blogs.length
      })
    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }

  const fetchHomeData = async (locale: string = 'en') => {
    try {
      console.log('🔄 Fetching home data for locale:', locale)
      const response = await fetch(`/api/home?locale=${encodeURIComponent(locale)}&t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Home data fetched for locale:', locale, data)
        setHomeData(data)
        setHomeDataLocale(locale)
      } else {
        console.error('❌ Failed to fetch home data for locale:', locale, response.status)
      }
    } catch (error) {
      console.error('❌ Error fetching home data for locale:', locale, error)
    }
  }

  const fetchContactData = async (locale: string = 'en') => {
    try {
      console.log('🔄 Fetching contact data for locale:', locale)
      const response = await fetch(`/api/contact?locale=${encodeURIComponent(locale)}&t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Contact data fetched for locale:', locale, data)
        setContactData(data)
        setContactDataLocale(locale)
      } else {
        console.error('❌ Failed to fetch contact data for locale:', locale, response.status)
      }
    } catch (error) {
      console.error('❌ Error fetching contact data for locale:', locale, error)
    }
  }

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, type, message }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Function to handle adding new user
  const handleAddUser = () => {
    console.log('🔧 handleAddUser called')
    setEditingUser(null)
    setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
    setShowUserModal(true)
    console.log('🔧 Form reset, modal opened')
  }

  // Function to handle adding new city
  const handleAddCity = (preferredLanguage?: string) => {
    setEditingCity(null)
    setCityForm({
      _id: '',
      slug: '',
      name: '',
      state: '',
      population: '',
      avgHomePrice: '',
      heroImage: '',
      shortDescription: '',
      tags: [],
      neighborhoods: [
        { name: '', type: 'neighborhood', slug: '', description: '', image: '', imageAlt: '', distance: '', avgHomePrice: '', county: '' }
      ],
      highlights: [{ title: '', description: '', icon: '', bgImage: '' }],
      faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
      fullDescription: '',
      language: preferredLanguage || (typeof window !== 'undefined' && (localStorage.getItem('adminCitiesLang') || 'en')) || 'en'
    })
    setShowCityModal(true)
  }

  // Function to handle adding new blog
  const handleAddBlog = () => {
    setEditingBlog(null)
    setBlogForm(emptyBlog)
    setShowBlogModal(true)
  }

  // Function to update home data
  const updateHomeData = async (newHomeData: HomeData, locale: string = 'en') => {
    try {
      const response = await fetch(`/api/home?locale=${encodeURIComponent(locale)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHomeData)
      })
      if (response.ok) {
        setHomeData(newHomeData)
        setHomeDataLocale(locale)
        addToast('success', 'Home data updated successfully!')
        
        // Trigger refresh on home page by setting localStorage flag
        if (typeof window !== 'undefined') {
          localStorage.setItem('homeDataUpdated', Date.now().toString())
          // Dispatch a custom event to notify other tabs/windows
          window.dispatchEvent(new CustomEvent('homeDataUpdated'))
        }
        
        // Also refresh the home data to ensure consistency
        await fetchHomeData(locale)
      } else {
        addToast('error', 'Failed to update home data')
      }
    } catch (error) {
      addToast('error', 'Error updating home data')
    }
  }

  // Function to update contact data
  const updateContactData = async (newContactData: ContactData, locale: string = 'en') => {
    try {
      const response = await fetch(`/api/contact?locale=${encodeURIComponent(locale)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContactData)
      })
      if (response.ok) {
        setContactData(newContactData)
        setContactDataLocale(locale)
        addToast('success', 'Contact data updated successfully!')
        
        // Trigger refresh on contact page by setting localStorage flag
        if (typeof window !== 'undefined') {
          localStorage.setItem('contactDataUpdated', Date.now().toString())
          // Dispatch a custom event to notify other tabs/windows
          window.dispatchEvent(new CustomEvent('contactDataUpdated'))
        }
        
        // Also refresh the contact data to ensure consistency
        await fetchContactData(locale)
      } else {
        addToast('error', 'Failed to update contact data')
      }
    } catch (error) {
      addToast('error', 'Failed to update contact data')
    }
  }

  const createUser = async (userData: User) => {
    try {
      // Remove _id for new user creation to let MongoDB generate it
      const { _id, ...userDataWithoutId } = userData
      const response = await fetch('/admin/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDataWithoutId)
      })
      if (response.ok) {
        await fetchUsers()
        setShowUserModal(false)
        setEditingUser(null)
        setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
        addToast('success', 'User created successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to create user')
      }
    } catch (error) {
      addToast('error', 'Failed to create user')
    }
  }

  const createBlog = async (blogData: Blog) => {
    try {
      // Remove _id for new blog creation to let MongoDB generate it
      const { _id, ...blogDataWithoutId } = blogData
      
      const response = await fetch('/admin/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogDataWithoutId,
          date: new Date().toISOString(),
          featured: blogData.featured,
          author: blogData.author // Keep as string for new blogs
        })
      })
      if (response.ok) {
        await fetchBlogs()
        setShowBlogModal(false)
        setBlogForm(emptyBlog)
        addToast('success', 'Blog created successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to create blog')
      }
    } catch (error) {
      addToast('error', 'Failed to create blog')
    }
  }

  const createCity = async (cityData: any) => {
    try {
      // Filter out empty values from arrays
      const filteredNeighborhoods = (cityData.neighborhoods as any[]).filter((n) => n && n.name && n.slug)
      const filteredHighlights = cityData.highlights.filter((h: { title: string; description: string; icon: string; bgImage: string }) => 
        h && h.title && h.description && h.title.trim() !== '' && h.description.trim() !== ''
      )
      const filteredFaqs = cityData.faqs.filter((f: { question: string; answer: string; category: string }) => 
        f && f.question && f.answer && 
        f.question.trim() !== '' && f.answer.trim() !== ''
      )
      // clients removed

      // Process tags safely - tags may be string or array
      const tagsArray = Array.isArray(cityData.tags)
        ? (cityData.tags as string[])
        : (typeof cityData.tags === 'string' && cityData.tags.length > 0
            ? cityData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
            : [])
      const processedTags = tagsArray.filter((tag: string) => tag && typeof tag === 'string' && tag.trim() !== '')

      const selectedLang = (typeof window !== 'undefined' && localStorage.getItem('adminCitiesLang')) || 'en'
      const cityPayload = {
        slug: cityData.slug,
        name: cityData.name,
        state: cityData.state,
        population: cityData.population,
        avgHomePrice: cityData.avgHomePrice,
        heroImage: cityData.heroImage,
        heroImageAlt: cityData.heroImageAlt,
        shortDescription: cityData.shortDescription,
        fullDescription: cityData.fullDescription,
        tags: processedTags,
        neighborhoods: filteredNeighborhoods,
        highlights: filteredHighlights,
        faqs: filteredFaqs,
        
        seo: cityData.seo,
        schema_markup: cityData.schema_markup,
        language: cityData.language || selectedLang,
        
        // Additional fields to preserve
        city: cityData.city,
        county: cityData.county,
        url_slug: cityData.url_slug,
        meta_title: cityData.meta_title,
        meta_description: cityData.meta_description,
        h1_title: cityData.h1_title,
        primary_keywords: cityData.primary_keywords,
        secondary_keywords: cityData.secondary_keywords,
        express_keywords: cityData.express_keywords,
        agent_keywords: cityData.agent_keywords,
        landing_page_text: cityData.landing_page_text,
        express_service: cityData.express_service,
        neighborhood_guide: cityData.neighborhood_guide,
        market_analysis: cityData.market_analysis,
        agent_name: cityData.agent_name,
        company_name: cityData.company_name,
        contact_phone: cityData.contact_phone,
        contact_email: cityData.contact_email,
        cta_text: cityData.cta_text
      }



      const response = await fetch('/admin/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityPayload)
      })
      
      if (response.ok) {
        await fetchCities()
        setShowCityModal(false)
        setCityForm({
          _id: '',
          slug: '',
          name: '',
          state: '',
          population: '',
          avgHomePrice: '',
          heroImage: '',
          heroImageAlt: '',
          shortDescription: '',
          fullDescription: '',
          tags: [],
          neighborhoods: [
            { name: '', type: 'neighborhood', slug: '', description: '', image: '', imageAlt: '', distance: '', avgHomePrice: '', county: '' }
          ],
          highlights: [{ title: '', description: '', icon: '', bgImage: '', bgImageAlt: '' }],
          faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
          seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            ogImageAlt: '',
            twitterCard: 'summary_large_image'
          },
          schema_markup: [],
          language: 'en',
          
          // Additional fields
          city: '',
          county: '',
          url_slug: '',
          meta_title: '',
          meta_description: '',
          h1_title: '',
          primary_keywords: [],
          secondary_keywords: [],
          express_keywords: [],
          agent_keywords: [],
          landing_page_text: '',
          express_service: '',
          neighborhood_guide: '',
          market_analysis: '',
          agent_name: '',
          company_name: '',
          contact_phone: '',
          contact_email: '',
          cta_text: ''
        })
        addToast('success', 'City created successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to create city')
      }
    } catch (error) {
      addToast('error', 'Failed to create city')
    }
  }

  const deleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {

        const response = await fetch('/admin/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id, id: id })
        })
        if (response.ok) {
          await fetchUsers()
          addToast('success', 'User deleted successfully!')
        } else {
          const error = await response.json()
          addToast('error', error.error || 'Failed to delete user')
        }
      } catch (error) {
        addToast('error', 'Failed to delete user')
      }
    }
  }

  const deleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch('/admin/api/blogs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id })
        })
              if (response.ok) {
        await fetchBlogs()
        addToast('success', 'Blog deleted successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      addToast('error', 'Failed to delete blog')
    }
    }
  }

  const deleteCity = async (id: string) => {
    if (confirm('Are you sure you want to delete this city?')) {
      try {

        
        if (!id || id.trim() === '') {
          alert('Cannot delete city: Invalid ID')
          return
        }

        const response = await fetch('/admin/api/cities', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id })
        })
        
        if (response.ok) {
          await fetchCities()
          addToast('success', 'City deleted successfully!')
        } else {
          const error = await response.json()
          addToast('error', error.error || 'Failed to delete city')
        }
      } catch (error) {
        addToast('error', 'Failed to delete city')
      }
    }
  }

  const updateUser = async (userData: User) => {
    try {

      const response = await fetch('/admin/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      if (response.ok) {
        await fetchUsers()
        setShowUserModal(false)
        setEditingUser(null)
        setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
        addToast('success', 'User updated successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to update user')
      }
    } catch (error) {
      addToast('error', 'Failed to update user')
    }
  }

  const updateBlog = async (blogData: Blog) => {
    try {
      const response = await fetch('/admin/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogData,
          featured: blogData.featured,
          author: blogData.author
        })
      })
      if (response.ok) {
        await fetchBlogs()
        setShowBlogModal(false)
        setEditingBlog(null)
        setBlogForm(emptyBlog)
        addToast('success', 'Blog updated successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to update blog')
      }
    } catch (error) {
      addToast('error', 'Failed to update blog')
    }
  }

  const updateCity = async (cityData: any) => {
    try {
      // Filter out empty values from arrays
      const filteredNeighborhoods = (cityData.neighborhoods as any[]).filter((n) => n && n.name && n.slug)
      const filteredHighlights = cityData.highlights.filter((h: { title: string; description: string; icon: string; bgImage: string }) => 
        h && h.title && h.description && h.title.trim() !== '' && h.description.trim() !== ''
      )
      const filteredFaqs = cityData.faqs.filter((f: { question: string; answer: string; category: string }) => 
        f && f.question && f.answer && 
        f.question.trim() !== '' && f.answer.trim() !== ''
      )
      // clients removed

      // Process tags safely - tags may be string or array
      const tagsArray = Array.isArray(cityData.tags)
        ? (cityData.tags as string[])
        : (typeof cityData.tags === 'string' && cityData.tags.length > 0
            ? cityData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
            : [])
      const processedTags = tagsArray.filter((tag: string) => tag && typeof tag === 'string' && tag.trim() !== '')

      const selectedLang = (typeof window !== 'undefined' && localStorage.getItem('adminCitiesLang')) || 'en'
      const cityPayload = {
        _id: cityData._id,
        slug: cityData.slug,
        name: cityData.name,
        state: cityData.state,
        population: cityData.population,
        avgHomePrice: cityData.avgHomePrice,
        heroImage: cityData.heroImage,
        heroImageAlt: cityData.heroImageAlt,
        shortDescription: cityData.shortDescription,
        fullDescription: cityData.fullDescription,
        tags: processedTags,
        neighborhoods: filteredNeighborhoods,
        highlights: filteredHighlights,
        faqs: filteredFaqs,
        
        seo: cityData.seo,
        schema_markup: cityData.schema_markup,
        language: cityData.language || selectedLang,
        
        // Additional fields to preserve
        city: cityData.city,
        county: cityData.county,
        url_slug: cityData.url_slug,
        meta_title: cityData.meta_title,
        meta_description: cityData.meta_description,
        h1_title: cityData.h1_title,
        primary_keywords: cityData.primary_keywords,
        secondary_keywords: cityData.secondary_keywords,
        express_keywords: cityData.express_keywords,
        agent_keywords: cityData.agent_keywords,
        landing_page_text: cityData.landing_page_text,
        express_service: cityData.express_service,
        neighborhood_guide: cityData.neighborhood_guide,
        market_analysis: cityData.market_analysis,
        agent_name: cityData.agent_name,
        company_name: cityData.company_name,
        contact_phone: cityData.contact_phone,
        contact_email: cityData.contact_email,
        cta_text: cityData.cta_text
      }



      const response = await fetch('/admin/api/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityPayload)
      })
      
      if (response.ok) {
        await fetchCities()
        setShowCityModal(false)
        setEditingCity(null)
        setCityForm({
          _id: '',
          slug: '',
          name: '',
          state: '',
          population: '',
          avgHomePrice: '',
          heroImage: '',
          heroImageAlt: '',
          shortDescription: '',
          fullDescription: '',
          tags: [],
          neighborhoods: [
            { name: '', type: 'neighborhood', slug: '', description: '', image: '', imageAlt: '', distance: '', avgHomePrice: '', county: '' }
          ],
          highlights: [{ title: '', description: '', icon: '', bgImage: '', bgImageAlt: '' }],
          faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
          seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            ogImageAlt: '',
            twitterCard: 'summary_large_image'
          },
          schema_markup: [],
          
          // Additional fields
          city: '',
          county: '',
          url_slug: '',
          meta_title: '',
          meta_description: '',
          h1_title: '',
          primary_keywords: [],
          secondary_keywords: [],
          express_keywords: [],
          agent_keywords: [],
          landing_page_text: '',
          express_service: '',
          neighborhood_guide: '',
          market_analysis: '',
          agent_name: '',
          company_name: '',
          contact_phone: '',
          contact_email: '',
          cta_text: ''
        })
        addToast('success', 'City updated successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to update city')
      }
    } catch (error) {
      addToast('error', 'Failed to update city')
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
        const userEmail = localStorage.getItem("adminUserEmail")
        
        if (!isLoggedIn) {
          router.push("/admin/login")
          return
        }
        
        if (userEmail) {
          setUser({ email: userEmail })
        } else {
          setUser({ email: "admin@example.com" })
        }
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      setLoadingData(true)
              Promise.all([fetchUsers(), fetchBlogs(), fetchCities(), fetchStats(), fetchHomeData('en'), fetchContactData('en')])
        .finally(() => setLoadingData(false))
    }
  }, [user])

  // Listen to language changes from CityManager and refetch cities
  useEffect(() => {
    const onLang = (e: any) => {
      const lang = (e?.detail?.language as string) || 'en'
      fetch(`/admin/api/cities?language=${encodeURIComponent(lang)}`)
        .then(r => r.ok ? r.json() : [])
        .then((data) => {
          setCities(data)
          setFilteredCities(data)
        })
        .catch((err) => console.error('Error refetching cities by lang:', err))
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('adminCitiesLangChanged', onLang as any)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('adminCitiesLangChanged', onLang as any)
      }
    }
  }, [])

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCities(cities)
      setFilteredUsers(users)
    } else {
      // Filter cities
      const filteredCities = cities.filter((city: any) => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(city.tags) ? city.tags : (typeof city.tags === 'string' ? city.tags.split(',').map((t: string) => t.trim()) : [])).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredCities(filteredCities)

      // Filter users
      const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filteredUsers)
    }
  }, [searchQuery, cities, users])

  // Recalculate stats whenever data changes
  useEffect(() => {
    fetchStats()
  }, [users, cities, blogs])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdminLoggedIn")
      localStorage.removeItem("adminUserEmail")
    }
    router.push("/admin/login")
  }

  const handleUpdateJson = async () => {
    try {
      addToast('info', 'Updating JSON files... This may take a moment.')
      
      const response = await fetch('/admin/api/update-json', { method: 'POST' })
      if (response.ok) {
        const result = await response.json()
        setLastUpdated(new Date().toLocaleString())
        addToast('success', `JSON files updated successfully at ${new Date().toLocaleString()}`)
        console.log('JSON update result:', result)
      } else {
        const errorData = await response.json()
        addToast('error', `Failed to update JSON files: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating JSON files:', error)
      addToast('error', 'Failed to update JSON files: Network error')
    }
  }

  const handleRefreshData = async () => {
    try {
      // Refresh all data
      await Promise.all([
        fetchUsers(),
        fetchBlogs(),
        fetchCities(),
        fetchStats(),
        fetchHomeData(homeDataLocale)
      ])
      setLastUpdated(new Date().toLocaleString())
      addToast('success', 'Data refreshed successfully')
    } catch (error) {
      console.error('Error refreshing data:', error)
      addToast('error', 'Failed to refresh data')
    }
  }

  const getPageInfo = () => {
    switch(activeSection) {
      case "dashboard":
        return { title: "Dashboard Overview", subtitle: "Welcome back! Here's what's happening." }
      case "home":
        return { title: "Home Page Management", subtitle: "Manage your website's main landing page" }
      case "users":
        return { title: "User Management", subtitle: `Manage your ${users.length} users` }
      case "cities":
        return { title: "City Management", subtitle: `Manage your ${cities.length} cities` }
      case "blogs":
        return { title: "Blog Manager", subtitle: `Manage your ${blogs.length} blog posts` }
      default:
        return { title: "Dashboard Overview", subtitle: "Welcome back! Here's what's happening." }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (loadingData) {
    return (
      <div className="admin-dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const pageInfo = getPageInfo()

  return (
    <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`admin-sidebar-overlay ${sidebarCollapsed ? '' : 'show'}`}
          onClick={() => setSidebarCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'none'
          }}
        />
        
        {/* Main Content Area */}
        <div className="admin-main-content" style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          {/* Global Admin Navbar */}
          <AdminNavbar 
            onLogout={handleLogout}
            onSectionChange={setActiveSection}
            activeSection={activeSection}
          />

          {/* Content */}
          <main className="admin-content" style={{ flex: 1, padding: '24px' }}>
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <Dashboard stats={stats} users={users} blogs={blogs} />
          )}

          {/* Home Section */}
          {activeSection === "home" && (
            <HomeManager 
              homeData={homeData}
              updateHomeData={updateHomeData}
              currentLocale={homeDataLocale}
              onLocaleChange={async (locale) => {
                await fetchHomeData(locale)
                setHomeDataLocale(locale)
              }}
            />
          )}

          {/* Contact Section */}
          {activeSection === "contact" && (
            <ContactManager 
              contactData={contactData}
              updateContactData={updateContactData}
              currentLocale={contactDataLocale}
              onLocaleChange={async (locale) => {
                await fetchContactData(locale)
                setContactDataLocale(locale)
              }}
            />
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <UserManager 
              users={filteredUsers}
              setShowUserModal={setShowUserModal}
              setEditingUser={setEditingUser}
              setUserForm={setUserForm}
              deleteUser={deleteUser}
              handleAddUser={handleAddUser}
            />
          )}

          {/* Cities Section */}
          {activeSection === "cities" && (
            <CityManager 
              cities={filteredCities}
              setShowCityModal={setShowCityModal}
              setEditingCity={setEditingCity}
              setCityForm={setCityForm}
              deleteCity={deleteCity}
              handleAddCity={handleAddCity}
            />
          )}

                    {/* Blogs Section */}
          {activeSection === "blogs" && (
            <BlogManager 
              blogs={blogs}
              setShowBlogModal={setShowBlogModal}
              setEditingBlog={setEditingBlog}
              setBlogForm={(form: Blog) => setBlogForm(form)}
              deleteBlog={deleteBlog}
              handleAddBlog={handleAddBlog}
              onBlogStatusUpdate={(blogId: string, newStatus: string) => {
                setBlogs(prevBlogs => 
                  prevBlogs.map(blog => 
                    blog._id === blogId ? { ...blog, status: newStatus } : blog
                  )
                )
              }}
            />
          )}
        </main>

          {/* Global Admin Footer */}
          <AdminFooter 
            onUpdateJson={handleUpdateJson}
            onRefreshData={handleRefreshData}
            lastUpdated={lastUpdated}
          />
        </div>

      {/* User Modal */}
      <UserModal 
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        userForm={userForm}
        setUserForm={setUserForm}
        createUser={createUser}
        updateUser={updateUser}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="modal show" onClick={() => setShowBlogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
              <button onClick={() => {
                setShowBlogModal(false)
                setEditingBlog(null)
                setBlogForm(emptyBlog)
              }} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={(e) => {
                e.preventDefault()
                if (editingBlog) {
                  updateBlog(blogForm)
                } else {
                  createBlog(blogForm)
                }
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Slug <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="my-blog-slug"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Blog Title"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Subtitle</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Blog subtitle"
                      value={blogForm.subtitle}
                      onChange={(e) => setBlogForm({...blogForm, subtitle: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Canonical URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://example.com/blog-post"
                                      value={blogForm.canonicalUrl}
                onChange={(e) => setBlogForm({...blogForm, canonicalUrl: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select 
                      className="form-select"
                      value={blogForm.language}
                      onChange={(e) => setBlogForm({...blogForm, language: e.target.value})}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category <span className="required">*</span></label>
                    <select 
                      className="form-select"
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                      required
                    >
                      <option>Marketing</option>
                      <option>Technology</option>
                      <option>Business</option>
                      <option>Lifestyle</option>
                      <option>Luxury Real Estate</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="John Doe"
                      value={typeof blogForm.author === 'string' ? blogForm.author : (blogForm.author?.name || '')}
                      onChange={(e) => setBlogForm({ 
                        ...blogForm, 
                        author: {
                          name: e.target.value,
                          title: blogForm.author?.title || '',
                          avatar: blogForm.author?.avatar || '',
                          bio: blogForm.author?.bio || '',
                          url: blogForm.author?.url || ''
                        }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author Title <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Senior Writer"
                      value={typeof blogForm.author === 'string' ? '' : (blogForm.author?.title || '')}
                      onChange={(e) => setBlogForm({ 
                        ...blogForm, 
                        author: {
                          name: blogForm.author?.name || '',
                          title: e.target.value,
                          avatar: blogForm.author?.avatar || '',
                          bio: blogForm.author?.bio || '',
                          url: blogForm.author?.url || ''
                        }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author Avatar <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="JD"
                      value={typeof blogForm.author === 'string' ? '' : (blogForm.author?.avatar || '')}
                      onChange={(e) => setBlogForm({ 
                        ...blogForm, 
                        author: {
                          name: blogForm.author?.name || '',
                          title: blogForm.author?.title || '',
                          avatar: e.target.value,
                          bio: blogForm.author?.bio || '',
                          url: blogForm.author?.url || ''
                        }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author Bio <span className="required">*</span></label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Author biography..."
                      value={typeof blogForm.author === 'string' ? '' : (blogForm.author?.bio || '')}
                      onChange={(e) => setBlogForm({ 
                        ...blogForm, 
                        author: {
                          name: blogForm.author?.name || '',
                          title: blogForm.author?.title || '',
                          avatar: blogForm.author?.avatar || '',
                          bio: e.target.value,
                          url: blogForm.author?.url || ''
                        }
                      })}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Read Time</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="5 min read"
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Word Count</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0"
                                      value={blogForm.word_count}
                onChange={(e) => setBlogForm({...blogForm, word_count: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status <span className="required">*</span></label>
                    <select 
                      className="form-select"
                      value={blogForm.status}
                      onChange={(e) => setBlogForm({...blogForm, status: e.target.value})}
                      required
                    >
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Featured</label>
                    <select 
                      className="form-select"
                      value={blogForm.featured ? 'Yes' : 'No'}
                      onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.value === 'Yes' })}
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Group ID <span className="required">*</span></label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Enter group ID (e.g. 1)"
                      value={blogForm.group_id}
                      onChange={(e) => setBlogForm({...blogForm, group_id: parseInt(e.target.value) || 1})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hero Image URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://images.unsplash.com/photo-..."
                      value={blogForm.heroImage}
                      onChange={(e) => setBlogForm({...blogForm, heroImage: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image Alt Text</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Description of the hero image"
                      value={blogForm.heroImageAlt}
                      onChange={(e) => setBlogForm({...blogForm, heroImageAlt: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Content Lead <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Write your blog content lead here..."
                    value={blogForm.content.lead}
                    onChange={(e) => setBlogForm({...blogForm, content: { ...blogForm.content, lead: e.target.value }})}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Content Sections (JSON) <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder='[{"title": "Section Title", "content": "Section content...", "quote": {"text": "Quote text", "author": "Author name"}, "additional": "Additional content", "subsections": [{"title": "Subsection title", "content": "Subsection content"}]}]'
                    value={JSON.stringify(blogForm.content.sections, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setBlogForm({...blogForm, content: { ...blogForm.content, sections: parsed }});
                      } catch (error) {
                        // Keep the current value if JSON is invalid
                      }
                    }}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Meta Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="SEO optimized title"
                    value={blogForm.seo.metaTitle}
                    onChange={(e) => setBlogForm({...blogForm, seo: { ...blogForm.seo, metaTitle: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Meta Description</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="SEO meta description..."
                    value={blogForm.seo.metaDescription}
                    onChange={(e) => setBlogForm({...blogForm, seo: { ...blogForm.seo, metaDescription: e.target.value }})}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">City <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Los Angeles"
                    value={blogForm.city}
                    onChange={(e) => setBlogForm({...blogForm, city: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Topic <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Real Estate Investment"
                    value={blogForm.topic}
                    onChange={(e) => setBlogForm({...blogForm, topic: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Keyword <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="luxury real estate"
                    value={blogForm.keyword}
                    onChange={(e) => setBlogForm({...blogForm, keyword: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Keywords</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="keyword1, keyword2, keyword3"
                    value={blogForm.seo.keywords}
                    onChange={(e) => setBlogForm({...blogForm, seo: { ...blogForm.seo, keywords: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO OG Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Open Graph title"
                    value={blogForm.seo.ogTitle}
                    onChange={(e) => setBlogForm({...blogForm, seo: { ...blogForm.seo, ogTitle: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO OG Description</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Open Graph description"
                    value={blogForm.seo.ogDescription}
                    onChange={(e) => setBlogForm({...blogForm, seo: { ...blogForm.seo, ogDescription: e.target.value }})}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">SEO OG Image</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://example.com/og-image.jpg"
                    value={blogForm.seo.ogImage}
                    onChange={(e) => setBlogForm({...blogForm, seo: { ...blogForm.seo, ogImage: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Twitter Card</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="summary_large_image"
                    value={blogForm.seo.twitterCard}
                    onChange={(e) => setBlogForm({...blogForm, seo: { ...blogForm.seo, twitterCard: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hreflang Tags (JSON)</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder='[{"hreflang": "en", "href": "https://example.com/en/blog"}, {"hreflang": "es", "href": "https://example.com/es/blog"}]'
                    value={JSON.stringify(blogForm.hreflang_tags, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setBlogForm({...blogForm, hreflang_tags: parsed});
                      } catch (error) {
                        // Keep the current value if JSON is invalid
                      }
                    }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Internal Links (JSON)</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder='[{"href": "/cities/los-angeles", "anchor": "Los Angeles Real Estate", "context": "Related city page"}]'
                    value={JSON.stringify(blogForm.internal_links, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setBlogForm({...blogForm, internal_links: parsed});
                      } catch (error) {
                        // Keep the current value if JSON is invalid
                      }
                    }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Images (JSON)</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder='[{"url": "https://example.com/image1.jpg", "alt": "Image description", "local_path": "/images/blog/image1.jpg"}]'
                    value={JSON.stringify(blogForm.images, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setBlogForm({...blogForm, images: parsed});
                      } catch (error) {
                        // Keep the current value if JSON is invalid
                      }
                    }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Schema Markup (JSON)</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder='{"@context": "https://schema.org", "@type": "Article", "headline": "Blog Title"}'
                    value={JSON.stringify(blogForm.schema_markup, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setBlogForm({...blogForm, schema_markup: parsed});
                      } catch (error) {
                        // Keep the current value if JSON is invalid
                      }
                    }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Section Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ready To Make A Move?"
                    value={blogForm.ctaSection.title}
                    onChange={(e) => setBlogForm({...blogForm, ctaSection: { ...blogForm.ctaSection, title: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Section Subtitle</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Connect with our specialists today"
                    value={blogForm.ctaSection.subtitle}
                    onChange={(e) => setBlogForm({...blogForm, ctaSection: { ...blogForm.ctaSection, subtitle: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Button Text</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Schedule Consultation"
                    value={blogForm.ctaSection.ctaText}
                    onChange={(e) => setBlogForm({...blogForm, ctaSection: { ...blogForm.ctaSection, ctaText: e.target.value }})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Button Link</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="/contact/specialists"
                    value={blogForm.ctaSection.ctaLink}
                    onChange={(e) => setBlogForm({...blogForm, ctaSection: { ...blogForm.ctaSection, ctaLink: e.target.value }})}
                  />
                </div>
              </form>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => {
                setShowBlogModal(false)
                setEditingBlog(null)
                setBlogForm(emptyBlog)
              }} className="btn btn-secondary">Cancel</button>
              <button type="button" onClick={() => {
                if (editingBlog) {
                  updateBlog(blogForm)
                } else {
                  createBlog(blogForm)
                }
              }} className="btn btn-primary">{editingBlog ? 'Update Blog' : 'Save Blog'}</button>
            </div>
          </div>
        </div>
      )}

      {/* City Modal */}
      {showCityModal && (
        <div className="modal show" onClick={() => setShowCityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingCity ? 'Edit City' : 'Add City'}</h2>
              <button onClick={() => {
                setShowCityModal(false)
                setEditingCity(null)
                setCityForm({
                  _id: '',
                  slug: '',
                  name: '',
                  state: '',
                  population: '',
                  avgHomePrice: '',
                  heroImage: '',
                  heroImageAlt: '',
                  shortDescription: '',
                  fullDescription: '',
                  tags: [],
                  neighborhoods: [
                    { name: '', type: 'neighborhood', slug: '', description: '', image: '', imageAlt: '', distance: '', avgHomePrice: '', county: '' }
                  ],
                  highlights: [{ title: '', description: '', icon: '', bgImage: '', bgImageAlt: '' }],
                  faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
                  
                  seo: {
                    metaTitle: '',
                    metaDescription: '',
                    keywords: '',
                    ogTitle: '',
                    ogDescription: '',
                    ogImage: '',
                    ogImageAlt: '',
                    twitterCard: 'summary_large_image'
                  },
                  schema_markup: []
                })
              }} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={(e) => {
                e.preventDefault()
                if (editingCity) {
                  updateCity(cityForm)
                } else {
                  createCity(cityForm)
                }
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Slug <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="los-angeles"
                      value={cityForm.slug}
                      onChange={(e) => setCityForm({...cityForm, slug: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Los Angeles"
                      value={cityForm.name}
                      onChange={(e) => setCityForm({...cityForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="California"
                      value={cityForm.state}
                      onChange={(e) => setCityForm({...cityForm, state: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Population <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="4M+"
                      value={cityForm.population}
                      onChange={(e) => setCityForm({...cityForm, population: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Average Home Price <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="$800K"
                      value={cityForm.avgHomePrice}
                      onChange={(e) => setCityForm({...cityForm, avgHomePrice: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hero Image URL <span className="required">*</span></label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://example.com/city-hero.jpg"
                      value={cityForm.heroImage}
                      onChange={(e) => setCityForm({...cityForm, heroImage: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hero Image Alt Text <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Aerial view of downtown Los Angeles skyline at sunset"
                      value={cityForm.heroImageAlt}
                      onChange={(e) => setCityForm({...cityForm, heroImageAlt: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language <span className="required">*</span></label>
                    <select 
                      className="form-select"
                      value={cityForm.language || ((typeof window !== 'undefined' && (localStorage.getItem('adminCitiesLang') || 'en')) || 'en')}
                      onChange={(e) => setCityForm({ ...cityForm, language: e.target.value })}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Short Description <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="A brief description of the city..."
                    value={cityForm.shortDescription}
                    onChange={(e) => setCityForm({...cityForm, shortDescription: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Description <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Detailed description of the city..."
                    value={cityForm.fullDescription}
                    onChange={(e) => setCityForm({...cityForm, fullDescription: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Entertainment, Beach, Culture, Hollywood (comma separated)"
                    value={Array.isArray(cityForm.tags) ? cityForm.tags.join(', ') : cityForm.tags}
                    onChange={(e) => setCityForm({ ...cityForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                    required
                  />
                </div>

                {/* Neighborhoods */}
                <div className="form-group">
                  <label className="form-label">Neighborhoods <span className="required">*</span></label>
                  {cityForm.neighborhoods.map((neighborhood, index) => (
                    <div key={index} className="p-4 rounded mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                            className="form-input"
                            placeholder="Belmont Shore"
                            value={neighborhood.name}
                        onChange={(e) => {
                          const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, name: e.target.value }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                        }}
                        required
                      />
                        </div>
                        <div>
                          <label className="form-label">Slug <span className="required">*</span></label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="belmont-shore"
                            value={neighborhood.slug}
                            onChange={(e) => {
                              const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, slug: e.target.value }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                            }}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Type <span className="required">*</span></label>
                          <select
                            className="form-input"
                            value={neighborhood.type}
                            onChange={(e) => {
                              const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, type: e.target.value as any }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                            }}
                          >
                            <option value="neighborhood">neighborhood</option>
                            <option value="city">city</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">County</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Los Angeles"
                            value={neighborhood.county || ''}
                            onChange={(e) => {
                              const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, county: e.target.value }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Avg Home Price</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="$1.2M"
                            value={neighborhood.avgHomePrice || ''}
                            onChange={(e) => {
                              const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, avgHomePrice: e.target.value }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                            }}
                          />
                        </div>
                        <div>
                          <label className="form-label">Distance</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="3 miles southeast"
                            value={neighborhood.distance || ''}
                            onChange={(e) => {
                              const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, distance: e.target.value }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Image</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="https://..."
                            value={neighborhood.image || ''}
                            onChange={(e) => {
                              const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, image: e.target.value }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                            }}
                          />
                        </div>
                        <div>
                          <label className="form-label">Image Alt</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Image description"
                            value={neighborhood.imageAlt || ''}
                            onChange={(e) => {
                              const newNeighborhoods = [...cityForm.neighborhoods]
                              newNeighborhoods[index] = { ...neighborhood, imageAlt: e.target.value }
                              setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                            }}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-textarea"
                          placeholder="Neighborhood description..."
                          value={neighborhood.description || ''}
                          onChange={(e) => {
                            const newNeighborhoods = [...cityForm.neighborhoods]
                            newNeighborhoods[index] = { ...neighborhood, description: e.target.value }
                            setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                          }}
                        />
                      </div>
                      {cityForm.neighborhoods.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newNeighborhoods = cityForm.neighborhoods.filter((_, i) => i !== index)
                            setCityForm({ ...cityForm, neighborhoods: newNeighborhoods })
                          }}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({
                      ...cityForm,
                      neighborhoods: [
                        ...cityForm.neighborhoods,
                        { name: '', type: 'neighborhood', slug: '', description: '', image: '', imageAlt: '', distance: '', avgHomePrice: '', county: '' }
                      ]
                    })}
                    className="btn-add btn-add-neighborhood"
                  >
                    Add Neighborhood
                  </button>
                </div>

                {/* Highlights */}
                <div className="form-group">
                  <label className="form-label">Highlights <span className="required">*</span></label>
                  {cityForm.highlights.map((highlight, index) => (
                    <div key={index} className="p-4 rounded mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Title <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Hollywood & Entertainment"
                            value={highlight.title}
                            onChange={(e) => {
                              const newHighlights = [...cityForm.highlights]
                              newHighlights[index] = {...highlight, title: e.target.value}
                              setCityForm({...cityForm, highlights: newHighlights})
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Icon <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="🎬"
                            value={highlight.icon}
                            onChange={(e) => {
                              const newHighlights = [...cityForm.highlights]
                              newHighlights[index] = {...highlight, icon: e.target.value}
                              setCityForm({...cityForm, highlights: newHighlights})
                            }}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Description <span className="required">*</span></label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Home to the world's largest entertainment industry..."
                          value={highlight.description}
                          onChange={(e) => {
                            const newHighlights = [...cityForm.highlights]
                            newHighlights[index] = {...highlight, description: e.target.value}
                            setCityForm({...cityForm, highlights: newHighlights})
                          }}
                          required
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Background Image URL <span className="required">*</span></label>
                          <input 
                            type="url" 
                            className="form-input" 
                            placeholder="https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80"
                            value={highlight.bgImage}
                            onChange={(e) => {
                              const newHighlights = [...cityForm.highlights]
                              newHighlights[index] = {...highlight, bgImage: e.target.value}
                              setCityForm({...cityForm, highlights: newHighlights})
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Background Image Alt</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Hollywood sign overlooking Los Angeles with blue sky"
                            value={highlight.bgImageAlt || ''}
                            onChange={(e) => {
                              const newHighlights = [...cityForm.highlights]
                              newHighlights[index] = {...highlight, bgImageAlt: e.target.value}
                              setCityForm({...cityForm, highlights: newHighlights})
                            }}
                          />
                        </div>
                      </div>
                      {cityForm.highlights.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newHighlights = cityForm.highlights.filter((_, i) => i !== index)
                            setCityForm({...cityForm, highlights: newHighlights})
                          }}
                          className="btn-remove"
                        >
                          Remove Highlight
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({
                      ...cityForm, 
                      highlights: [...cityForm.highlights, { title: '', description: '', icon: '', bgImage: '', bgImageAlt: '' }]
                    })}
                    className="btn-add btn-add-highlight"
                  >
                    Add Highlight
                  </button>
                </div>

                {/* FAQs */}
                <div className="form-group">
                  <label className="form-label">FAQs <span className="required">*</span></label>
                  {cityForm.faqs.map((faq, index) => (
                    <div key={index} className="p-4 rounded mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Question <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="What's the best time to visit?"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...cityForm.faqs]
                              newFaqs[index] = {...faq, question: e.target.value}
                              setCityForm({...cityForm, faqs: newFaqs})
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Category <span className="required">*</span></label>
                          <select 
                            className="form-select"
                            value={faq.category}
                            onChange={(e) => {
                              const newFaqs = [...cityForm.faqs]
                              newFaqs[index] = {...faq, category: e.target.value}
                              setCityForm({...cityForm, faqs: newFaqs})
                            }}
                            required
                          >
                            <option value="Neighborhoods">Neighborhoods</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Employment">Employment</option>
                            <option value="Transportation">Transportation</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Answer <span className="required">*</span></label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Detailed answer..."
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...cityForm.faqs]
                            newFaqs[index] = {...faq, answer: e.target.value}
                            setCityForm({...cityForm, faqs: newFaqs})
                          }}
                          required
                        ></textarea>
                      </div>
                      {cityForm.faqs.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newFaqs = cityForm.faqs.filter((_, i) => i !== index)
                            setCityForm({...cityForm, faqs: newFaqs})
                          }}
                          className="btn-remove"
                        >
                          Remove FAQ
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({
                      ...cityForm, 
                      faqs: [...cityForm.faqs, { question: '', answer: '', category: 'Neighborhoods' }]
                    })}
                    className="btn-add btn-add-faq"
                  >
                    Add FAQ
                  </button>
                </div>

                {/* Clients removed */}

                {/* SEO Section */}
                <div className="form-group">
                  <label className="form-label">SEO Settings <span className="required">*</span></label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">Meta Title <span className="required">*</span></label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Los Angeles Real Estate & Lifestyle Guide - Luxury Living in LA"
                        value={cityForm.seo?.metaTitle || ''}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: e.target.value,
                            metaDescription: cityForm.seo?.metaDescription || '',
                            keywords: cityForm.seo?.keywords || '',
                            ogTitle: cityForm.seo?.ogTitle || '',
                            ogDescription: cityForm.seo?.ogDescription || '',
                            ogImage: cityForm.seo?.ogImage || '',
                            ogImageAlt: cityForm.seo?.ogImageAlt || '',
                            twitterCard: cityForm.seo?.twitterCard || 'summary_large_image'
                          }
                        })}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Meta Description <span className="required">*</span></label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Explore luxury real estate, top neighborhoods, and cultural highlights in Los Angeles."
                        value={cityForm.seo?.metaDescription || ''}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: cityForm.seo?.metaTitle || '',
                            metaDescription: e.target.value,
                            keywords: cityForm.seo?.keywords || '',
                            ogTitle: cityForm.seo?.ogTitle || '',
                            ogDescription: cityForm.seo?.ogDescription || '',
                            ogImage: cityForm.seo?.ogImage || '',
                            ogImageAlt: cityForm.seo?.ogImageAlt || '',
                            twitterCard: cityForm.seo?.twitterCard || 'summary_large_image'
                          }
                        })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">Keywords</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Los Angeles real estate, LA lifestyle, Beverly Hills, Santa Monica"
                        value={cityForm.seo?.keywords || ''}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: cityForm.seo?.metaTitle || '',
                            metaDescription: cityForm.seo?.metaDescription || '',
                            keywords: e.target.value,
                            ogTitle: cityForm.seo?.ogTitle || '',
                            ogDescription: cityForm.seo?.ogDescription || '',
                            ogImage: cityForm.seo?.ogImage || '',
                            ogImageAlt: cityForm.seo?.ogImageAlt || '',
                            twitterCard: cityForm.seo?.twitterCard || 'summary_large_image'
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="form-label">OG Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Discover Los Angeles: Luxury Real Estate & Lifestyle Guide"
                        value={cityForm.seo?.ogTitle || ''}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: cityForm.seo?.metaTitle || '',
                            metaDescription: cityForm.seo?.metaDescription || '',
                            keywords: cityForm.seo?.keywords || '',
                            ogTitle: e.target.value,
                            ogDescription: cityForm.seo?.ogDescription || '',
                            ogImage: cityForm.seo?.ogImage || '',
                            ogImageAlt: cityForm.seo?.ogImageAlt || '',
                            twitterCard: cityForm.seo?.twitterCard || 'summary_large_image'
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">OG Description</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Explore diverse neighborhoods, real estate insights, and highlights of Los Angeles."
                        value={cityForm.seo?.ogDescription || ''}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: cityForm.seo?.metaTitle || '',
                            metaDescription: cityForm.seo?.metaDescription || '',
                            keywords: cityForm.seo?.keywords || '',
                            ogTitle: cityForm.seo?.ogTitle || '',
                            ogDescription: e.target.value,
                            ogImage: cityForm.seo?.ogImage || '',
                            ogImageAlt: cityForm.seo?.ogImageAlt || '',
                            twitterCard: cityForm.seo?.twitterCard || 'summary_large_image'
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="form-label">OG Image</label>
                      <input 
                        type="url" 
                        className="form-input" 
                        placeholder="https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=1200&q=80"
                        value={cityForm.seo?.ogImage || ''}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: cityForm.seo?.metaTitle || '',
                            metaDescription: cityForm.seo?.metaDescription || '',
                            keywords: cityForm.seo?.keywords || '',
                            ogTitle: cityForm.seo?.ogTitle || '',
                            ogDescription: cityForm.seo?.ogDescription || '',
                            ogImage: e.target.value,
                            ogImageAlt: cityForm.seo?.ogImageAlt || '',
                            twitterCard: cityForm.seo?.twitterCard || 'summary_large_image'
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">OG Image Alt</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Los Angeles city skyline at sunset"
                        value={cityForm.seo?.ogImageAlt || ''}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: cityForm.seo?.metaTitle || '',
                            metaDescription: cityForm.seo?.metaDescription || '',
                            keywords: cityForm.seo?.keywords || '',
                            ogTitle: cityForm.seo?.ogTitle || '',
                            ogDescription: cityForm.seo?.ogDescription || '',
                            ogImage: cityForm.seo?.ogImage || '',
                            ogImageAlt: e.target.value,
                            twitterCard: cityForm.seo?.twitterCard || 'summary_large_image'
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Twitter Card</label>
                      <select 
                        className="form-select"
                        value={cityForm.seo?.twitterCard || 'summary_large_image'}
                        onChange={(e) => setCityForm({
                          ...cityForm, 
                          seo: { 
                            metaTitle: cityForm.seo?.metaTitle || '',
                            metaDescription: cityForm.seo?.metaDescription || '',
                            keywords: cityForm.seo?.keywords || '',
                            ogTitle: cityForm.seo?.ogTitle || '',
                            ogDescription: cityForm.seo?.ogDescription || '',
                            ogImage: cityForm.seo?.ogImage || '',
                            ogImageAlt: cityForm.seo?.ogImageAlt || '',
                            twitterCard: e.target.value
                          }
                        })}
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* New Real Estate Fields */}
                <div className="form-section">
                  <h3 className="form-section-title">Real Estate & Agent Information</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Agoura Hills"
                        value={cityForm.city || ''}
                        onChange={(e) => setCityForm({...cityForm, city: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">County</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Los Angeles"
                        value={cityForm.county || ''}
                        onChange={(e) => setCityForm({...cityForm, county: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Slug</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="/real-estate-agoura-hills"
                      value={cityForm.url_slug || ''}
                      onChange={(e) => setCityForm({...cityForm, url_slug: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Meta Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Buy & Sell Homes in Agoura Hills | Prime Local Homes - Reza Barghlameno"
                      value={cityForm.meta_title || ''}
                      onChange={(e) => setCityForm({...cityForm, meta_title: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Meta Description</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Expert Agoura Hills real estate service with Reza Barghlameno. Find homes for sale, get market analysis. Express service available for urgent buyers."
                      value={cityForm.meta_description || ''}
                      onChange={(e) => setCityForm({...cityForm, meta_description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">H1 Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Agoura Hills Real Estate Expert - Buy & Sell with Reza Barghlameno"
                      value={cityForm.h1_title || ''}
                      onChange={(e) => setCityForm({...cityForm, h1_title: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Agoura Hills real estate, homes for sale in Agoura Hills, buy house in Agoura Hills"
                      value={Array.isArray(cityForm.primary_keywords) ? cityForm.primary_keywords.join(', ') : cityForm.primary_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, primary_keywords: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Secondary Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="best realtor in Agoura Hills, luxury homes in Agoura Hills, condos for sale in Agoura Hills"
                      value={Array.isArray(cityForm.secondary_keywords) ? cityForm.secondary_keywords.join(', ') : cityForm.secondary_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, secondary_keywords: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Express Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="fast home buying Agoura Hills, urgent house search Agoura Hills, express real estate service Agoura Hills"
                      value={Array.isArray(cityForm.express_keywords) ? cityForm.express_keywords.join(', ') : cityForm.express_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, express_keywords: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agent Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Reza Barghlameno, Reza Barghlameno realtor, Reza Barghlameno Agoura Hills"
                      value={Array.isArray(cityForm.agent_keywords) ? cityForm.agent_keywords.join(', ') : cityForm.agent_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, agent_keywords: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Landing Page Text</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Welcome to Agoura Hills, California - one of Los Angeles County's most sought-after communities..."
                      value={cityForm.landing_page_text || ''}
                      onChange={(e) => setCityForm({...cityForm, landing_page_text: e.target.value})}
                      rows={6}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Express Service</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="When life demands immediate housing solutions, Reza Barghlameno's Express Service delivers results..."
                      value={cityForm.express_service || ''}
                      onChange={(e) => setCityForm({...cityForm, express_service: e.target.value})}
                      rows={6}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Neighborhood Guide</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Agoura Hills is home to several distinct neighborhoods, each offering unique benefits..."
                      value={cityForm.neighborhood_guide || ''}
                      onChange={(e) => setCityForm({...cityForm, neighborhood_guide: e.target.value})}
                      rows={6}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Market Analysis</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="The Agoura Hills real estate market is currently thriving, with a noticeable increase in home values..."
                      value={cityForm.market_analysis || ''}
                      onChange={(e) => setCityForm({...cityForm, market_analysis: e.target.value})}
                      rows={6}
                    ></textarea>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Agent Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Reza Barghlameno"
                        value={cityForm.agent_name || ''}
                        onChange={(e) => setCityForm({...cityForm, agent_name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CTA Text</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ready to buy or sell in Agoura Hills? Contact Reza Barghlameno today..."
                        value={cityForm.cta_text || ''}
                        onChange={(e) => setCityForm({...cityForm, cta_text: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder="+1 858-305-4362"
                        value={cityForm.contact_phone || ''}
                        onChange={(e) => setCityForm({...cityForm, contact_phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="reza@socalprimehomes.com"
                        value={cityForm.contact_email || ''}
                        onChange={(e) => setCityForm({...cityForm, contact_email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="socalprimehomes.com"
                      value={cityForm.company_name || ''}
                      onChange={(e) => setCityForm({...cityForm, company_name: e.target.value})}
                    />
                  </div>
                </div>

                {/* Hreflang Tags removed */}
                

                {/* Internal Links removed */}

                {/* Additional Fields Section */}
                <div className="form-section">
                  <h3 className="form-section-title">Additional City Information</h3>
                  

                  {/* Debug label to test if form is rendering */}
                  <div className="form-group">
                    <label style={{display: 'block', color: 'blue', fontSize: '18px', fontWeight: 'bold', backgroundColor: 'yellow', padding: '10px', border: '3px solid blue'}}>DEBUG: This label should be visible</label>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" style={{display: 'block', color: 'red', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>City</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="City name"
                        value={cityForm.city || ''}
                        onChange={(e) => setCityForm({...cityForm, city: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{display: 'block', color: 'red', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>County</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="County name"
                        value={cityForm.county || ''}
                        onChange={(e) => setCityForm({...cityForm, county: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{display: 'block', color: 'red', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>URL Slug</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="/real-estate-cityname"
                      value={cityForm.url_slug || ''}
                      onChange={(e) => setCityForm({...cityForm, url_slug: e.target.value})}
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Meta Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Buy & Sell Homes in City | Prime Local Homes - Reza Barghlameno"
                        value={cityForm.meta_title || ''}
                        onChange={(e) => setCityForm({...cityForm, meta_title: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">H1 Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="City Real Estate Expert - Buy & Sell with Reza Barghlameno"
                        value={cityForm.h1_title || ''}
                        onChange={(e) => setCityForm({...cityForm, h1_title: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Meta Description</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Expert city real estate service with Reza Barghlameno. Find homes for sale, get market analysis. Express service available for urgent buyers."
                        value={cityForm.meta_description || ''}
                        onChange={(e) => setCityForm({...cityForm, meta_description: e.target.value})}
                      ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="city real estate, homes for sale in city, buy house in city"
                      value={Array.isArray(cityForm.primary_keywords) ? cityForm.primary_keywords.join(', ') : cityForm.primary_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, primary_keywords: e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Secondary Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="best realtor in city, luxury homes in city, condos for sale in city"
                      value={Array.isArray(cityForm.secondary_keywords) ? cityForm.secondary_keywords.join(', ') : cityForm.secondary_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, secondary_keywords: e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Express Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="fast home buying city, urgent house search city, express real estate service city"
                      value={Array.isArray(cityForm.express_keywords) ? cityForm.express_keywords.join(', ') : cityForm.express_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, express_keywords: e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agent Keywords (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Reza Barghlameno, Reza Barghlameno realtor, Reza Barghlameno city"
                      value={Array.isArray(cityForm.agent_keywords) ? cityForm.agent_keywords.join(', ') : cityForm.agent_keywords || ''}
                      onChange={(e) => setCityForm({ ...cityForm, agent_keywords: e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword !== '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Landing Page Text</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Welcome to City, California - one of County's most sought-after communities for homebuyers and sellers..."
                      value={cityForm.landing_page_text || ''}
                      onChange={(e) => setCityForm({...cityForm, landing_page_text: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Express Service Description</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="When life demands immediate housing solutions, Reza Barghlameno's Express Service delivers results with unmatched speed and reliability in City..."
                      value={cityForm.express_service || ''}
                      onChange={(e) => setCityForm({...cityForm, express_service: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Neighborhood Guide</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="City is home to several vibrant neighborhoods, each offering unique benefits for different types of buyers..."
                      value={cityForm.neighborhood_guide || ''}
                      onChange={(e) => setCityForm({...cityForm, neighborhood_guide: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Market Analysis</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="The City real estate market is currently experiencing a period of growth, with property values steadily increasing over the past few years..."
                      value={cityForm.market_analysis || ''}
                      onChange={(e) => setCityForm({...cityForm, market_analysis: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Agent Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Reza Barghlameno"
                        value={cityForm.agent_name || ''}
                        onChange={(e) => setCityForm({...cityForm, agent_name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Prime Local Homes"
                        value={cityForm.company_name || ''}
                        onChange={(e) => setCityForm({...cityForm, company_name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder="+1-XXX-XXX-XXXX"
                        value={cityForm.contact_phone || ''}
                        onChange={(e) => setCityForm({...cityForm, contact_phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="reza@primelocalhomes.com"
                        value={cityForm.contact_email || ''}
                        onChange={(e) => setCityForm({...cityForm, contact_email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">CTA Text</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ready to buy or sell in City? Contact Reza Barghlameno today for expert guidance and express service when you need it most."
                      value={cityForm.cta_text || ''}
                      onChange={(e) => setCityForm({...cityForm, cta_text: e.target.value})}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => {
                setShowCityModal(false)
                setEditingCity(null)
                 setCityForm({
                  _id: '',
                  slug: '',
                  name: '',
                  state: '',
                  population: '',
                  avgHomePrice: '',
                  heroImage: '',
                  heroImageAlt: '',
                  shortDescription: '',
                  fullDescription: '',
                  tags: [],
                  neighborhoods: [
                    { name: '', type: 'neighborhood', slug: '', description: '', image: '', imageAlt: '', distance: '', avgHomePrice: '', county: '' }
                  ],
                  highlights: [{ title: '', description: '', icon: '', bgImage: '', bgImageAlt: '' }],
                  faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],

                  seo: {
                    metaTitle: '',
                    metaDescription: '',
                    keywords: '',
                    ogTitle: '',
                    ogDescription: '',
                    ogImage: '',
                    ogImageAlt: '',
                    twitterCard: 'summary_large_image'
                  },
                  schema_markup: [],
                  language: 'en',
                  
   
                  city: '',
                  county: '',
                  url_slug: '',
                  meta_title: '',
                  meta_description: '',
                  h1_title: '',
                  primary_keywords: [],
                  secondary_keywords: [],
                  express_keywords: [],
                  agent_keywords: [],
                  landing_page_text: '',
                  express_service: '',
                  neighborhood_guide: '',
                  market_analysis: '',
                  agent_name: '',

                  company_name: '',
                  contact_phone: '',
                  contact_email: '',
                  cta_text: ''

                })
              }} className="btn btn-secondary">Cancel</button>
              <button type="button" onClick={() => {
                if (editingCity) {
                  updateCity(cityForm)
                } else {
                  createCity(cityForm)
                }
              }} className="btn btn-primary">{editingCity ? 'Update City' : 'Save City'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}