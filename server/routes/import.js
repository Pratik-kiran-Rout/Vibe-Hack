const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

const router = express.Router();

// Import from Medium or Dev.to
router.post('/import', auth, async (req, res) => {
  try {
    const { url, type } = req.body;
    let articles = [];

    if (type === 'medium') {
      articles = await importFromMedium(url);
    } else if (type === 'devto') {
      articles = await importFromDevTo(url);
    }

    const importedBlogs = [];
    for (const article of articles) {
      const blog = new Blog({
        ...article,
        author: req.user._id,
        status: 'draft',
        imported: true,
        importSource: type
      });
      await blog.save();
      importedBlogs.push(blog);
    }

    res.json({
      message: `Successfully imported ${importedBlogs.length} articles`,
      blogs: importedBlogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
});

async function importFromMedium(url) {
  try {
    // Handle Medium RSS feed
    if (url.includes('/feed')) {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data, { xmlMode: true });
      
      const articles = [];
      $('item').each((i, item) => {
        const $item = $(item);
        articles.push({
          title: $item.find('title').text(),
          content: $item.find('content\\:encoded').text() || $item.find('description').text(),
          excerpt: $item.find('description').text().substring(0, 300),
          createdAt: new Date($item.find('pubDate').text()),
          tags: $item.find('category').map((i, cat) => $(cat).text()).get(),
          category: 'Imported'
        });
      });
      
      return articles;
    }
    
    // Handle single Medium article
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    return [{
      title: $('h1').first().text(),
      content: $('article').html() || $('.postArticle-content').html(),
      excerpt: $('h2').first().text().substring(0, 300),
      tags: ['imported', 'medium'],
      category: 'Imported'
    }];
  } catch (error) {
    throw new Error('Failed to import from Medium');
  }
}

async function importFromDevTo(url) {
  try {
    // Handle Dev.to RSS feed
    if (url.includes('/feed')) {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data, { xmlMode: true });
      
      const articles = [];
      $('item').each((i, item) => {
        const $item = $(item);
        articles.push({
          title: $item.find('title').text(),
          content: $item.find('description').text(),
          excerpt: $item.find('description').text().substring(0, 300),
          createdAt: new Date($item.find('pubDate').text()),
          tags: $item.find('category').map((i, cat) => $(cat).text()).get(),
          category: 'Imported'
        });
      });
      
      return articles;
    }
    
    // Handle single Dev.to article via API
    const articleId = url.split('/').pop();
    const response = await axios.get(`https://dev.to/api/articles/${articleId}`);
    const article = response.data;
    
    return [{
      title: article.title,
      content: article.body_markdown,
      excerpt: article.description,
      tags: article.tag_list,
      category: 'Imported',
      createdAt: new Date(article.published_at)
    }];
  } catch (error) {
    throw new Error('Failed to import from Dev.to');
  }
}

module.exports = router;