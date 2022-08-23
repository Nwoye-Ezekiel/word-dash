export const wordFormatter = (word: string) => {
  return word
    .replace("”", '"')
    .replace("“", '"')
    .replace("’", "'")
    .replace("‘", "'")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...");
};
