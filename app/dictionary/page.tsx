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
} from "lucide-react"

/*
 * 경제사전 페이지 컴포넌트
 * 난이도별 경제 용어 검색, 즐겨찾기, 카테고리 필터링 기능 제공
 */

// 경제 용어 데이터 타입 정의
interface EconomicTerm {
  id: string
  term: string
  definition: string
  example: string
  difficulty: 0 | 1 | 2 | 3 | 4 // 0: 가본,  1: 초급, 2: 중급, 3: 고급, 4: 초고급
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
        console.log("캐시된 데이터 사용")
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
        
        // 세션 스토리지에도 백업 (브라우저 새로고침 대비)
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
    const consonants = ['ㄱ', 'ㄲ','ㄴ', 'ㄷ', 'ㄸ','ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ','ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
    
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

  // 검색 영역으로 스크롤
  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // 난이도별 색상 및 라벨
  const getDifficultyInfo = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { label: "초급", color: "bg-green-100 text-green-800", icon: "🟢" }
      case 2:
        return { label: "중급", color: "bg-blue-100 text-blue-800", icon: "🔵" }
      case 3:
        return { label: "고급", color: "bg-purple-100 text-purple-800", icon: "🟣" }
      default:
        return { label: "중급", color: "bg-blue-100 text-blue-800", icon: "🔵" }
    }
  }

  // 카테고리별 아이콘
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "거시경제":
        return <TrendingUp className="h-4 w-4" />
      case "투자분석":
        return <PieChart className="h-4 w-4" />
      case "재무분석":
        return <Calculator className="h-4 w-4" />
      case "포트폴리오":
        return <Building2 className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 플로팅 사이드바 */}
      <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Card className="shadow-lg">
          <CardContent className="p-2">
            <div className="flex flex-col gap-1">
              {/* 검색으로 이동 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToSearch}
                className="w-10 h-10 p-0"
                title="검색"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <div className="w-full h-px bg-border my-1" />
              
              {/* 초성 네비게이션 */}
              {Object.keys(groupedTerms).sort().map(consonant => (
                <Button
                  key={consonant}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToGroup(consonant)}
                  className="w-10 h-10 p-0 text-xs font-bold"
                  title={`${consonant}로 이동`}
                >
                  {consonant}
                </Button>
              ))}
              
              <div className="w-full h-px bg-border my-1" />
              
              {/* 맨 위로 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 p-0"
                title="맨 위로"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">경제사전</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {user ? `${user.name}님의 레벨에 맞는 ` : ""}경제 용어를 학습하고 즐겨찾기로 관리하세요
            </p>
          </div>

          {/* 검색 및 필터 섹션 */}
          <div ref={searchRef}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* 검색바 */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="경제 용어를 검색하세요..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* 필터 옵션 */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger>
                          <SelectValue placeholder="난이도 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">모든 난이도</SelectItem>
                          <SelectItem value="1">초급</SelectItem>
                          <SelectItem value="2">중급</SelectItem>
                          <SelectItem value="3">고급</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
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

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedDifficulty("all")
                        setSelectedCategory("all")
                      }}
                      className="bg-transparent"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      초기화
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 탭 네비게이션 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>전체 용어</span>
              </TabsTrigger>
              <TabsTrigger value="recommended" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>추천 용어</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>즐겨찾기</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="mb-4 text-sm text-muted-foreground">
                {isLoading ? "데이터를 불러오는 중..." : `총 ${filteredTerms.length}개의 용어가 있습니다`}
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="mt-6">
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">
                  {user
                    ? `${user.name}님의 레벨(${getDifficultyInfo(user.know_level).label})에 맞는 추천 용어`
                    : "로그인 후 개인 맞춤 추천을 받아보세요"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isLoading ? "데이터를 불러오는 중..." : `총 ${filteredTerms.length}개의 추천 용어가 있습니다`}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <div className="mb-4 text-sm text-muted-foreground">
                {isLoading ? "데이터를 불러오는 중..." : `즐겨찾기한 ${filteredTerms.length}개의 용어입니다`}
              </div>
            </TabsContent>
          </Tabs>

          {/* 용어 목록 */}
          <div className="grid gap-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-foreground mb-2">현재 데이터를 받아오는 중입니다</h3>
                  <p className="text-muted-foreground">잠시만 기다려주세요...</p>
                </CardContent>
              </Card>
            ) : filteredTerms.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">검색 결과가 없습니다</h3>
                  <p className="text-muted-foreground">다른 검색어를 시도하거나 필터를 조정해보세요</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedTerms).sort().map(([consonant, groupTerms]) => (
                <div key={consonant} id={`group-${consonant}`} className="space-y-4">
                  {/* 초성 헤더 */}
                  <div className="sticky top-0 bg-background z-10 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{consonant}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{groupTerms.length}개 용어</span>
                    </div>
                  </div>
                  
                  {/* 그룹 내 용어들 */}
                  {groupTerms.map((term) => {
                    const difficultyInfo = getDifficultyInfo(term.difficulty)
                    const isFavorite = favorites.includes(term.id)

                    return (
                      <Card key={term.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <CardTitle className="text-xl">{term.term}</CardTitle>
                                <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
                                <div className="flex items-center space-x-1 text-muted-foreground">
                                  {getCategoryIcon(term.category)}
                                  <span className="text-sm">{term.category}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(term.id)}
                              className="text-muted-foreground hover:text-primary"
                            >
                              {isFavorite ? (
                                <BookmarkCheck className="h-5 w-5 text-primary" />
                              ) : (
                                <Bookmark className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-4">
                            {/* 정의 */}
                            <div>
                              <h4 className="font-medium text-foreground mb-2">정의</h4>
                              <p className="text-muted-foreground leading-relaxed">{term.definition}</p>
                            </div>

                            {/* 예시 */}
                            <div>
                              <h4 className="font-medium text-foreground mb-2">예시</h4>
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground italic">{term.example}</p>
                              </div>
                            </div>

                            {/* 관련 용어 */}
                            {term.relatedTerms.length > 0 && (
                              <div>
                                <h4 className="font-medium text-foreground mb-2">관련 용어</h4>
                                <div className="flex flex-wrap gap-2">
                                  {term.relatedTerms.map((relatedTerm, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSearchTerm(relatedTerm)}
                                      className="text-xs bg-transparent hover:bg-primary/5"
                                    >
                                      {relatedTerm}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* 하단 통계 */}
          {!isLoading && filteredTerms.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{terms.length}</div>
                  <div className="text-sm text-muted-foreground">전체 용어</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-secondary mb-2">{favorites.length}</div>
                  <div className="text-sm text-muted-foreground">즐겨찾기</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent mb-2">{categories.length}</div>
                  <div className="text-sm text-muted-foreground">카테고리</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}