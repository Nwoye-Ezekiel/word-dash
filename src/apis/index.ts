const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random?minLength=100&maxLength=150";

export const fetchRandomQuote = () => {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
};
