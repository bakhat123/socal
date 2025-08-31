/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://socal-steel.vercel.app',
//   HAVE TO ADD DOMAIN HERE
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
  generateSitemap: false,
}
