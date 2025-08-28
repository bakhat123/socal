'use client'

import React from 'react'
import styles from '@/styles/Testimonials.module.css'

type Testimonial = {
  id: string
  quote: string
  author: string
  rating?: number
  image?: string
}

interface TestimonialsProps {
  items?: Testimonial[]
  title?: string
  subtitle?: string
  forcePageSize?: number
  showHeader?: boolean
  arrowInset?: number
}

const defaultItems: Testimonial[] = [
  {
    id: 't1',
    quote: `Working with Reza meant to be working with excellency ! We had an incredible experience , due to his professionalism, , was very knowledgeable, and truly invested his willingness and time in helping us find the place we chose . One of the things that personally liked the most , was his charisma, very approachable whenever we came to him with questions . But best of all , he’s very respectful in our requests whether they were religious faith , which was very important for us. He always took the time to understand exactly what we were looking for and guided us through every step of the process with patience and professionalism. We appreciated his sharp eye for detail , another plus for us , and more importantly, his honest advice gave us confidence in our decision to go for the place in Temecula , where we could be closer to our children . We couldn’t have have asked for a better agent and we highly recommend Reza Barghlameno to anyone looking to buy a home .`,
    author: 'Silvia Jacobo',
    rating: 5,
    image: '/clients/client1.png',
  },
  {
    id: 't2',
    quote: `Reza Barghlalmeno made buying our home such an incredible experience—one of the best we’ve had as a family, and I’ve been through quite a few home purchases in my 80+ years! When my daughter came across this Kensington home online, we weren’t sure about working with the agent Zillow paired us with. But from the first phone call, Reza completely put us at ease. He was kind, professional, and so detail-oriented that the entire process felt seamless. We closed in just 18 days, and everything went so smoothly on our end, thanks to his hard work behind the scenes. This house is everything we dreamed of. There’s a charming little casita where my daughter can stay when she visits from out of state. It’s also close to my son, who has developmental disabilities, so we can finally gather together as a family. I’m already imagining hosting book clubs, spending time with my grandson when he visits, and making so many new memories here. Reza wasn’t just helping us buy a house—he was helping us find a home for the next chapter of our lives. He went above and beyond at every step, from handling negotiations to managing all the small details to checking in with us even after the sale was done. I honestly couldn’t be more grateful. If you get the chance to work with Reza, you’re in the best hands possible`,
    author: 'Fern Siegel',
    rating: 5,
    image: '/clients/client2.png',
  },
  {
    id: 't3',
    quote: `I recently had the pleasure of working with Reza and I cannot speak highly enough of the exceptional experience I had. From start to finish, Reza went above and beyond to ensure that my home buying process was as smooth as possible. I met Reza by luck while he was going around my parent’s neighborhood introducing himself to the community. Right from our first meeting, it was clear that Reza was not just knowledgeable, but truly passionate about helping clients find the perfect home. He took the time to listen to my needs, preferences, and concerns, and provided insightful advice on every property we viewed. His attention to detail, responsiveness, and dedication were truly impressive. Whether it was answering questions late at night or scheduling last-minute viewings, Reza was always there for me. One thing that really set them apart was their ability to negotiate on my behalf. I was blown away by the way they handled the entire process — from creating the perfect offer to ensuring that all the paperwork and logistics were taken care of. His expertise and professionalism gave me the confidence I needed to get through the home buying process even during the various setbacks we encountered. Reza was there and fought for us every step of the way through the entire transaction. Beyond the business aspect, Reza made me feel like family. His warmth, patience, and positive attitude made a potentially stressful experience feel much lighter. They truly cared about my family and I finding the right home, and it showed in every interaction. If you are looking for a realtor who will go the extra mile and ensure you have an outstanding experience, I cannot recommend Reza enough. He truly is a standout in the industry!`,
    author: 'Maxim Gantman',
    rating: 5,
    image: '/clients/client3.png',
  },
  {
    id: 't4',
    quote: `My husband and I are first time buyers in San Diego which, as those of us fortunate enough to live here know, has one of the most expensive and competitive housing markets in the nation. We came into this process with very high hopes and very little knowledge. From the moment we met him, Reza has been helpful, understanding, patient, professional, empathetic, and has operated with the highest level of integrity. Our experience was a difficult one, and Reza did a phenomenal job of managing our expectations without squashing our excitement. He helped us maintain our momentum through frustrating loses, and allowed us the space and humanity to grieve when things did not turn out in the ways we expected it. Reza stuck through a huge amount of hurdles with us over the last 7 months. We had the *pleasure* of entering escrow twice during our hunt for the perfect house. The first time we entered escrow was for a house that had a deed attached to it. It was not until after we had entered escrow that Reza discovered there was a significant limit placed on the total annual family income for this house (something both the sellers AND the city of San Marcos were unaware of at the time) that made our family ineligible to live there. He fought for our family, going as far as meeting with a representative of the City of San Marcos at town hall to determine what the issue was with our purchasing of this property. Reza kept us updated both by text and over the phone during every step, and was able to explain the issues at hand in language that allowed us to understand the legalities and complications. He helped us navigate exiting escrow, and grieved with us when our disappointment became overwhelming. The second house we entered escrow (which is now our family home) also had a arduous process that Reza helped us navigate. We had so many issues arise that were completely out of ours, and his, hands; he tackled each one with professionalism and never gave up on our family. We have navigated issues with the seller, disappointing inspection results, a canceled loan, issues with the title that resulted in the loss of our investor, issues with expired HOA documents, and more. The number of times we thought we were going to have to restart this process was overwhelming, but with each new challenge, Reza helped keep us level-headed, fought for us, and found creative ways to work around and through them. His diligence has allowed us to find the home that we are excited to raise our children in, and a community in which we can thrive. In the future, we look forward to working with Reza again, and will continue to recommend him to anyone and everyone we meet that is also going through this process. Purchasing a home is a very frustrating process, and is definitely not for the weak. Knowing that there are people like Reza out there makes it just that much better, safer, enjoyable, and helpful. Thank you, Reza, for all that you have done for our family. We can't wait to have you over for dinner once we are moved in!`,
    author: 'Mary Jane Gantman',
    rating: 5,
    image: '/clients/client4.png',
  },
  {
    id: 't5',
    quote: `Reza was the best agent we have ever worked with. His expertise was beyond belief. He had an approach working with a new realty group that allowed us to make updates to our home and within 3 weeks we had one three day showing and we had 5 offers over asking price. His thoughtfulness kept us on track without stressing us and assured us we would reach our goal to not only sell our home but he worked diligently to find a new home in an area that is 150 miles north of his area. We are forever grateful for him and FAM Realtor Group for all the personal efforts they all put in to help us sell our home and find an new home.`,
    author: 'Russell MacQueen',
    rating: 5,
    image: '/clients/client5.png',
  },
  {
    id: 't6',
    quote: `Reza was incredibly helpful in our home search and in securing our first house! He had knowledge about the area and was always responsive to our questions. He made our first time homeownership process very seamless and handled contact with the seller's agent easily. We highly recommend Reza as he treats his clients as if they were family and wants to make sure the best service is given to them. We really appreciate all his efforts and him being our agent for our first home!`,
    author: 'Pulkit Kaushal',
    rating: 5,
    image: '/clients/client6.png',
  },
]

function getInitials(name: string): string {
  if (!name) return 'CL'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const Testimonials: React.FC<TestimonialsProps> = ({
  items = defaultItems,
  title = 'What Our Clients Say',
  subtitle = 'Real stories from families who found their dream homes with us',
  forcePageSize,
  showHeader = true,
  arrowInset,
}) => {
  const [page, setPage] = React.useState(0)
  const [direction, setDirection] = React.useState<'left' | 'right' | null>(null)
  const [anim, setAnim] = React.useState<'outLeft' | 'inRight' | 'outRight' | 'inLeft' | ''>('')
  const [pageSize, setPageSize] = React.useState(1)
  const quoteRefs = React.useRef<Record<string, HTMLDivElement | null>>({})
  const [overflowing, setOverflowing] = React.useState<Record<string, boolean>>({})

  const computePageSize = React.useCallback(() => {
    if (forcePageSize && forcePageSize > 0) return forcePageSize
    if (typeof window === 'undefined') return 3
    const width = window.innerWidth
    if (width <= 640) return 1
    if (width <= 1024) return 2
    return 3
  }, [forcePageSize])

  React.useEffect(() => {
    setPageSize(computePageSize())
    const onResize = () => setPageSize(computePageSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [computePageSize])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  React.useEffect(() => {
    if (page >= totalPages) setPage(0)
  }, [totalPages, page])

  const handleNext = () => {
    if (items.length <= pageSize) return
    setDirection('left')
    setAnim('outLeft')
    setTimeout(() => {
      setPage((p) => (p + 1) % totalPages)
      setAnim('inRight')
      setTimeout(() => setAnim(''), 450)
    }, 200)
  }

  const handlePrev = () => {
    if (items.length <= pageSize) return
    setDirection('right')
    setAnim('outRight')
    setTimeout(() => {
      setPage((p) => (p - 1 + totalPages) % totalPages)
      setAnim('inLeft')
      setTimeout(() => setAnim(''), 450)
    }, 200)
  }

  const startIndex = page * pageSize
  const current = items.slice(startIndex, startIndex + pageSize)
  const display = current.length < pageSize
    ? [...current, ...items.slice(0, pageSize - current.length)]
    : current

  const animationClass = anim ? styles[anim] : ''

  React.useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => setDirection(null), 350)
      return () => clearTimeout(timer)
    }
  }, [direction])

  const navDisabled = items.length <= pageSize

  // Detect if quotes overflow to decide showing scroll hint/fade
  React.useEffect(() => {
    const map: Record<string, boolean> = {}
    display.forEach((t) => {
      const el = quoteRefs.current[t.id]
      if (el) {
        map[t.id] = el.scrollHeight > el.clientHeight + 2
      }
    })
    // Shallow compare to avoid unnecessary state updates
    let changed = false
    const keys = new Set([...Object.keys(overflowing), ...Object.keys(map)])
    for (const k of keys) {
      if (overflowing[k] !== map[k]) { changed = true; break }
    }
    if (changed) setOverflowing(map)
  }, [display, pageSize])

  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className={styles.container}>
        {showHeader && (
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>
        )}

        <button
          className={`${styles.navBtn} ${styles.navLeft}`}
          style={arrowInset !== undefined ? ({ left: arrowInset } as React.CSSProperties) : undefined}
          aria-label="Previous"
          onClick={handlePrev}
          disabled={navDisabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={`${styles.slider}`}>
          <div className={`${styles.stage}`}>
            <div className={`${styles.grid} ${styles.stack} ${animationClass}`} style={{ gridTemplateColumns: `repeat(${pageSize}, minmax(0, 1fr))` }}>
              {display.map((t) => (
                <div key={t.id} className={styles.card}>
                  {t.rating ? (
                    <div className={styles.stars}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span key={i} className={styles.star}>★</span>
                      ))}
                    </div>
                  ) : null}

                  <div className={styles.client}>
                    <div className={styles.avatar}>
                      {t.image ? (
                        <img src={t.image} alt={t.author} className={styles.clientImage} />
                      ) : (
                        <div className={styles.clientImage} aria-label={t.author}>
                          {getInitials(t.author)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className={styles.clientName}>{t.author}</div>
                      <div className={styles.clientRole}>Happy Client</div>
                    </div>
                  </div>

                  <div className={styles.quoteWrap}>
                    <div ref={(el) => { quoteRefs.current[t.id] = el }} className={`${styles.glass} ${styles.quoteScroll}`}>
                      <p className={styles.quote}>{t.quote}</p>
                    </div>
                    {overflowing[t.id] && (
                      <>
                        <div className={styles.fadeBottom} />
                        <div className={styles.scrollHint}>
                          <span className={styles.chevron}>↑</span>
                          <span className={styles.scrollText}>Scroll</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className={`${styles.navBtn} ${styles.navRight}`}
          style={arrowInset !== undefined ? ({ right: arrowInset } as React.CSSProperties) : undefined}
          aria-label="Next"
          onClick={handleNext}
          disabled={navDisabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}

export default Testimonials


