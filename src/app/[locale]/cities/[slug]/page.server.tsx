import fs from 'fs'
import path from 'path'
import CityPage from './page'

async function readCity(locale: string, slug: string) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cities', locale, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

export default async function CityPageServer({ params }: { params: { locale: string; slug: string } }) {
  // Preload city JSON on server to improve TTFB and avoid client-only fetch for first render
  const city = (await readCity(params.locale, params.slug)) || (await readCity('en', params.slug))
  // Pass through to client component for UI; data will be refetched client-side as needed
  return <CityPage params={params as any} />
}


