const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

module.exports = function (eleventyConfig) {

    const blogDateCache = new Map();
    let blogHistoryLoaded = false;
    const loadBlogHistory = () => {
      if (blogHistoryLoaded) return;
      blogHistoryLoaded = true;
      try {
        const history = execFileSync('git', ['log', '--format=@@%cI', '--name-only', '--', 'src/blog'], {
          cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 5 * 1024 * 1024
        });
        let currentDate;
        for (const line of history.split(/\r?\n/)) {
          if (line.startsWith('@@')) {
            currentDate = new Date(line.slice(2));
          } else if (currentDate && line.endsWith('.md')) {
            const normalizedPath = line.replaceAll('\\', '/');
            if (!blogDateCache.has(normalizedPath)) blogDateCache.set(normalizedPath, currentDate);
          }
        }
      } catch {}
    };
    const getBlogDate = (inputPath, fallbackDate) => {
      if (!inputPath) return fallbackDate;
      loadBlogHistory();
      const relativePath = path.relative(process.cwd(), inputPath).replaceAll('\\', '/').replace(/^\.\//, '');
      return blogDateCache.get(relativePath) || fallbackDate;
    };

    eleventyConfig.addCollection('blogPosts', collectionApi => {
      return collectionApi.getFilteredByTag('posts').sort((a, b) => {
        return getBlogDate(b.inputPath, b.date) - getBlogDate(a.inputPath, a.date);
      });
    });
    eleventyConfig.addFilter('blogDate', post => getBlogDate(post.inputPath, post.date));
    eleventyConfig.addFilter('readableBlogDate', date => new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date));
    const postImageCache = new Map();
    eleventyConfig.addFilter('postImage', post => {
      const inputPath = post.inputPath || '';
      if (postImageCache.has(inputPath)) return postImageCache.get(inputPath);
      let image = '';
      try {
        const absolutePath = path.resolve(process.cwd(), inputPath);
        const blogRoot = path.resolve(process.cwd(), 'src/blog') + path.sep;
        if (absolutePath.startsWith(blogRoot)) {
          const source = fs.readFileSync(absolutePath, 'utf8');
          const match = source.match(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']|!\[[^\]]*\]\(\s*<?([^\s>)]+)>?(?:\s+["'][^"']*["'])?\s*\)/i);
          if (match) image = match[1] || match[2];
        }
      } catch {}
      postImageCache.set(inputPath, image);
      return image;
    });

    eleventyConfig.addWatchTarget("./src/sass/");

    eleventyConfig.addPassthroughCopy("./src/sass/");

    eleventyConfig.addPassthroughCopy('./src/images/');
    eleventyConfig.addPassthroughCopy('./src/js/');
    eleventyConfig.addPassthroughCopy('./src/fonts/');

    return {
     markdownTemplateEngine: 'njk',
     dataTemplateEngine: 'njk',
     htmlTemplateEngine: 'njk',

      dir: {
        input: "src",
        output: "public",
      },
    };
  };

