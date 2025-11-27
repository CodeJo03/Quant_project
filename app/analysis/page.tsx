"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  Building2,
  Calculator,
  BarChart3,
  Search,
  Download,
  RefreshCw,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Briefcase,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Maximize2
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"

/**
 * 퀀트 분석 메인 페이지 컴포넌트
 * 기업 선택, 분석 지표 선택, 결과 시각화 기능 제공
 */

// 분석 지표 타입 정의
interface AnalysisMetric {
  id: string
  name: string
  category: string
  description: string
  formula?: string
}

// 기업 데이터 타입 정의
interface CompanyData {
  id: string
  name: string
  symbol: string
  sector: string
  marketCap: number
  financialData: {
    revenue: number
    netIncome: number
    totalAssets: number
    totalEquity: number
    totalDebt: number
    currentAssets: number
    currentLiabilities: number
    operatingCashFlow: number
    shares: number
    bookValue: number
  }
  stockPrice: number
  change: number
  changePercent: number
  historicalData: Array<{
    date: string
    price: number
    volume: number
  }>
}

// 샘플 기업 데이터
const sampleCompanies: CompanyData[] = [
  {
    id: "samsung",
    name: "삼성전자",
    symbol: "005930",
    sector: "Technology",
    marketCap: 400000000,
    financialData: {
      revenue: 279000000,
      netIncome: 26400000,
      totalAssets: 426000000,
      totalEquity: 286000000,
      totalDebt: 140000000,
      currentAssets: 174000000,
      currentLiabilities: 87000000,
      operatingCashFlow: 45000000,
      shares: 5969782550,
      bookValue: 47900,
    },
    stockPrice: 67000,
    change: 1200,
    changePercent: 1.82,
    historicalData: [
      { date: "2024-01", price: 65000, volume: 15000000 },
      { date: "2024-02", price: 66500, volume: 18000000 },
      { date: "2024-03", price: 67000, volume: 16000000 },
      { date: "2024-04", price: 68500, volume: 20000000 },
      { date: "2024-05", price: 67000, volume: 17000000 },
    ],
  },
  {
    id: "sk-hynix",
    name: "SK하이닉스",
    symbol: "000660",
    sector: "Technology",
    marketCap: 95000000,
    financialData: {
      revenue: 36700000,
      netIncome: 1800000,
      totalAssets: 74000000,
      totalEquity: 45000000,
      totalDebt: 29000000,
      currentAssets: 28000000,
      currentLiabilities: 14000000,
      operatingCashFlow: 8500000,
      shares: 728002365,
      bookValue: 61800,
    },
    stockPrice: 130500,
    change: -2500,
    changePercent: -1.88,
    historicalData: [
      { date: "2024-01", price: 125000, volume: 8000000 },
      { date: "2024-02", price: 128000, volume: 9500000 },
      { date: "2024-03", price: 130500, volume: 7800000 },
      { date: "2024-04", price: 135000, volume: 12000000 },
      { date: "2024-05", price: 130500, volume: 8900000 },
    ],
  },
  {
    id: "naver",
    name: "NAVER",
    symbol: "035420",
    sector: "Communication",
    marketCap: 32000000,
    financialData: {
      revenue: 8800000,
      netIncome: 1200000,
      totalAssets: 25000000,
      totalEquity: 18000000,
      totalDebt: 7000000,
      currentAssets: 12000000,
      currentLiabilities: 6000000,
      operatingCashFlow: 2800000,
      shares: 164000000,
      bookValue: 109756,
    },
    stockPrice: 195000,
    change: 500,
    changePercent: 0.26,
    historicalData: [
      { date: "2024-01", price: 185000, volume: 2500000 },
      { date: "2024-02", price: 190000, volume: 3200000 },
      { date: "2024-03", price: 195000, volume: 2800000 },
      { date: "2024-04", price: 200000, volume: 4100000 },
      { date: "2024-05", price: 195000, volume: 3000000 },
    ],
  },
]

// 분석 지표 정의
const analysisMetrics: AnalysisMetric[] = [
  {
    id: "per",
    name: "PER",
    category: "Valuation",
    description: "Price-to-Earnings Ratio",
    formula: "Price / EPS",
  },
  {
    id: "pbr",
    name: "PBR",
    category: "Valuation",
    description: "Price-to-Book Ratio",
    formula: "Price / BPS",
  },
  {
    id: "roe",
    name: "ROE",
    category: "Profitability",
    description: "Return on Equity",
    formula: "Net Income / Equity",
  },
  {
    id: "roa",
    name: "ROA",
    category: "Profitability",
    description: "Return on Assets",
    formula: "Net Income / Assets",
  },
  {
    id: "debt_ratio",
    name: "Debt Ratio",
    category: "Stability",
    description: "Debt to Equity Ratio",
    formula: "Total Debt / Equity",
  },
  {
    id: "current_ratio",
    name: "Current Ratio",
    category: "Stability",
    description: "Current Assets / Current Liabilities",
    formula: "Current Assets / Current Liabilities",
  },
  {
    id: "revenue_growth",
    name: "Rev Growth",
    category: "Growth",
    description: "Revenue Growth Rate",
    formula: "(Current Rev - Prev Rev) / Prev Rev",
  },
  {
    id: "operating_margin",
    name: "Op Margin",
    category: "Profitability",
    description: "Operating Margin",
    formula: "Operating Income / Revenue",
  },
]

export default function AnalysisPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // 사용자 정보 로드
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // 사용자 관심 회사가 있다면 기본 선택
      if (parsedUser.like_company && parsedUser.like_company.length > 0) {
        const firstCompanyId = parsedUser.like_company[0]
        const companyMap: Record<string, string> = {
          "1": "samsung",
          "2": "sk-hynix",
          "3": "naver",
        }
        if (companyMap[firstCompanyId]) {
          setSelectedCompany(companyMap[firstCompanyId])
        }
      }

      // 사용자 관심 카테고리에 따른 기본 지표 선택
      if (parsedUser.like_category && parsedUser.like_category.length > 0) {
        const categoryMap: Record<string, string[]> = {
          "1": ["per", "pbr", "roe"], // 재무비율 분석
          "2": ["revenue_growth"], // 성장성 지표
          "3": ["roe", "roa", "operating_margin"], // 수익성 지표
          "4": ["debt_ratio", "current_ratio"], // 안정성 지표
          "6": ["per", "pbr"], // 밸류에이션
        }
        const defaultMetrics: string[] = []
        parsedUser.like_category.forEach((categoryId: string) => {
          if (categoryMap[categoryId]) {
            defaultMetrics.push(...categoryMap[categoryId])
          }
        })
        setSelectedMetrics([...new Set(defaultMetrics)]) // 중복 제거
      }
    }
  }, [])

  // 지표 선택/해제
  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) => (prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]))
  }

  // 카테고리별 지표 필터링
  const getFilteredMetrics = () => {
    let filtered = analysisMetrics

    if (searchTerm) {
      filtered = filtered.filter(
        (metric) =>
          metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          metric.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((metric) => metric.category === selectedCategory)
    }

    return filtered
  }

  // 분석 실행
  const runAnalysis = () => {
    if (!selectedCompany || selectedMetrics.length === 0) return

    setIsAnalyzing(true)

    // 실제로는 백엔드 API 호출
    setTimeout(() => {
      const company = sampleCompanies.find((c) => c.id === selectedCompany)
      if (!company) return

      const results = calculateMetrics(company, selectedMetrics)
      setAnalysisResults(results)
      setIsAnalyzing(false)
    }, 1500)
  }

  // 지표 계산 함수
  const calculateMetrics = (company: CompanyData, metrics: string[]) => {
    const { financialData, stockPrice } = company
    const eps = financialData.netIncome / financialData.shares // 주당순이익
    const bps = financialData.bookValue // 주당순자산

    const calculations: Record<string, number> = {
      per: stockPrice / eps,
      pbr: stockPrice / bps,
      roe: (financialData.netIncome / financialData.totalEquity) * 100,
      roa: (financialData.netIncome / financialData.totalAssets) * 100,
      debt_ratio: (financialData.totalDebt / financialData.totalEquity) * 100,
      current_ratio: (financialData.currentAssets / financialData.currentLiabilities) * 100,
      revenue_growth: 8.5, // 샘플 데이터
      operating_margin: ((financialData.netIncome * 1.2) / financialData.revenue) * 100, // 추정값
    }

    const selectedResults = metrics.map((metricId) => {
      const metric = analysisMetrics.find((m) => m.id === metricId)
      return {
        id: metricId,
        name: metric?.name || "",
        category: metric?.category || "",
        value: calculations[metricId] || 0,
        description: metric?.description || "",
      }
    })

    return {
      company,
      metrics: selectedResults,
      summary: generateSummary(selectedResults),
      chartData: generateChartData(selectedResults),
    }
  }

  // 분석 요약 생성
  const generateSummary = (metrics: any[]) => {
    const summary = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      overall: "Neutral",
    }

    metrics.forEach((metric) => {
      switch (metric.id) {
        case "per":
          if (metric.value < 15) summary.strengths.push("Undervalued (Low PER)")
          else if (metric.value > 25) summary.weaknesses.push("Overvalued (High PER)")
          break
        case "roe":
          if (metric.value > 15) summary.strengths.push("High Profitability (High ROE)")
          else if (metric.value < 8) summary.weaknesses.push("Low Profitability (Low ROE)")
          break
        case "debt_ratio":
          if (metric.value < 100) summary.strengths.push("Stable Financial Structure")
          else if (metric.value > 200) summary.weaknesses.push("High Debt Risk")
          break
      }
    })

    if (summary.strengths.length > summary.weaknesses.length) {
      summary.overall = "Positive"
    } else if (summary.weaknesses.length > summary.strengths.length) {
      summary.overall = "Caution"
    }

    return summary
  }

  // 차트 데이터 생성
  const generateChartData = (metrics: any[]) => {
    return {
      barChart: metrics.map((metric) => ({
        name: metric.name,
        value: Number(metric.value.toFixed(2)),
        category: metric.category,
      })),
      pieChart: metrics.reduce((acc: any[], metric) => {
        const existing = acc.find((item) => item.name === metric.category)
        if (existing) {
          existing.value += 1
        } else {
          acc.push({ name: metric.category, value: 1 })
        }
        return acc
      }, []),
    }
  }

  const categories = [...new Set(analysisMetrics.map((metric) => metric.category))]
  const filteredMetrics = getFilteredMetrics()

  // 차트 색상
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Quant Analysis Terminal</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced financial analysis and visualization dashboard
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Briefcase className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[800px]">
          {/* 왼쪽 사이드바 - 컨트롤 패널 */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
            {/* 기업 선택 */}
            <Card className="shrink-0 bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader className="py-4 px-4 border-b border-border/50">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-primary" />
                  Select Asset
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Choose Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex items-center justify-between w-full gap-2">
                          <span>{company.name}</span>
                          <Badge variant="outline" className="text-[10px] h-5">{company.symbol}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCompany && (
                  <div className="mt-4 space-y-3">
                    {(() => {
                      const company = sampleCompanies.find((c) => c.id === selectedCompany)
                      return (
                        company && (
                          <>
                            <div className="flex justify-between items-end">
                              <span className="text-2xl font-bold">{company.stockPrice.toLocaleString()}</span>
                              <div className={`flex items-center text-sm font-medium ${company.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {company.change >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                                {company.changePercent}%
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div className="bg-muted/30 p-2 rounded">
                                <span className="block opacity-70">Market Cap</span>
                                <span className="font-medium text-foreground">{(company.marketCap / 100000000).toFixed(1)}B</span>
                              </div>
                              <div className="bg-muted/30 p-2 rounded">
                                <span className="block opacity-70">Sector</span>
                                <span className="font-medium text-foreground">{company.sector}</span>
                              </div>
                            </div>
                          </>
                        )
                      )
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 분석 지표 선택 */}
            <Card className="flex-1 flex flex-col min-h-0 bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader className="py-4 px-4 border-b border-border/50 shrink-0">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-primary" />
                    Metrics
                  </div>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                    {selectedMetrics.length} Selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <div className="p-4 space-y-3 shrink-0 bg-background/30">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search metrics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 text-xs bg-background/50"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-8 text-xs bg-background/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {filteredMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className={`flex items-start space-x-3 p-2 rounded-md transition-colors cursor-pointer hover:bg-primary/5 ${selectedMetrics.includes(metric.id) ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'}`}
                      onClick={() => toggleMetric(metric.id)}
                    >
                      <Checkbox
                        id={metric.id}
                        checked={selectedMetrics.includes(metric.id)}
                        onCheckedChange={() => toggleMetric(metric.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={metric.id} className="text-xs font-medium cursor-pointer block">
                          {metric.name}
                        </Label>
                        <p className="text-[10px] text-muted-foreground truncate">{metric.description}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] h-4 px-1 text-muted-foreground border-border/50">
                        {metric.category.substring(0, 3)}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border/50 shrink-0">
                  <Button
                    onClick={runAnalysis}
                    disabled={!selectedCompany || selectedMetrics.length === 0 || isAnalyzing}
                    className="w-full"
                    size="sm"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Activity className="h-3.5 w-3.5 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 컨텐츠 영역 */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 h-full min-h-0 overflow-y-auto lg:overflow-hidden">
            {!analysisResults ? (
              <Card className="h-full flex items-center justify-center border-dashed border-2 bg-muted/10">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-10 w-10 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Select a company from the list and choose metrics to generate a comprehensive quantitative analysis report.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="flex flex-col h-full gap-4">
                {/* 상단 요약 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="py-3 px-4 pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overall Rating</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${analysisResults.summary.overall === "Positive" ? "text-green-500" :
                            analysisResults.summary.overall === "Caution" ? "text-red-500" : "text-yellow-500"
                          }`}>
                          {analysisResults.summary.overall}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border-primary/10 md:col-span-3">
                    <CardHeader className="py-3 px-4 pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <div className="flex gap-4 text-sm">
                        {analysisResults.summary.strengths.length > 0 && (
                          <div className="flex items-center text-green-500">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span className="truncate">{analysisResults.summary.strengths[0]}</span>
                          </div>
                        )}
                        {analysisResults.summary.weaknesses.length > 0 && (
                          <div className="flex items-center text-red-500">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            <span className="truncate">{analysisResults.summary.weaknesses[0]}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 메인 차트 및 데이터 영역 */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* 차트 영역 */}
                  <Card className="lg:col-span-2 flex flex-col min-h-[400px] bg-card/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LineChartIcon className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-medium">Performance Analysis</CardTitle>
                      </div>
                      <Tabs defaultValue="price" className="w-auto">
                        <TabsList className="h-7 bg-muted/50">
                          <TabsTrigger value="price" className="text-[10px] h-5 px-2">Price</TabsTrigger>
                          <TabsTrigger value="metrics" className="text-[10px] h-5 px-2">Metrics</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analysisResults.company.historicalData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }}
                            itemStyle={{ color: '#f8fafc' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* 지표 상세 리스트 */}
                  <Card className="flex flex-col min-h-[400px] bg-card/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="py-3 px-4 border-b border-border/50">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Target className="h-4 w-4 mr-2 text-primary" />
                        Metric Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-y-auto">
                      <div className="divide-y divide-border/50">
                        {analysisResults.metrics.map((metric: any) => (
                          <div key={metric.id} className="p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <h4 className="text-sm font-medium text-foreground">{metric.name}</h4>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{metric.category}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-primary block leading-none">
                                  {metric.value.toFixed(2)}
                                  <span className="text-xs font-normal text-muted-foreground ml-0.5">
                                    {metric.id.includes("ratio") || metric.id.includes("roe") || metric.id.includes("margin") ? "%" : "x"}
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* 미니 바 차트 */}
                            <div className="mt-2 w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{
                                  width: `${Math.min((metric.value / (metric.id === "per" ? 30 : metric.id === "pbr" ? 5 : 100)) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
