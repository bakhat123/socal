import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const baseUrl = process.env.SITE_URL || "https://socal-steel.vercel.app";
    const locales = ['en', 'de', 'fr', 'zh', 'ar', 'es'];
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Fetch all cities
    const cities = await db.collection('cities').find({}).toArray();
    console.log(`✅ Found ${cities.length} cities for sitemap`);
    
    // Fetch all published blogs
    const blogs = await db.collection('blogs').find({ status: 'Published' }).toArray();
    console.log(`✅ Found ${blogs.length} published blogs for sitemap`);
    
    // Fetch counties if you have them
    const counties = await db.collection('counties').find({}).toArray();
    console.log(`✅ Found ${counties?.length || 0} counties for sitemap`);
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

    // Add home pages for all locales
    locales.forEach(locale => {
      sitemap += `
<url>
  <loc>${baseUrl}/${locale}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`;
    });

    // Add static pages for all locales
    const staticPages = ['contact', 'blog', 'cities', 'counties'];
    staticPages.forEach(page => {
      locales.forEach(locale => {
        sitemap += `
<url>
  <loc>${baseUrl}/${locale}/${page}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`;
      });
    });

    // Add city pages for all locales
    cities.forEach(city => {
      locales.forEach(locale => {
        const lastmod = city.updatedAt || city.createdAt || new Date().toISOString();
        sitemap += `
<url>
  <loc>${baseUrl}/${locale}/cities/${city.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
      });
    });

    // Add blog posts for all locales
    blogs.forEach(blog => {
      locales.forEach(locale => {
        const lastmod = blog.updatedAt || blog.createdAt || new Date().toISOString();
        sitemap += `
<url>
  <loc>${baseUrl}/${locale}/blog/${blog.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>`;
      });
    });

    // Add county pages if they exist
    if (counties && counties.length > 0) {
      counties.forEach(county => {
        locales.forEach(locale => {
          const lastmod = county.updatedAt || county.createdAt || new Date().toISOString();
          sitemap += `
<url>
  <loc>${baseUrl}/${locale}/county/${county.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
        });
      });
    }

    // Close the sitemap
    sitemap += `
</urlset>`;

    console.log(`✅ Dynamic sitemap generated with ${locales.length * (1 + staticPages.length + cities.length + blogs.length + (counties?.length || 0))} URLs`);

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('❌ Error generating dynamic sitemap:', error);
    
    // Fallback to basic sitemap if database fails
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>https://socal-steel.vercel.app/en</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

