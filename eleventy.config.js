const sizeOf = require("image-size");
const nodePath = require("node:path");
const fs = require("node:fs");

module.exports = function (eleventyConfig) {
  // Copie telle quelle des fichiers statiques
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

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

  // Dimensions réelles d'une image du dossier /images, lues au build.
  // Sert à écrire width/height sur les <img> : le navigateur réserve la
  // bonne largeur AVANT le chargement (évite le saut de défilement de la
  // galerie mobile, cf. audit T17). Renvoie null si le fichier est absent
  // ou illisible (ex. nouvelle image ajoutée sans build) -> aucun attribut,
  // comportement inchangé.
  eleventyConfig.addFilter("imgSize", (src) => {
    try {
      if (!src || typeof src !== "string" || !src.startsWith("/images/")) return null;
      const file = nodePath.join(__dirname, "src", src);
      if (!fs.existsSync(file)) return null;
      const d = sizeOf(file);
      if (!d || !d.width || !d.height) return null;
      return { width: d.width, height: d.height };
    } catch (e) {
      return null;
    }
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
