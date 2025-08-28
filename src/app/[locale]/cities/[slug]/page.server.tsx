import { connectToDatabase } from '@/lib/mongodb'
import CityPage from './page'

async function readCity(locale: string, slug: string) {
  try {
    const { db } = await connectToDatabase()
    const city = await db.collection('cities').findOne({ 
      slug: slug,
      language: locale 
    })
    
    if (!city) {
      // Try English fallback
      if (locale !== 'en') {
        return await db.collection('cities').findOne({ 
          slug: slug,
          language: 'en' 
        })
      }
    }
    
    return city
  } catch (error) {
    console.error('Error reading city from database:', error)
    return null
  }
}

export default async function CityPageServer({ params }: { params: { locale: string; slug: string } }) {
  // Preload city JSON on server to improve TTFB and avoid client-only fetch for first render
  const city = (await readCity(params.locale, params.slug)) || (await readCity('en', params.slug))
  // Pass through to client component for UI; data will be refetched client-side as needed
  return <CityPage params={params as any} />
}


