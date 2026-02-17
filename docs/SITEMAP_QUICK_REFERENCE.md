# Sitemap Quick Reference

## 🚀 Quick Commands

```bash
# Generate sitemaps
npm run sitemap

# View sitemaps
# HTML: https://sprintiq.ai/sitemap
# XML: https://sprintiq.ai/sitemap.xml
# Robots: https://sprintiq.ai/robots.txt
```

## 📁 File Locations

- **HTML Sitemap**: `/app/sitemap/page.tsx`
- **XML Sitemap**: `/app/sitemap.xml/route.ts`
- **Generator Script**: `/scripts/generate-sitemap.js`
- **Robots.txt**: `/public/robots.txt`
- **Documentation**: `/docs/SITEMAP_SETUP.md`

## 🔧 Adding New Pages

1. Edit `/scripts/generate-sitemap.js`
2. Add to `pages` array with priority and changefreq
3. Run `npm run sitemap`
4. Update HTML sitemap if needed

## 📊 Priority Levels

- **1.0**: Homepage
- **0.9**: Core features
- **0.8**: Important business pages
- **0.7**: Support pages
- **0.6**: Secondary business
- **0.5**: Legal pages

## 🔄 Change Frequencies

- **daily**: Homepage, dashboard
- **weekly**: Features, support
- **monthly**: About, pricing
- **yearly**: Legal pages

## 📈 Next Steps

1. Submit to Google Search Console
2. Submit to Bing Webmaster Tools
3. Monitor indexing performance
4. Update when adding new pages

---

**For detailed information, see**: `/docs/SITEMAP_SETUP.md`
