const Blog = require('../models/Blog');
const User = require('../models/User');

const generateSitemap = async () => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    // Get all approved blogs
    const blogs = await Blog.find({ status: 'approved' })
      .select('_id updatedAt')
      .sort({ updatedAt: -1 });
    
    // Get all users with published blogs
    const authors = await User.find({
      _id: { $in: await Blog.distinct('author', { status: 'approved' }) }
    }).select('_id username updatedAt');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Add blog URLs
    blogs.forEach(blog => {
      sitemap += `
  <url>
    <loc>${baseUrl}/post/${blog._id}</loc>
    <lastmod>${blog.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add author profile URLs
    authors.forEach(author => {
      sitemap += `
  <url>
    <loc>${baseUrl}/author/${author.username}</loc>
    <lastmod>${author.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';
    
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
};

module.exports = { generateSitemap };