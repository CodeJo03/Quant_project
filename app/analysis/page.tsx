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
    sector: "기술",
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
    sector: "기술",
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
    sector: "인터넷",
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
    name: "PER (주가수익비율)",
    category: "밸류에이션",
    description: "주가를 주당순이익으로 나눈 값",
    formula: "주가 ÷ 주당순이익",
  },
  {
    id: "pbr",
    name: "PBR (주가순자산비율)",
    category: "밸류에이션",
    description: "주가를 주당순자산으로 나눈 값",
    formula: "주가 ÷ 주당순자산",
  },
  {
    id: "roe",
    name: "ROE (자기자본이익률)",
    category: "수익성",
    description: "순이익을 자기자본으로 나눈 값",
    formula: "순이익 ÷ 자기자본 × 100",
  },
  {
    id: "roa",
    name: "ROA (총자산이익률)",
    category: "수익성",
    description: "순이익을 총자산으로 나눈 값",
    formula: "순이익 ÷ 총자산 × 100",
  },
  {
    id: "debt_ratio",
    name: "부채비율",
    category: "안정성",
    description: "총부채를 자기자본으로 나눈 값",
    formula: "총부채 ÷ 자기자본 × 100",
  },
  {
    id: "current_ratio",
    name: "유동비율",
    category: "안정성",
    description: "유동자산을 유동부채로 나눈 값",
    formula: "유동자산 ÷ 유동부채 × 100",
  },
  {
    id: "revenue_growth",
    name: "매출성장률",
    category: "성장성",
    description: "전년 대비 매출 증가율",
    formula: "(당기매출 - 전기매출) ÷ 전기매출 × 100",
  },
  {
    id: "operating_margin",
    name: "영업이익률",
    category: "수익성",
    description: "영업이익을 매출로 나눈 값",
    formula: "영업이익 ÷ 매출 × 100",
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
    }, 2000)
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
      overall: "보통",
    }

    metrics.forEach((metric) => {
      switch (metric.id) {
        case "per":
          if (metric.value < 15) summary.strengths.push("적정한 PER 수준")
          else if (metric.value > 25) summary.weaknesses.push("높은 PER로 고평가 우려")
          break
        case "roe":
          if (metric.value > 15) summary.strengths.push("우수한 자기자본 수익성")
          else if (metric.value < 8) summary.weaknesses.push("낮은 자기자본 수익성")
          break
        case "debt_ratio":
          if (metric.value < 100) summary.strengths.push("안정적인 부채 수준")
          else if (metric.value > 200) summary.weaknesses.push("높은 부채비율로 재무위험 존재")
          break
      }
    })

    if (summary.strengths.length > summary.weaknesses.length) {
      summary.overall = "양호"
    } else if (summary.weaknesses.length > summary.strengths.length) {
      summary.overall = "주의"
    }

    return summary
  }

  // 차트 데이터 생성
  const generateChartData = (metrics: any[]) => {
    return {
      barChart: metrics.map((metric) => ({
        name: metric.name.split(" ")[0], // 짧은 이름
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
  const COLORS = ["#164e63", "#84cc16", "#dc2626", "#f59e0b", "#8b5cf6"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">퀀트 분석</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {user ? `${user.name}님, ` : ""}기업의 재무제표를 분석하여 투자 인사이트를 얻어보세요
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 왼쪽 컬럼 - 분석 설정 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 기업 선택 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>기업 선택</span>
                  </CardTitle>
                  <CardDescription>분석할 기업을 선택하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="기업을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center space-x-2">
                            <span>{company.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {company.symbol}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedCompany && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      {(() => {
                        const company = sampleCompanies.find((c) => c.id === selectedCompany)
                        return (
                          company && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">섹터:</span>
                                <span>{company.sector}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">현재가:</span>
                                <span className="font-medium">{company.stockPrice.toLocaleString()}원</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">시가총액:</span>
                                <span>{(company.marketCap / 1000000).toFixed(1)}조원</span>
                              </div>
                            </div>
                          )
                        )
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 분석 지표 선택 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>분석 지표</span>
                  </CardTitle>
                  <CardDescription>분석에 사용할 지표를 선택하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 검색 및 필터 */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="지표 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 카테고리</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 지표 목록 */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredMetrics.map((metric) => (
                      <div key={metric.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={metric.id}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={() => toggleMetric(metric.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={metric.id} className="text-sm font-medium cursor-pointer">
                            {metric.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {metric.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-muted-foreground">선택된 지표: {selectedMetrics.length}개</div>
                </CardContent>
              </Card>

              {/* 분석 실행 */}
              <Card>
                <CardContent className="p-6">
                  <Button
                    onClick={runAnalysis}
                    disabled={!selectedCompany || selectedMetrics.length === 0 || isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        분석 시작
                      </>
                    )}
                  </Button>

                  {(!selectedCompany || selectedMetrics.length === 0) && (
                    <Alert className="mt-4">
                      <Target className="h-4 w-4" />
                      <AlertDescription>기업과 분석 지표를 선택한 후 분석을 시작할 수 있습니다.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 컬럼 - 분석 결과 */}
            <div className="lg:col-span-2">
              {!analysisResults ? (
                <Card className="h-96">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">분석 결과가 여기에 표시됩니다</h3>
                      <p className="text-muted-foreground">기업과 지표를 선택한 후 분석을 시작하세요</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* 분석 요약 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{analysisResults.company.name} 분석 결과</span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              analysisResults.summary.overall === "양호"
                                ? "default"
                                : analysisResults.summary.overall === "주의"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {analysisResults.summary.overall}
                          </Badge>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Download className="h-4 w-4 mr-2" />
                            리포트 다운로드
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-chart-1 mb-3 flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            강점
                          </h4>
                          <ul className="space-y-2">
                            {analysisResults.summary.strengths.map((strength: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <div className="w-1.5 h-1.5 bg-chart-1 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                {strength}
                              </li>
                            ))}
                            {analysisResults.summary.strengths.length === 0 && (
                              <li className="text-sm text-muted-foreground">특별한 강점이 발견되지 않았습니다.</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-destructive mb-3 flex items-center">
                            <Activity className="h-4 w-4 mr-2" />
                            주의사항
                          </h4>
                          <ul className="space-y-2">
                            {analysisResults.summary.weaknesses.map((weakness: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                {weakness}
                              </li>
                            ))}
                            {analysisResults.summary.weaknesses.length === 0 && (
                              <li className="text-sm text-muted-foreground">특별한 주의사항이 발견되지 않았습니다.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 지표 상세 결과 */}
                  <Tabs defaultValue="metrics" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="metrics">지표 상세</TabsTrigger>
                      <TabsTrigger value="charts">차트 분석</TabsTrigger>
                      <TabsTrigger value="comparison">업계 비교</TabsTrigger>
                    </TabsList>

                    <TabsContent value="metrics" className="space-y-4">
                      <div className="grid gap-4">
                        {analysisResults.metrics.map((metric: any) => (
                          <Card key={metric.id}>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h3 className="font-medium text-foreground">{metric.name}</h3>
                                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">
                                    {metric.value.toFixed(2)}
                                    {metric.id.includes("ratio") ||
                                    metric.id.includes("roe") ||
                                    metric.id.includes("roa") ||
                                    metric.id.includes("margin") ||
                                    metric.id.includes("growth")
                                      ? "%"
                                      : "배"}
                                  </div>
                                  <Badge variant="outline">{metric.category}</Badge>
                                </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min((metric.value / (metric.id === "per" ? 30 : metric.id === "pbr" ? 5 : 100)) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="charts" className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* 막대 차트 */}
                        <Card>
                          <CardHeader>
                            <CardTitle>지표별 수치</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={analysisResults.chartData.barChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#164e63" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* 파이 차트 */}
                        <Card>
                          <CardHeader>
                            <CardTitle>카테고리별 분포</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <RechartsPieChart>
                                <Pie
                                  data={analysisResults.chartData.pieChart}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, value }) => `${name}: ${value}`}
                                >
                                  {analysisResults.chartData.pieChart.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 주가 추이 */}
                      <Card>
                        <CardHeader>
                          <CardTitle>주가 추이</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analysisResults.company.historicalData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="price" stroke="#164e63" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="comparison">
                      <Card>
                        <CardHeader>
                          <CardTitle>업계 평균 비교</CardTitle>
                          <CardDescription>선택한 기업과 동일 업계 평균값 비교</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {analysisResults.metrics.slice(0, 4).map((metric: any, index: number) => {
                              // 업계 평균 샘플 데이터
                              const industryAverage = metric.value * (0.8 + Math.random() * 0.4)
                              const isAboveAverage = metric.value > industryAverage

                              return (
                                <div key={metric.id} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">{metric.name}</span>
                                    <div className="flex items-center space-x-4">
                                      <div className="text-sm">
                                        <span className="text-muted-foreground">업계평균: </span>
                                        <span>{industryAverage.toFixed(2)}</span>
                                      </div>
                                      <div className="text-sm font-medium">
                                        <span className="text-muted-foreground">현재: </span>
                                        <span className={isAboveAverage ? "text-chart-1" : "text-destructive"}>
                                          {metric.value.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <div className="w-full bg-muted rounded-full h-4">
                                      <div
                                        className="bg-muted-foreground h-4 rounded-full absolute"
                                        style={{
                                          width: `${(industryAverage / Math.max(metric.value, industryAverage)) * 100}%`,
                                        }}
                                      ></div>
                                      <div
                                        className={`h-4 rounded-full ${isAboveAverage ? "bg-chart-1" : "bg-destructive"}`}
                                        style={{
                                          width: `${(metric.value / Math.max(metric.value, industryAverage)) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
