module.exports = function (eleventyConfig) { 

    eleventyConfig.addWatchTarget("./src/sass/");

    eleventyConfig.addPassthroughCopy("./src/sass/");

    eleventyConfig.addPassthroughCopy('./src/images/');

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