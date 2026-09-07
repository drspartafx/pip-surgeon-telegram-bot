// Live price snapshots via Twelve Data (free tier: 800 requests/day, no card required).
// Get a free key at https://twelvedata.com — signup only, no billing info needed.
//
// NOTE: The index symbols below (NDX for Nasdaq 100, DJI for Dow Jones / US30 proxy) are
// Twelve Data's standard index tickers as documented, but if either 404s, use their
// symbol search to confirm: https://api.twelvedata.com/symbol_search?symbol=nasdaq

const SYMBOLS = {
  gold: "XAU/USD",
  usdjpy: "USD/JPY",
  nasdaq: "NDX", // Nasdaq 100 — closest free index to NDX100 CFD
  us30: "DJI",   // Dow Jones Industrial Average — closest free index to US30 CFD
};

async function fetchQuote(symbol) {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "error" || !data.price) {
    throw new Error(`Twelve Data fetch failed for ${symbol}: ${JSON.stringify(data)}`);
  }
  return parseFloat(data.price);
}

// Returns a map of label -> price. Missing/failed lookups are null, not fatal —
// the market brief still generates using whatever prices did resolve.
export async function getLivePrices() {
  const results = {};
  for (const [label, symbol] of Object.entries(SYMBOLS)) {
    try {
      results[label] = await fetchQuote(symbol);
    } catch (err) {
      console.error(err.message);
      results[label] = null;
    }
  }
  return results;
}
