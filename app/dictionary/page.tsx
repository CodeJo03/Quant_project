"use client"

import { useState, useEffect, useMemo } from "react"
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

// 데이터베이스에서 가져온 경제용어 저장공간
const sampleTerms: EconomicTerm[] = []

export default function DictionaryPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [terms, setTerms] = useState<EconomicTerm[]>([])

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

  // 용어 데이터 로드
  useEffect(() => {
    fetch("http://localhost:8000/api/dictionary/terms")
      .then((res) => res.json())
      .then((data) => setTerms(data))
      .catch(() => setTerms([]))
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

    return filtered
  }, [searchTerm, selectedDifficulty, selectedCategory, activeTab, favorites, user, terms])

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
              <div className="mb-4 text-sm text-muted-foreground">총 {filteredTerms.length}개의 용어가 있습니다</div>
            </TabsContent>

            <TabsContent value="recommended" className="mt-6">
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">
                  {user
                    ? `${user.name}님의 레벨(${getDifficultyInfo(user.know_level).label})에 맞는 추천 용어`
                    : "로그인 후 개인 맞춤 추천을 받아보세요"}
                </div>
                <div className="text-sm text-muted-foreground">총 {filteredTerms.length}개의 추천 용어가 있습니다</div>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <div className="mb-4 text-sm text-muted-foreground">즐겨찾기한 {filteredTerms.length}개의 용어입니다</div>
            </TabsContent>
          </Tabs>

          {/* 용어 목록 */}
          <div className="grid gap-6">
            {filteredTerms.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">검색 결과가 없습니다</h3>
                  <p className="text-muted-foreground">다른 검색어를 시도하거나 필터를 조정해보세요</p>
                </CardContent>
              </Card>
            ) : (
              filteredTerms.map((term) => {
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
              })
            )}
          </div>

          {/* 하단 통계 */}
          {filteredTerms.length > 0 && (
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
