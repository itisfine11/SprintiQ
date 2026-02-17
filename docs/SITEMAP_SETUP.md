# Sitemap Setup for SprintiQ

This document explains the complete sitemap setup for SprintiQ, including both HTML and XML sitemaps for optimal SEO performance.

## 🎯 What We've Created

### 1. HTML Sitemap (`/sitemap`)

- **Location**: `/app/sitemap/page.tsx`
- **Purpose**: User-friendly navigation and SEO optimization
- **Features**:
  - Organized by categories (Main Pages, Product & Solutions, Business, etc.)
  - Responsive design with hover effects
  - SEO benefits explanation
  - Accessible from footer navigation

### 2. XML Sitemap (`/sitemap.xml`)

- **Location**: `/app/sitemap.xml/route.ts`
- **Purpose**: Search engine crawling and indexing
- **Features**:
  - Proper XML format for search engines
  - Priority and change frequency settings
  - Automatic last modified dates
  - Caching headers for performance

### 3. Robots.txt

- **Location**: `/public/robots.txt`
- **Purpose**: Search engine crawling instructions
- **Features**:
  - Points to both sitemaps
  - Disallows admin and API routes
  - Allows important public pages
  - Crawl delay settings

### 4. Sitemap Generator Script

- **Location**: `/scripts/generate-sitemap.js`
- **Purpose**: Automated sitemap generation and maintenance
- **Features**:
  - Generates both HTML and XML sitemaps
  - Configurable page priorities and change frequencies
  - Easy to run with `npm run sitemap`

## 🚀 How to Use

### Viewing the Sitemaps

- **HTML Sitemap**: Visit `https://sprintiq.ai/sitemap`
- **XML Sitemap**: Visit `https://sprintiq.ai/sitemap.xml`
- **Robots.txt**: Visit `https://sprintiq.ai/robots.txt`

### Generating/Updating Sitemaps

```bash
# Generate both sitemaps
npm run sitemap

# Or run the script directly
node scripts/generate-sitemap.js
```

### Adding New Pages

1. Update the `pages` array in `/scripts/generate-sitemap.js`
2. Add appropriate priority and change frequency
3. Run `npm run sitemap` to regenerate
4. Update the HTML sitemap page if needed

## 📊 SEO Benefits

### For Search Engines

- **Faster Discovery**: Search engines find all pages quickly
- **Better Crawling**: Efficient crawling of your site structure
- **Clear Structure**: Understanding of your website hierarchy
- **Internal Linking**: Additional linking opportunities

### For Users

- **Easy Navigation**: Quick access to all sections
- **Better UX**: Understanding of site structure
- **Accessibility**: Alternative navigation method
- **Mobile Friendly**: Responsive design for all devices

## 🔧 Configuration

### Page Priorities

- **1.0**: Homepage (highest priority)
- **0.9**: Core features and main product pages
- **0.8**: Important business pages
- **0.7**: Support and utility pages
- **0.6**: Secondary business pages
- **0.5**: Legal pages and sitemap itself

### Change Frequencies

- **daily**: Homepage, dashboard
- **weekly**: Features, support, insights
- **monthly**: About, pricing, business pages
- **yearly**: Legal pages, terms, privacy

## 📈 Search Console Setup

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property if not already added
3. Navigate to "Sitemaps" in the left menu
4. Submit your sitemap URL: `https://sprintiq.ai/sitemap.xml`
5. Monitor indexing status and errors

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site if not already added
3. Go to "Sitemaps" section
4. Submit your sitemap URL: `https://sprintiq.ai/sitemap.xml`
5. Monitor submission status

## 🛠️ Maintenance

### Regular Tasks

- **Weekly**: Check for new pages to add
- **Monthly**: Review and update priorities if needed
- **Quarterly**: Audit sitemap performance in search console
- **Annually**: Review and update change frequencies

### When to Regenerate

- Adding new pages or sections
- Changing page priorities
- Updating change frequencies
- Major site structure changes
- After significant content updates

### Monitoring

- Check search console for sitemap errors
- Monitor crawl statistics
- Track indexing performance
- Review user engagement with sitemap

## 🎨 Customization

### Styling the HTML Sitemap

The HTML sitemap uses Tailwind CSS classes and can be customized in:

- `/app/sitemap/page.tsx` - Main content and layout
- `/app/sitemap/loading.tsx` - Loading state
- `/app/sitemap/layout.tsx` - Metadata and structure

### Modifying the Generator Script

Edit `/scripts/generate-sitemap.js` to:

- Change base URL
- Modify page priorities
- Adjust change frequencies
- Add new page categories
- Customize output formatting

## 🚨 Troubleshooting

### Common Issues

1. **Sitemap not accessible**: Check file permissions and routing
2. **Search engines not finding sitemap**: Verify robots.txt and search console submission
3. **Pages not indexing**: Check page priorities and change frequencies
4. **XML errors**: Validate XML format with online tools

### Debugging

- Check browser console for errors
- Verify file paths and permissions
- Test sitemap accessibility
- Monitor search console for issues

## 📚 Best Practices

### Sitemap Design

- Keep it organized and logical
- Use descriptive page titles
- Include all important pages
- Maintain consistent structure

### SEO Optimization

- Submit to all major search engines
- Monitor indexing performance
- Keep sitemaps updated
- Use appropriate priorities

### User Experience

- Make navigation intuitive
- Ensure mobile responsiveness
- Provide clear descriptions
- Include search functionality if possible

## 🔗 Related Files

- `/app/sitemap/page.tsx` - HTML sitemap page
- `/app/sitemap/layout.tsx` - Sitemap layout and metadata
- `/app/sitemap/loading.tsx` - Loading component
- `/app/sitemap.xml/route.ts` - XML sitemap API route
- `/public/robots.txt` - Search engine instructions
- `/scripts/generate-sitemap.js` - Sitemap generator script
- `/components/landing/layout/footer.tsx` - Footer with sitemap link

## 📞 Support

If you encounter issues with the sitemap setup:

1. Check the troubleshooting section above
2. Review the configuration settings
3. Test the sitemap generation script
4. Monitor search console for errors
5. Contact the development team if needed

---

**Last Updated**: ${new Date().toLocaleDateString()}
**Version**: 1.0.0
