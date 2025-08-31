/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://socal-steel.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/api/*'],
      },
    ],
    additionalSitemaps: [
      'https://socal-steel.vercel.app/sitemap.xml',
    ],
  },
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  // Disable static sitemap generation since we're using dynamic route
  generateSitemap: false,
}
