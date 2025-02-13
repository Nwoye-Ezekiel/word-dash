export const fetchRandomQuote = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
    method: "GET",
    headers: { "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY as string },
  });

  if (!response.ok) {
    throw new Error(`Error fetching quote: ${response.statusText}`);
  }

  const data = await response.json();

  return data[0];
};
