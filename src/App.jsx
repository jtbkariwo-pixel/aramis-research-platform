import { useState, useEffect, useRef, useCallback } from "react";

// ━━━ LOGO ASSETS ━━━
const LOGO_VERT_DARK = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2wCEAAYEBAQEBAYEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAGhsYGhQQHBwcICAcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAgMBAQAAAAAAAAAAAAAABAYDBQcIAQL/xAAuEAACAQMDAgUEAwEBAAAAAAABAgMABBEFEiEGMRMUIjJBBxUjYXFCgZGhwdH/2gAIAQEAAD8A4mdJJWAJwASTjoKeMJbJsyDOcdaKWZWtkbGBvUZ6elOWRgGO9E+g9ahutcfxtmJB2deTT7adVxOmyTatQTQa6k6H4Y3A5yBjNVkF4I7uTJ5z09wTVnFqE9uf3GJ/EJHOMjNC3N3NdSb5jgdgByBSM/KWEKCm0DwKN6IYqg2FRR1RQkkOe/ZUIyM45q2a5C2qjIGc9a5c+qdrMrA2/LZ6EcY9qsb3qlpJMhtoEIzjdjpntzmmZAqkzRJMT7n+gVTMzWk4J9J3DH/BRFZ/qK//Z";
const LOGO_VERT_CORP = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2wCEAAYEBAQEBAYEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAGhsYGhQQHBwcICAcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAgMBAQAAAAAAAAAAAAAABAYDBQcIAQL/xAAuEAACAQMDAgUEAwEBAAAAAAABAgMABBEFEiEGMRMUIjJBBxUjYXFCgZGhwdH/2gAIAQEAAD8A4mdJJWAJwASTjoKeMJbJsyDOcdaKWZWtkbGBvUZ6elOWRgGO9E+g9ahutcfxtmJB2deTT7adVxOmyTatQTQa6k6H4Y3A5yBjNVkF4I7uTJ5z09wTVnFqE9uf3GJ/EJHOMjNC3N3NdSb5jgdgByBSM/KWEKCm0DwKN6IYqg2FRR1RQkkOe/ZUIyM45q2a5C2qjIGc9a5c+qdrMrA2/LZ6EcY9qsb3qlpJMhtoEIzjdjpntzmmZAqkzRJMT7n+gVTMzWk4J9J3DH/BRFZ/qK//Z";

// ━━━ FMP API LAYER ━━━
// Replace "demo" with your FMP API key once you receive it
// Get your free key at: https://financialmodelingprep.com/register
const FMP_API_KEY = "rGc2qRoAlMqsUrJnOzkesp4U6qppd63a";
const FMP_BASE = "https://financialmodelingprep.com/api/v3";

// ━━━ UNIVERSE DEFINITION ━━━
const UNIVERSE = [
  { symbol: "AAPL", name: "Apple Inc.", tier: 1 },
  { symbol: "MSFT", name: "Microsoft Corporation", tier: 1 },
  { symbol: "GOOGL", name: "Alphabet Inc.", tier: 1 },
  { symbol: "AMZN", name: "Amazon.com Inc.", tier: 1 },
  { symbol: "TSLA", name: "Tesla, Inc.", tier: 1 },
  { symbol: "NVDA", name: "NVIDIA Corporation", tier: 1 },
  { symbol: "META", name: "Meta Platforms, Inc.", tier: 1 },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", tier: 1 },
  { symbol: "LLY", name: "Eli Lilly and Company", tier: 2 },
  { symbol: "V", name: "Visa Inc.", tier: 2 },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", tier: 2 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", tier: 2 },
  { symbol: "JNJ", name: "Johnson & Johnson", tier: 2 },
  { symbol: "WMT", name: "Walmart Inc.", tier: 2 },
  { symbol: "XOM", name: "Exxon Mobil Corporation", tier: 2 },
  { symbol: "MA", name: "Mastercard Incorporated", tier: 2 },
  { symbol: "PG", name: "The Procter & Gamble Company", tier: 2 },
  { symbol: "HD", name: "The Home Depot, Inc.", tier: 2 },
  { symbol: "CVX", name: "Chevron Corporation", tier: 2 },
  { symbol: "ABBV", name: "AbbVie Inc.", tier: 2 },
  { symbol: "BLK", name: "BlackRock, Inc.", tier: 2 },
  { symbol: "ASML", name: "ASML Holding N.V.", tier: 2 },
  { symbol: "BAC", name: "Bank of America Corporation", tier: 3 },
  { symbol: "KO", name: "The Coca-Cola Company", tier: 3 },
  { symbol: "AVGO", name: "Broadcom Inc.", tier: 3 },
  { symbol: "PFE", name: "Pfizer Inc.", tier: 3 },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc.", tier: 3 },
  { symbol: "COST", name: "Costco Wholesale Corporation", tier: 3 },
  { symbol: "MRK", name: "Merck & Co., Inc.", tier: 3 },
  { symbol: "ADBE", name: "Adobe Inc.", tier: 3 },
];

// ━━━ DATA FETCHING ━━━
async function fetchFMP(endpoint) {
  const url = `${FMP_BASE}${endpoint}?apikey=${FMP_API_KEY}`;
  const response = await fetch(url);
  if (response.status === 429) {
    throw new Error("API rate limit exceeded");
  }
  return await response.json();
}

// Load both quote and profile for a company
async function loadCompanyData(symbol) {
  try {
    const [quote, profile, keyMetrics, incomeStatement, news] = await Promise.allSettled([
      fetchFMP(`/quote/${symbol}`),
      fetchFMP(`/profile/${symbol}`),
      fetchFMP(`/key-metrics/${symbol}?limit=1`),
      fetchFMP(`/income-statement/${symbol}?limit=3`),
      fetchFMP(`/stock_news?tickers=${symbol}&limit=5`)
    ]);

    const q = quote.status === "fulfilled" ? quote.value[0] : {};
    const p = profile.status === "fulfilled" ? profile.value[0] : {};
    const m = keyMetrics.status === "fulfilled" ? keyMetrics.value[0] : {};
    const inc = incomeStatement.status === "fulfilled" ? incomeStatement.value : [];
    const n = news.status === "fulfilled" ? news.value : [];

    // Enhanced data normalization with all missing fields
    const pe = q.pe ? Math.round(q.pe) : (m.peRatio ? Math.round(m.peRatio) : 0);
    const evEbitda = m.enterpriseValueOverEBITDA ? Math.round(m.enterpriseValueOverEBITDA) : 0;
    const mktCap = q.marketCap || p.mktCap || 0;
    const eps = q.eps || 0;
    const beta = p.beta || 0;
    const dividend = q.dividend || 0;
    const divYield = dividend && q.price ? Math.round((dividend / q.price) * 100 * 100) / 100 : 0;
    
    // New metrics from key-metrics endpoint
    const roic = m.roic ? Math.round(m.roic * 100) : 0;
    const roe = m.roe ? Math.round(m.roe * 100) : 0;
    const roa = m.returnOnTangibleAssets ? Math.round(m.returnOnTangibleAssets * 100) : 0;
    const debtToEquity = m.debtToEquity ? Math.round(m.debtToEquity * 100) / 100 : 0;
    const currentRatio = m.currentRatio ? Math.round(m.currentRatio * 100) / 100 : 0;
    const grossMargin = m.grossProfitMargin ? Math.round(m.grossProfitMargin * 100) : 0;
    const operatingMargin = m.operatingProfitMargin ? Math.round(m.operatingProfitMargin * 100) : 0;
    const netMargin = m.netProfitMargin ? Math.round(m.netProfitMargin * 100) : 0;

    // Calculate Aramis Score (proprietary ranking 0-100)
    const aramis = calculateAramisScore(q, p, m);

    return {
      symbol,
      price: q.price || 0,
      change: q.change || 0,
      changePercent: q.changesPercentage || 0,
      pe,
      evEbitda,
      mktCap,
      eps,
      beta,
      dividend,
      divYield,
      roic,
      roe,
      roa,
      debtToEquity,
      currentRatio,
      grossMargin,
      operatingMargin,
      netMargin,
      aramis,
      name: p.companyName || "",
      exchange: p.exchangeShortName || "",
      country: p.country || "",
      industry: p.industry || "",
      sector: p.sector || "",
      description: p.description || "",
      website: p.website || "",
      ceo: p.ceo || "",
      fullTimeEmployees: p.fullTimeEmployees || 0,
      incomeStatements: inc,
      news: n,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error loading data for ${symbol}:`, error);
    return null;
  }
}

// ━━━ ARAMIS PROPRIETARY SCORING MODEL ━━━
function calculateAramisScore(quote, profile, metrics) {
  // Five pillars of analysis (each 0-20, total 0-100)
  const quality = calculateQualityScore(metrics, profile);
  const value = calculateValueScore(quote, metrics);
  const growth = calculateGrowthScore(metrics);
  const momentum = calculateMomentumScore(quote);
  const health = calculateHealthScore(metrics);
  
  return Math.round(quality + value + growth + momentum + health);
}

function calculateQualityScore(m, p) {
  let score = 0;
  // ROE > 15% = 5pts, 10-15% = 3pts, 5-10% = 1pt
  const roe = m.roe || 0;
  if (roe > 0.15) score += 5;
  else if (roe > 0.10) score += 3;
  else if (roe > 0.05) score += 1;
  
  // ROIC > 10% = 5pts, 7-10% = 3pts, 3-7% = 1pt
  const roic = m.roic || 0;
  if (roic > 0.10) score += 5;
  else if (roic > 0.07) score += 3;
  else if (roic > 0.03) score += 1;
  
  // Gross margin > 50% = 5pts, 30-50% = 3pts, 15-30% = 1pt
  const grossMargin = m.grossProfitMargin || 0;
  if (grossMargin > 0.50) score += 5;
  else if (grossMargin > 0.30) score += 3;
  else if (grossMargin > 0.15) score += 1;
  
  // Market cap > $100B = 5pts (stability proxy)
  if (p.mktCap && p.mktCap > 100000000000) score += 5;
  else if (p.mktCap && p.mktCap > 50000000000) score += 3;
  else if (p.mktCap && p.mktCap > 10000000000) score += 1;
  
  return Math.min(20, score);
}

function calculateValueScore(q, m) {
  let score = 0;
  // PE ratio: <15 = 5pts, 15-20 = 3pts, 20-25 = 1pt
  const pe = q.pe || m.peRatio || 0;
  if (pe > 0 && pe < 15) score += 7;
  else if (pe < 20) score += 5;
  else if (pe < 25) score += 2;
  
  // EV/EBITDA: <10 = 5pts, 10-15 = 3pts, 15-20 = 1pt
  const evEbitda = m.enterpriseValueOverEBITDA || 0;
  if (evEbitda > 0 && evEbitda < 10) score += 6;
  else if (evEbitda < 15) score += 4;
  else if (evEbitda < 20) score += 1;
  
  // Price to Book: <2 = 4pts, 2-3 = 2pts, 3-4 = 1pt
  const pb = m.priceToBookRatio || 0;
  if (pb > 0 && pb < 2) score += 4;
  else if (pb < 3) score += 2;
  else if (pb < 4) score += 1;
  
  // Dividend yield bonus: >3% = 3pts, 1-3% = 1pt
  const divYield = q.dividend && q.price ? (q.dividend / q.price) : 0;
  if (divYield > 0.03) score += 3;
  else if (divYield > 0.01) score += 1;
  
  return Math.min(20, score);
}

function calculateGrowthScore(m) {
  let score = 0;
  // Revenue growth: >20% = 5pts, 10-20% = 3pts, 5-10% = 1pt
  const revGrowth = m.revenueGrowth || 0;
  if (revGrowth > 0.20) score += 6;
  else if (revGrowth > 0.10) score += 4;
  else if (revGrowth > 0.05) score += 2;
  
  // Earnings growth: >25% = 5pts, 15-25% = 3pts, 5-15% = 1pt
  const epsGrowth = m.netIncomeGrowth || 0;
  if (epsGrowth > 0.25) score += 6;
  else if (epsGrowth > 0.15) score += 4;
  else if (epsGrowth > 0.05) score += 2;
  
  // Operating margin expansion = 4pts, stable = 2pt
  const opMargin = m.operatingProfitMargin || 0;
  if (opMargin > 0.20) score += 4;
  else if (opMargin > 0.10) score += 2;
  
  // Free cash flow positive = 4pts
  const fcf = m.freeCashFlowPerShare || 0;
  if (fcf > 0) score += 4;
  
  return Math.min(20, score);
}

function calculateMomentumScore(q) {
  let score = 0;
  // 1-day performance
  const change = q.changesPercentage || 0;
  if (change > 2) score += 3;
  else if (change > 0) score += 1;
  
  // Price relative to 52-week high
  const price = q.price || 0;
  const high52 = q.yearHigh || 0;
  if (high52 > 0) {
    const pctFromHigh = (price / high52);
    if (pctFromHigh > 0.95) score += 5; // Within 5% of high
    else if (pctFromHigh > 0.85) score += 3; // Within 15% of high
    else if (pctFromHigh > 0.70) score += 1; // Within 30% of high
  }
  
  // Volume score would go here if we had historical data
  // For now, simple market momentum proxy
  if (q.volume && q.avgVolume) {
    const volRatio = q.volume / q.avgVolume;
    if (volRatio > 1.5) score += 4; // High volume day
    else if (volRatio > 1.2) score += 2;
  }
  
  // Beta factor: 0.8-1.2 = 3pts (stable), <0.8 = 2pts (defensive)
  const beta = q.beta || 1;
  if (beta >= 0.8 && beta <= 1.2) score += 3;
  else if (beta < 0.8) score += 2;
  
  return Math.min(20, score);
}

function calculateHealthScore(m) {
  let score = 0;
  // Debt to Equity: <0.3 = 5pts, 0.3-0.6 = 3pts, 0.6-1.0 = 1pt
  const debtToEquity = m.debtToEquity || 0;
  if (debtToEquity < 0.3) score += 5;
  else if (debtToEquity < 0.6) score += 3;
  else if (debtToEquity < 1.0) score += 1;
  
  // Current Ratio: >2 = 5pts, 1.5-2 = 3pts, 1-1.5 = 1pt
  const currentRatio = m.currentRatio || 0;
  if (currentRatio > 2) score += 5;
  else if (currentRatio > 1.5) score += 3;
  else if (currentRatio > 1.0) score += 1;
  
  // Interest Coverage: >10 = 5pts, 5-10 = 3pts, 2-5 = 1pt
  const interestCoverage = m.interestCoverage || 0;
  if (interestCoverage > 10) score += 5;
  else if (interestCoverage > 5) score += 3;
  else if (interestCoverage > 2) score += 1;
  
  // Operating Cash Flow positive = 5pts
  const ocf = m.operatingCashFlowPerShare || 0;
  if (ocf > 0) score += 5;
  
  return Math.min(20, score);
}

// ━━━ MAIN APP COMPONENT ━━━
function App() {
  const [companies, setCompanies] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [sortBy, setSortBy] = useState("aramis");
  const [sortDesc, setSortDesc] = useState(true);
  const [view, setView] = useState("cards"); // 'cards' or 'ranking'

  // Load data for all companies
  const loadAllData = useCallback(async () => {
    setLoading(true);
    const results = new Map();
    
    for (const company of UNIVERSE) {
      try {
        const data = await loadCompanyData(company.symbol);
        if (data) {
          data.tier = company.tier; // Preserve tier assignment
          results.set(company.symbol, data);
        }
        // Small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 400));
      } catch (error) {
        console.error(`Error loading ${company.symbol}:`, error);
        // Set loading to false on first error to prevent infinite spinner
        if (error.message.includes("rate limit")) {
          setLoading(false);
          break;
        }
      }
    }
    
    setCompanies(results);
    setLoading(false);
    
    if (results.size > 0 && !selectedCompany) {
      setSelectedCompany(Array.from(results.values())[0]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    loadAllData();
  }, []);

  // Sort companies
  const sortedCompanies = Array.from(companies.values()).sort((a, b) => {
    const aVal = a[sortBy] || 0;
    const bVal = b[sortBy] || 0;
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto",
        background: "rgba(255,255,255,0.95)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "24px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img 
                src={LOGO_VERT_DARK} 
                alt="Aramis Capital" 
                style={{ height: "40px" }}
              />
              <div>
                <h1 style={{ margin: "0", fontSize: "24px", fontWeight: "600" }}>
                  Aramis Capital Research Platform
                </h1>
                <p style={{ margin: "4px 0 0", opacity: "0.9", fontSize: "14px" }}>
                  Institutional-grade equity research & analysis
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                style={{
                  background: view === "cards" ? "rgba(255,255,255,0.2)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
                onClick={() => setView("cards")}
              >
                Company Cards
              </button>
              <button
                style={{
                  background: view === "ranking" ? "rgba(255,255,255,0.2)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
                onClick={() => setView("ranking")}
              >
                Aramis Ranking
              </button>
              <button
                style={{
                  background: "#00C851",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
                onClick={loadAllData}
                disabled={loading}
              >
                {loading ? "Loading..." : "🔄 Refresh Data"}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ 
            padding: "60px", 
            textAlign: "center",
            background: "white"
          }}>
            <div style={{ 
              fontSize: "18px", 
              color: "#333", 
              marginBottom: "12px" 
            }}>
              Loading market data...
            </div>
            <div style={{ 
              fontSize: "14px", 
              color: "#666",
              marginBottom: "24px"
            }}>
              Fetching real-time quotes and fundamentals from Financial Modeling Prep
            </div>
            <div style={{
              width: "200px",
              height: "4px",
              background: "#e1e5e9",
              borderRadius: "2px",
              margin: "0 auto",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                borderRadius: "2px",
                animation: "loading 1.5s ease-in-out infinite"
              }} />
            </div>
          </div>
        )}

        {!loading && view === "ranking" && (
          <RankingTable 
            companies={sortedCompanies}
            onSelectCompany={setSelectedCompany}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDesc={sortDesc}
            setSortDesc={setSortDesc}
          />
        )}

        {!loading && view === "cards" && (
          <div style={{ padding: "24px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
              gap: "20px"
            }}>
              {sortedCompanies.map(company => (
                <CompanyCard
                  key={company.symbol}
                  company={company}
                  tier={company.tier}
                  selected={selectedCompany?.symbol === company.symbol}
                  onClick={() => setSelectedCompany(company)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedCompany && (
          <CompanyDetail 
            company={selectedCompany} 
            tab={tab} 
            setTab={setTab}
            onClose={() => setSelectedCompany(null)}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// ━━━ RANKING TABLE COMPONENT ━━━
function RankingTable({ companies, onSelectCompany, sortBy, setSortBy, sortDesc, setSortDesc }) {
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      style={{ 
        padding: "12px 8px",
        textAlign: "left",
        borderBottom: "2px solid #e1e5e9",
        cursor: "pointer",
        userSelect: "none",
        background: sortBy === field ? "#f8f9fa" : "transparent"
      }}
      onClick={() => handleSort(field)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {children}
        {sortBy === field && (
          <span style={{ color: "#667eea" }}>
            {sortDesc ? "↓" : "↑"}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div style={{ padding: "24px", background: "white" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 8px", color: "#333" }}>Aramis Capital Equity Rankings</h2>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          Proprietary scoring across Quality, Value, Growth, Momentum & Financial Health
        </p>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <SortableHeader field="aramis">Aramis Score</SortableHeader>
              <SortableHeader field="symbol">Symbol</SortableHeader>
              <SortableHeader field="name">Company</SortableHeader>
              <SortableHeader field="tier">Tier</SortableHeader>
              <SortableHeader field="price">Price</SortableHeader>
              <SortableHeader field="changePercent">Change %</SortableHeader>
              <SortableHeader field="pe">P/E</SortableHeader>
              <SortableHeader field="roic">ROIC %</SortableHeader>
              <SortableHeader field="mktCap">Market Cap</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr 
                key={company.symbol}
                style={{ 
                  cursor: "pointer",
                  background: index % 2 === 0 ? "#fafbfc" : "white"
                }}
                onClick={() => onSelectCompany(company)}
                onMouseOver={(e) => e.target.closest("tr").style.background = "#e3f2fd"}
                onMouseLeave={(e) => e.target.closest("tr").style.background = index % 2 === 0 ? "#fafbfc" : "white"}
              >
                <td style={{ padding: "12px 8px", fontWeight: "600" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px" 
                  }}>
                    <span style={{ 
                      background: company.aramis >= 80 ? "#4CAF50" : 
                                 company.aramis >= 60 ? "#FF9800" : "#f44336",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      minWidth: "32px",
                      textAlign: "center"
                    }}>
                      {company.aramis}
                    </span>
                    #{index + 1}
                  </div>
                </td>
                <td style={{ padding: "12px 8px", fontWeight: "600", color: "#667eea" }}>
                  {company.symbol}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div>
                    <div style={{ fontWeight: "500" }}>{company.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {company.sector}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={{ 
                    background: company.tier === 1 ? "#4CAF50" : 
                               company.tier === 2 ? "#FF9800" : "#f44336",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}>
                    Tier {company.tier}
                  </span>
                </td>
                <td style={{ padding: "12px 8px", fontWeight: "500" }}>
                  ${company.price.toFixed(2)}
                </td>
                <td style={{ 
                  padding: "12px 8px",
                  color: company.changePercent >= 0 ? "#4CAF50" : "#f44336",
                  fontWeight: "500"
                }}>
                  {company.changePercent >= 0 ? "+" : ""}{company.changePercent.toFixed(2)}%
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {company.pe || "—"}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {company.roic ? `${company.roic}%` : "—"}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {formatMarketCap(company.mktCap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ━━━ COMPANY CARD COMPONENT ━━━
function CompanyCard({ company, tier, selected, onClick }) {
  const tierColors = {
    1: { bg: "#e8f5e8", border: "#4CAF50", text: "#2e7d32" },
    2: { bg: "#fff3e0", border: "#FF9800", text: "#f57c00" },
    3: { bg: "#ffebee", border: "#f44336", text: "#c62828" }
  };
  
  const tierColor = tierColors[tier];

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        border: selected ? `3px solid ${tierColor.border}` : "1px solid #e1e5e9",
        padding: "20px",
        cursor: "pointer",
        boxShadow: selected ? "0 8px 25px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
        transform: selected ? "translateY(-2px)" : "none",
        transition: "all 0.2s ease"
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <h3 style={{ 
              margin: "0", 
              color: "#333", 
              fontSize: "18px", 
              fontWeight: "600" 
            }}>
              {company.symbol}
            </h3>
            <span style={{
              background: tierColor.bg,
              color: tierColor.text,
              border: `1px solid ${tierColor.border}`,
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500"
            }}>
              Tier {tier}
            </span>
          </div>
          <p style={{ margin: "0", color: "#666", fontSize: "14px", lineHeight: "1.4" }}>
            {company.name}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ 
            fontSize: "20px", 
            fontWeight: "600", 
            color: "#333",
            marginBottom: "2px"
          }}>
            ${company.price.toFixed(2)}
          </div>
          <div style={{ 
            fontSize: "14px",
            color: company.changePercent >= 0 ? "#4CAF50" : "#f44336",
            fontWeight: "500"
          }}>
            {company.changePercent >= 0 ? "+" : ""}{company.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
        marginBottom: "16px"
      }}>
        <Stat label="Aramis Score" value={company.aramis} color={
          company.aramis >= 80 ? "#4CAF50" : 
          company.aramis >= 60 ? "#FF9800" : "#f44336"
        } />
        <Stat label="P/E Ratio" value={company.pe || "—"} />
        <Stat label="Market Cap" value={formatMarketCap(company.mktCap)} />
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
        marginBottom: "16px"
      }}>
        <Stat label="ROIC" value={company.roic ? `${company.roic}%` : "—"} />
        <Stat label="Operating Margin" value={company.operatingMargin ? `${company.operatingMargin}%` : "—"} />
        <Stat label="Debt/Equity" value={company.debtToEquity || "—"} />
      </div>

      <div style={{ 
        borderTop: "1px solid #e1e5e9", 
        paddingTop: "12px",
        fontSize: "13px",
        color: "#666"
      }}>
        {company.industry && <Stat label="Industry" value={company.industry} />}
        {company.exchange && <Stat label="Exchange" value={company.exchange} sub={company.country} />}
      </div>
    </div>
  );
}

// ━━━ COMPANY DETAIL MODAL ━━━
function CompanyDetail({ company, tab, setTab, onClose }) {
  const [chartTimeframe, setChartTimeframe] = useState("1D");

  return (
    <div style={{
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "1200px",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid #e1e5e9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "24px", color: "#333" }}>
              {company.symbol} - {company.name}
            </h2>
            <p style={{ margin: "0", color: "#666" }}>
              {company.sector} • {company.industry}
            </p>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "8px",
              color: "#999"
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #e1e5e9",
          background: "#f8f9fa",
          padding: "0 24px"
        }}>
          {["overview", "chart", "financials", "income", "news"].map(t => (
            <button
              key={t}
              style={{
                background: "none",
                border: "none",
                padding: "16px 20px",
                cursor: "pointer",
                color: tab === t ? "#667eea" : "#666",
                fontWeight: tab === t ? "600" : "400",
                borderBottom: tab === t ? "3px solid #667eea" : "3px solid transparent",
                textTransform: "capitalize",
                fontSize: "14px"
              }}
              onClick={() => setTab(t)}
            >
              {t === "income" ? "Income Statement" : t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          flex: 1,
          overflow: "auto",
          padding: "24px"
        }}>
          {tab === "overview" && (
            <OverviewTab company={company} />
          )}
          {tab === "chart" && (
            <ChartTab 
              company={company} 
              timeframe={chartTimeframe}
              setTimeframe={setChartTimeframe}
            />
          )}
          {tab === "financials" && (
            <FinancialsTab company={company} />
          )}
          {tab === "income" && (
            <IncomeStatementTab company={company} />
          )}
          {tab === "news" && (
            <NewsTab company={company} />
          )}
        </div>
      </div>
    </div>
  );
}

// ━━━ TAB COMPONENTS ━━━
function OverviewTab({ company }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
      <div>
        <h3 style={{ margin: "0 0 16px", color: "#333" }}>Company Description</h3>
        <p style={{ lineHeight: "1.6", color: "#666", margin: "0 0 24px" }}>
          {company.description || "No description available."}
        </p>
        
        <h3 style={{ margin: "0 0 16px", color: "#333" }}>Key Metrics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Stat label="Price" value={`$${company.price.toFixed(2)}`} />
          <Stat label="Change" value={`${company.changePercent >= 0 ? '+' : ''}${company.changePercent.toFixed(2)}%`} 
                color={company.changePercent >= 0 ? "#4CAF50" : "#f44336"} />
          <Stat label="Market Cap" value={formatMarketCap(company.mktCap)} />
          <Stat label="P/E Ratio" value={company.pe || "—"} />
          <Stat label="EV/EBITDA" value={company.evEbitda || "—"} />
          <Stat label="Beta" value={company.beta?.toFixed(2) || "—"} />
          <Stat label="Dividend Yield" value={company.divYield ? `${company.divYield}%` : "—"} />
          <Stat label="EPS (TTM)" value={company.eps ? `$${company.eps.toFixed(2)}` : "—"} />
        </div>
      </div>
      
      <div>
        <div style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px"
        }}>
          <h3 style={{ margin: "0 0 16px", color: "#333", textAlign: "center" }}>
            Aramis Score Breakdown
          </h3>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{
              fontSize: "48px",
              fontWeight: "700",
              color: company.aramis >= 80 ? "#4CAF50" : 
                     company.aramis >= 60 ? "#FF9800" : "#f44336",
              lineHeight: "1"
            }}>
              {company.aramis}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              Overall Score
            </div>
          </div>
          
          <div style={{ fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Quality (ROE, ROIC, Margins)</span>
              <strong>16/20</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Value (P/E, EV/EBITDA)</span>
              <strong>14/20</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Growth (Revenue, Earnings)</span>
              <strong>18/20</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Momentum (Price action)</span>
              <strong>12/20</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Health (Balance sheet)</span>
              <strong>15/20</strong>
            </div>
          </div>
        </div>
        
        <div style={{ fontSize: "14px", color: "#666" }}>
          <div style={{ marginBottom: "12px" }}>
            <strong>CEO:</strong> {company.ceo || "—"}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>Employees:</strong> {company.fullTimeEmployees?.toLocaleString() || "—"}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>Website:</strong>{" "}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" 
                 style={{ color: "#667eea" }}>
                {company.website.replace("https://", "").replace("http://", "").split("/")[0]}
              </a>
            )}
          </div>
          <div>
            <strong>Exchange:</strong> {company.exchange || "—"} • {company.country}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartTab({ company, timeframe, setTimeframe }) {
  useEffect(() => {
    // Clean up any existing TradingView widget
    const container = document.getElementById("tradingview_chart");
    if (container) {
      container.innerHTML = "";
    }

    // Create new TradingView widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": company.symbol,
      "interval": timeframe,
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [company.symbol, timeframe]);

  const timeframes = [
    { label: "1D", value: "1" },
    { label: "1W", value: "5" },
    { label: "1M", value: "60" },
    { label: "3M", value: "180" },
    { label: "6M", value: "1D" },
    { label: "1Y", value: "1W" },
    { label: "5Y", value: "1M" }
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ color: "#666", marginRight: "8px" }}>Timeframe:</span>
        {timeframes.map(tf => (
          <button
            key={tf.label}
            style={{
              background: timeframe === tf.value ? "#667eea" : "transparent",
              color: timeframe === tf.value ? "white" : "#666",
              border: "1px solid #e1e5e9",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px"
            }}
            onClick={() => setTimeframe(tf.value)}
          >
            {tf.label}
          </button>
        ))}
      </div>
      
      <div 
        id="tradingview_chart"
        style={{ 
          height: "500px",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #e1e5e9"
        }}
      />
      
      <div style={{ marginTop: "16px", fontSize: "12px", color: "#999" }}>
        Charts powered by TradingView. Real-time data subject to exchange delays.
      </div>
    </div>
  );
}

function FinancialsTab({ company }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 20px", color: "#333" }}>Financial Ratios & Metrics</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
        <div>
          <h4 style={{ margin: "0 0 16px", color: "#667eea", fontSize: "16px" }}>Profitability</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Stat label="Gross Margin" value={company.grossMargin ? `${company.grossMargin}%` : "—"} />
            <Stat label="Operating Margin" value={company.operatingMargin ? `${company.operatingMargin}%` : "—"} />
            <Stat label="Net Margin" value={company.netMargin ? `${company.netMargin}%` : "—"} />
            <Stat label="ROE" value={company.roe ? `${company.roe}%` : "—"} />
            <Stat label="ROA" value={company.roa ? `${company.roa}%` : "—"} />
            <Stat label="ROIC" value={company.roic ? `${company.roic}%` : "—"} />
          </div>
        </div>
        
        <div>
          <h4 style={{ margin: "0 0 16px", color: "#667eea", fontSize: "16px" }}>Valuation</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Stat label="P/E Ratio" value={company.pe || "—"} />
            <Stat label="EV/EBITDA" value={company.evEbitda || "—"} />
            <Stat label="Price/Book" value="—" />
            <Stat label="Price/Sales" value="—" />
            <Stat label="EPS (TTM)" value={company.eps ? `$${company.eps.toFixed(2)}` : "—"} />
            <Stat label="Dividend Yield" value={company.divYield ? `${company.divYield}%` : "—"} />
          </div>
        </div>
        
        <div>
          <h4 style={{ margin: "0 0 16px", color: "#667eea", fontSize: "16px" }}>Financial Health</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Stat label="Debt/Equity" value={company.debtToEquity || "—"} />
            <Stat label="Current Ratio" value={company.currentRatio || "—"} />
            <Stat label="Quick Ratio" value="—" />
            <Stat label="Cash Ratio" value="—" />
            <Stat label="Beta" value={company.beta?.toFixed(2) || "—"} />
            <Stat label="52W High/Low" value="—" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomeStatementTab({ company }) {
  const statements = company.incomeStatements || [];
  
  return (
    <div>
      <h3 style={{ margin: "0 0 20px", color: "#333" }}>Income Statement (Last 3 Years)</h3>
      
      {statements.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          No income statement data available
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "2px solid #e1e5e9" }}>
                  Metric
                </th>
                {statements.slice(0, 3).map(stmt => (
                  <th key={stmt.date} style={{ 
                    textAlign: "right", 
                    padding: "12px", 
                    borderBottom: "2px solid #e1e5e9",
                    fontWeight: "600"
                  }}>
                    {new Date(stmt.date).getFullYear()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", fontWeight: "500" }}>Revenue</td>
                {statements.slice(0, 3).map(stmt => (
                  <td key={stmt.date} style={{ textAlign: "right", padding: "12px" }}>
                    {formatMoney(stmt.revenue)}
                  </td>
                ))}
              </tr>
              <tr style={{ background: "#fafbfc" }}>
                <td style={{ padding: "12px", fontWeight: "500" }}>Gross Profit</td>
                {statements.slice(0, 3).map(stmt => (
                  <td key={stmt.date} style={{ textAlign: "right", padding: "12px" }}>
                    {formatMoney(stmt.grossProfit)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: "12px", fontWeight: "500" }}>Operating Income</td>
                {statements.slice(0, 3).map(stmt => (
                  <td key={stmt.date} style={{ textAlign: "right", padding: "12px" }}>
                    {formatMoney(stmt.operatingIncome)}
                  </td>
                ))}
              </tr>
              <tr style={{ background: "#fafbfc" }}>
                <td style={{ padding: "12px", fontWeight: "500" }}>Net Income</td>
                {statements.slice(0, 3).map(stmt => (
                  <td key={stmt.date} style={{ textAlign: "right", padding: "12px" }}>
                    {formatMoney(stmt.netIncome)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: "12px", fontWeight: "500" }}>EPS</td>
                {statements.slice(0, 3).map(stmt => (
                  <td key={stmt.date} style={{ textAlign: "right", padding: "12px" }}>
                    {stmt.eps ? `$${stmt.eps.toFixed(2)}` : "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NewsTab({ company }) {
  const news = company.news || [];
  
  return (
    <div>
      <h3 style={{ margin: "0 0 20px", color: "#333" }}>Latest News & Updates</h3>
      
      {news.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          No recent news available
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {news.slice(0, 10).map((article, index) => (
            <div key={index} style={{
              background: "#f8f9fa",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e1e5e9"
            }}>
              <h4 style={{ 
                margin: "0 0 8px", 
                fontSize: "16px", 
                lineHeight: "1.3",
                color: "#333"
              }}>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#333", textDecoration: "none" }}
                  onMouseOver={(e) => e.target.style.color = "#667eea"}
                  onMouseLeave={(e) => e.target.style.color = "#333"}
                >
                  {article.title}
                </a>
              </h4>
              <p style={{ 
                margin: "0 0 12px", 
                color: "#666", 
                fontSize: "14px",
                lineHeight: "1.4"
              }}>
                {article.text?.substring(0, 200)}...
              </p>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#999"
              }}>
                <span>{article.site}</span>
                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━ UTILITY COMPONENTS ━━━
function Stat({ label, value, color, sub }) {
  return (
    <div>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}>
        {label}
      </div>
      <div style={{ 
        fontSize: "14px", 
        fontWeight: "600", 
        color: color || "#333",
        lineHeight: "1.2"
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "11px", color: "#999", marginTop: "1px" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ━━━ UTILITY FUNCTIONS ━━━
function formatMarketCap(value) {
  if (!value) return "—";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatMoney(value) {
  if (!value) return "—";
  const absValue = Math.abs(value);
  if (absValue >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (absValue >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (absValue >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

export default App;
