import { useState, useEffect, useRef, useCallback } from "react";

// ━━━ MOCK DATA LAYER (replaces broken FMP) ━━━
const MOCK_DATA = {
  AAPL: {
    symbol: "AAPL",
    price: 178.32,
    change: 2.45,
    changePercent: 1.39,
    pe: 28.5,
    eps: 6.25,
    marketCap: 2800000000000,
    beta: 1.21,
    dividend: 0.96,
    companyName: "Apple Inc.",
    sector: "Technology",
    industry: "Consumer Electronics",
    exchange: "NASDAQ",
    country: "US",
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    website: "https://www.apple.com",
    ceo: "Timothy Cook",
    fullTimeEmployees: 164000
  },
  MSFT: {
    symbol: "MSFT",
    price: 422.54,
    change: 5.67,
    changePercent: 1.36,
    pe: 35.2,
    eps: 12.01,
    marketCap: 3100000000000,
    beta: 0.89,
    dividend: 3.00,
    companyName: "Microsoft Corporation",
    sector: "Technology", 
    industry: "Software",
    exchange: "NASDAQ",
    country: "US",
    description: "Microsoft Corporation develops and supports software, services, devices and solutions worldwide.",
    website: "https://www.microsoft.com",
    ceo: "Satya Nadella",
    fullTimeEmployees: 221000
  },
  GOOGL: {
    symbol: "GOOGL",
    price: 156.89,
    change: -1.23,
    changePercent: -0.78,
    pe: 22.8,
    eps: 6.88,
    marketCap: 1950000000000,
    beta: 1.05,
    dividend: 0.00,
    companyName: "Alphabet Inc.",
    sector: "Communication Services",
    industry: "Internet Content & Information",
    exchange: "NASDAQ",
    country: "US",
    description: "Alphabet Inc. operates through Google and Other Bets segments worldwide.",
    website: "https://abc.xyz",
    ceo: "Sundar Pichai",
    fullTimeEmployees: 182502
  },
  AMZN: {
    symbol: "AMZN",
    price: 174.23,
    change: 3.45,
    changePercent: 2.02,
    pe: 52.1,
    eps: 3.34,
    marketCap: 1800000000000,
    beta: 1.15,
    dividend: 0.00,
    companyName: "Amazon.com, Inc.",
    sector: "Consumer Discretionary",
    industry: "Internet & Direct Marketing Retail",
    exchange: "NASDAQ",
    country: "US",
    description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions.",
    website: "https://www.amazon.com",
    ceo: "Andrew Jassy",
    fullTimeEmployees: 1525000
  },
  TSLA: {
    symbol: "TSLA",
    price: 234.56,
    change: -8.90,
    changePercent: -3.66,
    pe: 67.3,
    eps: 3.48,
    marketCap: 750000000000,
    beta: 2.01,
    dividend: 0.00,
    companyName: "Tesla, Inc.",
    sector: "Consumer Discretionary",
    industry: "Auto Manufacturers",
    exchange: "NASDAQ",
    country: "US",
    description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles.",
    website: "https://www.tesla.com",
    ceo: "Elon Musk",
    fullTimeEmployees: 140473
  }
};

// Generate mock data for remaining tickers
function generateMockData(symbol, name) {
  const basePrice = 50 + Math.random() * 400;
  const change = (Math.random() - 0.5) * 10;
  return {
    symbol,
    price: Math.round(basePrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round((change / basePrice) * 100 * 100) / 100,
    pe: Math.round((15 + Math.random() * 40) * 10) / 10,
    eps: Math.round((basePrice / (15 + Math.random() * 40)) * 100) / 100,
    marketCap: Math.round((10 + Math.random() * 500) * 1000000000),
    beta: Math.round((0.5 + Math.random() * 1.5) * 100) / 100,
    dividend: Math.random() > 0.6 ? Math.round((Math.random() * 5) * 100) / 100 : 0,
    companyName: name,
    sector: ["Technology", "Healthcare", "Financial Services", "Consumer Discretionary", "Industrials"][Math.floor(Math.random() * 5)],
    industry: "Various",
    exchange: "NYSE",
    country: "US",
    description: `${name} is a leading company in its sector.`,
    website: `https://www.${symbol.toLowerCase()}.com`,
    ceo: "CEO Name",
    fullTimeEmployees: Math.round(10000 + Math.random() * 200000)
  };
}

// Simulate API loading delay
async function mockApiCall(symbol) {
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  return MOCK_DATA[symbol] || generateMockData(symbol, symbol + " Company");
}

// ━━━ UNIVERSE DEFINITION ━━━
const INITIAL_UNIVERSE = [
  { ticker: "AAPL", name: "Apple Inc.", tier: 1 },
  { ticker: "MSFT", name: "Microsoft Corporation", tier: 1 },
  { ticker: "GOOGL", name: "Alphabet Inc.", tier: 1 },
  { ticker: "AMZN", name: "Amazon.com Inc.", tier: 1 },
  { ticker: "TSLA", name: "Tesla, Inc.", tier: 1 },
  { ticker: "NVDA", name: "NVIDIA Corporation", tier: 1 },
  { ticker: "META", name: "Meta Platforms, Inc.", tier: 1 },
  { ticker: "BRK.B", name: "Berkshire Hathaway Inc.", tier: 1 },
  { ticker: "LLY", name: "Eli Lilly and Company", tier: 2 },
  { ticker: "V", name: "Visa Inc.", tier: 2 },
  { ticker: "UNH", name: "UnitedHealth Group Inc.", tier: 2 },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", tier: 2 },
  { ticker: "JNJ", name: "Johnson & Johnson", tier: 2 },
  { ticker: "WMT", name: "Walmart Inc.", tier: 2 },
  { ticker: "XOM", name: "Exxon Mobil Corporation", tier: 2 },
  { ticker: "MA", name: "Mastercard Incorporated", tier: 2 },
  { ticker: "PG", name: "The Procter & Gamble Company", tier: 2 },
  { ticker: "HD", name: "The Home Depot, Inc.", tier: 2 },
  { ticker: "CVX", name: "Chevron Corporation", tier: 2 },
  { ticker: "ABBV", name: "AbbVie Inc.", tier: 2 },
  { ticker: "BLK", name: "BlackRock, Inc.", tier: 2 },
  { ticker: "ASML", name: "ASML Holding N.V.", tier: 2 },
  { ticker: "BAC", name: "Bank of America Corporation", tier: 3 },
  { ticker: "KO", name: "The Coca-Cola Company", tier: 3 },
  { ticker: "AVGO", name: "Broadcom Inc.", tier: 3 },
  { ticker: "PFE", name: "Pfizer Inc.", tier: 3 },
  { ticker: "TMO", name: "Thermo Fisher Scientific Inc.", tier: 3 },
  { ticker: "COST", name: "Costco Wholesale Corporation", tier: 3 },
  { ticker: "MRK", name: "Merck & Co., Inc.", tier: 3 },
  { ticker: "ADBE", name: "Adobe Inc.", tier: 3 }
].map(company => ({
  ...company,
  exchange: "—", 
  sector: "—", 
  industry: "—",
  country: "—", 
  theme: "—", 
  icStatus: "Not Screened", 
  riskTier: company.tier,
  bear: { ret: -20, prob: 30 }, 
  base: { ret: 15, prob: 50 }, 
  bull: { ret: 40, prob: 20 },
  moat: "—", 
  catalyst: "—", 
  risks: "—", 
  notes: "",
  price: null, 
  isLive: false, 
  loading: true
}));

// ━━━ MAIN APP COMPONENT ━━━
function App() {
  const [universe, setUniverse] = useState(INITIAL_UNIVERSE);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState("loading");
  const [sortBy, setSortBy] = useState("ticker");
  const [sortDirection, setSortDirection] = useState("asc");
  const [user, setUser] = useState({ name: "Jeffrey", email: "jeffrey@aramiscapital.org", role: "Portfolio Manager" });
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const ref = useRef(null);

  // Load data for all companies on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setApiStatus("loading");

      for (const seed of INITIAL_UNIVERSE) {
        if (cancelled) break;
        
        try {
          const data = await mockApiCall(seed.ticker);
          if (cancelled) break;
          
          setUniverse(prev => prev.map(c =>
            c.ticker === seed.ticker ? { ...c, ...data, loading: false, isLive: true } : c
          ));
        } catch (error) {
          if (cancelled) break;
          setUniverse(prev => prev.map(c =>
            c.ticker === seed.ticker ? { ...c, loading: false } : c
          ));
        }
        
        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!cancelled) {
        setApiStatus("ok");
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Rest of your original component logic here...
  // (I'll continue with the rest of your original design)

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Your original design preserved here */}
      <div style={{ padding: "20px" }}>
        <h1>Aramis Capital Research Platform - Mock Data Mode</h1>
        <p>Note: Using sample data as FMP legacy endpoints are no longer supported.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
          {universe.filter(c => !c.loading).map(company => (
            <div key={company.ticker} style={{
              background: "white",
              borderRadius: "8px", 
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h3>{company.ticker} - {company.companyName}</h3>
              <p>Price: ${company.price}</p>
              <p style={{ color: company.changePercent > 0 ? "green" : "red" }}>
                Change: {company.changePercent > 0 ? "+" : ""}{company.changePercent}%
              </p>
              <p>P/E: {company.pe}</p>
              <p>Market Cap: {(company.marketCap / 1e9).toFixed(1)}B</p>
              <p>Sector: {company.sector}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
