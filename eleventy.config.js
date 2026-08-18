module.exports = function (eleventyConfig) {
  // Copie telle quelle des fichiers statiques
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // Collection "projects" triée par le champ `order` (ordre d'affichage)
  eleventyConfig.addCollection("projects", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Petit filtre pour découper un texte en paragraphes
  eleventyConfig.addFilter("paragraphs", (str) =>
    (str || "").split(/\n\s*\n/).filter((p) => p.trim())
  );

  // SEO : nettoie et raccourcit un texte pour une meta description (~160 car.)
  eleventyConfig.addFilter("metaDesc", (str) => {
    if (!str) return "";
    const t = String(str).replace(/\s+/g, " ").trim();
    return t.length > 160 ? t.slice(0, 157).replace(/\s+\S*$/, "") + "…" : t;
  });

  // SEO : transforme un chemin relatif en URL absolue (pour Open Graph)
  eleventyConfig.addFilter("absUrl", (path, base) => {
    try {
      return new URL(path, base).href;
    } catch (e) {
      return path;
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
