"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Search,
  Heart,
  Filter,
  Star,
  TrendingUp,
  Building2,
  Calculator,
  PieChart,
  Bookmark,
  BookmarkCheck,
  ChevronUp,
  Loader2,
  Hash,
  Globe,
  Coins,
  Landmark
} from "lucide-react"

// 경제 용어 데이터 타입 정의
interface EconomicTerm {
  id: string
  term: string
  definition: string
  example: string
  difficulty: 1 | 2 | 3 // 1: 초급, 2: 중급, 3: 고급
  category: string
  relatedTerms: string[]
}

// 전역 데이터 캐시
let cachedTerms: EconomicTerm[] | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 30 * 60 * 1000 // 30분 캐시 유지

export default function DictionaryPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [terms, setTerms] = useState<EconomicTerm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 사용자 정보 로드
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // 즐겨찾기 목록 로드
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // URL 파라미터에서 검색어 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const search = urlParams.get("search")
    if (search) {
      setSearchTerm(search)
    }
  }, [])

  // 용어 데이터 로드 (캐싱 적용)
  useEffect(() => {
    const loadTerms = async () => {
      setIsLoading(true)

      // 캐시 확인
      if (cachedTerms && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setTerms(cachedTerms)
        setIsLoading(false)
        return
      }

      // 새로 데이터 로드
      try {
        const response = await fetch("http://localhost:8000/api/dictionary/terms")
        const data = await response.json()

        // 캐시 저장
        cachedTerms = data
        cacheTimestamp = Date.now()

        // 세션 스토리지에도 백업
        sessionStorage.setItem("termsCache", JSON.stringify({
          data: data,
          timestamp: Date.now()
        }))

        setTerms(data)
      } catch (error) {
        console.error("데이터 로드 실패:", error)

        // 세션 스토리지에서 백업 데이터 확인
        const backup = sessionStorage.getItem("termsCache")
        if (backup) {
          const { data, timestamp } = JSON.parse(backup)
          if (Date.now() - timestamp < CACHE_DURATION) {
            cachedTerms = data
            cacheTimestamp = timestamp
            setTerms(data)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTerms()
  }, [])

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 즐겨찾기 토글 함수
  const toggleFavorite = (termId: string) => {
    const newFavorites = favorites.includes(termId) ? favorites.filter((id) => id !== termId) : [...favorites, termId]

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(terms.map((term) => term.category))]
    return uniqueCategories
  }, [terms])

  // 필터링된 용어 목록
  const filteredTerms = useMemo(() => {
    let filtered = terms

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 난이도 필터링
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((term) => term.difficulty === Number.parseInt(selectedDifficulty))
    }

    // 카테고리 필터링
    if (selectedCategory !== "all") {
      filtered = filtered.filter((term) => term.category === selectedCategory)
    }

    // 탭별 필터링
    if (activeTab === "favorites") {
      filtered = filtered.filter((term) => favorites.includes(term.id))
    } else if (activeTab === "recommended" && user) {
      // 사용자 레벨에 맞는 추천 용어
      const userLevel = user.know_level
      filtered = filtered.filter((term) => term.difficulty <= userLevel + 1 && term.difficulty >= userLevel)
    }

    // 가나다순 정렬
    return filtered.sort((a, b) => a.term.localeCompare(b.term, 'ko'))
  }, [searchTerm, selectedDifficulty, selectedCategory, activeTab, favorites, user, terms])

  // 초성별 그룹화
  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: EconomicTerm[] } = {}
    const consonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

    filteredTerms.forEach(term => {
      const firstChar = term.term.charAt(0)
      const code = firstChar.charCodeAt(0) - 44032

      if (code >= 0 && code <= 11171) {
        const consonantIndex = Math.floor(code / 588)
        const consonant = consonants[consonantIndex]

        if (!groups[consonant]) {
          groups[consonant] = []
        }
        groups[consonant].push(term)
      } else {
        // 한글이 아닌 경우 (영어, 숫자 등)
        const key = /[A-Za-z]/.test(firstChar) ? 'ABC' : '#'
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(term)
      }
    })

    return groups
  }, [filteredTerms])

  // 특정 초성 그룹으로 스크롤
  const scrollToGroup = (consonant: string) => {
    const element = document.getElementById(`group-${consonant}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 난이도별 색상 및 라벨
  const getDifficultyInfo = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { label: "Basic", color: "bg-chart-3/10 text-chart-3 border-chart-3/20", icon: "🟢" }
      case 2:
        return { label: "Intermediate", color: "bg-primary/10 text-primary border-primary/20", icon: "🔵" }
      case 3:
        return { label: "Advanced", color: "bg-chart-5/10 text-chart-5 border-chart-5/20", icon: "🟣" }
      default:
        return { label: "General", color: "bg-muted text-muted-foreground", icon: "⚪" }
    }
  }

  // 카테고리별 아이콘
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "거시경제":
        return <Globe className="h-4 w-4" />
      case "투자분석":
        return <TrendingUp className="h-4 w-4" />
      case "재무분석":
        return <PieChart className="h-4 w-4" />
      case "금융시장":
        return <Landmark className="h-4 w-4" />
      case "화폐금융":
        return <Coins className="h-4 w-4" />
      default:
        return <Hash className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* 플로팅 사이드바 (초성 네비게이션) */}
      <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
        <div className="bg-card/80 backdrop-blur-md border border-border rounded-full py-4 px-2 shadow-xl flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-8 h-8 rounded-full p-0 hover:bg-primary/20 hover:text-primary"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div className="w-4 h-px bg-border my-1" />
          {Object.keys(groupedTerms).sort().map(consonant => (
            <button
              key={consonant}
              onClick={() => scrollToGroup(consonant)}
              className="w-6 h-6 text-[10px] font-bold text-muted-foreground hover:text-primary hover:scale-125 transition-all"
            >
              {consonant}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Financial Wiki</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              금융 전문가를 위한 포괄적인 경제 용어 데이터베이스입니다.
              {user && <span className="text-primary block mt-1">{user.name}님의 학습 레벨에 최적화된 용어를 추천해드립니다.</span>}
            </p>
          </div>

          {/* 통계 요약 */}
          {!isLoading && (
            <div className="flex gap-4">
              <div className="bg-card border border-border px-4 py-2 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">{terms.length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Terms</div>
              </div>
              <div className="bg-card border border-border px-4 py-2 rounded-lg text-center">
                <div className="text-2xl font-bold text-secondary">{favorites.length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Saved</div>
              </div>
            </div>
          )}
        </div>

        {/* 검색 및 컨트롤 바 */}
        <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-xl sm:border sm:p-4 transition-all">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for terms, definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:bg-background transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[140px] bg-muted/50">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Basic</SelectItem>
                  <SelectItem value="2">Intermediate</SelectItem>
                  <SelectItem value="3">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px] bg-muted/50">
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

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  <TabsTrigger value="favorites">Saved</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Loading financial data...</p>
            </div>
          ) : filteredTerms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-border rounded-xl bg-muted/30">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No terms found</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedDifficulty("all")
                  setSelectedCategory("all")
                }}
                className="mt-4 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedTerms).sort().map(([consonant, groupTerms]) => (
                <div key={consonant} id={`group-${consonant}`} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                      <span className="text-lg font-bold text-primary">{consonant}</span>
                    </div>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupTerms.map((term) => {
                      const difficultyInfo = getDifficultyInfo(term.difficulty)
                      const isFavorite = favorites.includes(term.id)

                      return (
                        <Card key={term.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                                  {term.term}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className={`${difficultyInfo.color} text-[10px] px-2 py-0 h-5`}>
                                    {difficultyInfo.label}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    {getCategoryIcon(term.category)}
                                    {term.category}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(term.id)}
                                className={`h-8 w-8 -mr-2 ${isFavorite ? 'text-primary' : 'text-muted-foreground/50 hover:text-primary'}`}
                              >
                                {isFavorite ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                              {term.definition}
                            </p>

                            {term.relatedTerms.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/50">
                                {term.relatedTerms.slice(0, 3).map((related, i) => (
                                  <span
                                    key={i}
                                    onClick={() => setSearchTerm(related)}
                                    className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                                  >
                                    #{related}
                                  </span>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}