"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  GraduationCap,
  Play,
  RotateCcw,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  BookOpen,
  TrendingUp,
  Loader2,
} from "lucide-react"
import Link from "next/link"

interface QuizCollection {
  id: string
  title: string
  description?: string
  difficulty: number
  category: string
  count: number
}

export default function QuizPage() {
  const [user, setUser] = useState<any>(null)
  const [collections, setCollections] = useState<QuizCollection[]>([])
  const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0)
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 사용자 정보 로드
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setSelectedDifficulty(parsedUser.know_level)
      
      // 틀린 문제 수 가져오기
      fetchWrongQuestionsCount(parsedUser.user_id)
    }
  }, [])

  // 문제집 목록 로드
  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:8000/api/quiz/collections")
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error("문제집 목록 로드 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWrongQuestionsCount = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/quiz/stats/${userId}`)
      const data = await response.json()
      setWrongQuestionsCount(data.wrong_questions_count)
    } catch (error) {
      console.error("틀린 문제 수 로드 실패:", error)
    }
  }

  // 난이도별 정보
  const getDifficultyInfo = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { label: "초급", color: "bg-green-100 text-green-800", description: "기본 경제 개념" }
      case 2:
        return { label: "중급", color: "bg-blue-100 text-blue-800", description: "투자 분석 기초" }
      case 3:
        return { label: "고급", color: "bg-purple-100 text-purple-800", description: "고급 투자 이론" }
      default:
        return { label: "종합", color: "bg-orange-100 text-orange-800", description: "전체 레벨" }
    }
  }

  // 카테고리별 아이콘
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "경제":
        return <TrendingUp className="h-4 w-4" />
      case "금융":
        return <Target className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  // 사용자 레벨에 맞는 문제집 필터링
  const getRecommendedCollections = () => {
    if (!user) return []
    const userLevel = user.know_level
    return collections.filter((col) => 
      col.difficulty === userLevel || 
      col.difficulty === userLevel - 1 || 
      col.difficulty === userLevel + 1 ||
      col.difficulty === 0
    )
  }

  // 선택된 난이도에 따른 문제집 필터링
  const getFilteredCollections = () => {
    if (selectedDifficulty === null) return collections
    if (selectedDifficulty === 0) return collections.filter(col => col.difficulty === 0)
    return collections.filter((col) => col.difficulty === selectedDifficulty)
  }

  const recommendedCollections = getRecommendedCollections()
  const filteredCollections = getFilteredCollections()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">퀴즈</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {user ? `${user.name}님, ` : ""}경제 지식을 테스트하고 실력을 향상시켜보세요
            </p>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">사용 가능한 문제집</p>
                    <p className="text-2xl font-bold text-foreground">{collections.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">내 레벨</p>
                    <p className="text-2xl font-bold text-foreground">
                      {user ? getDifficultyInfo(user.know_level).label : "-"}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">복습할 문제</p>
                    <p className="text-2xl font-bold text-foreground">{wrongQuestionsCount}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 왼쪽 컬럼 - 문제집 목록 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 난이도 필터 */}
              <Card>
                <CardHeader>
                  <CardTitle>난이도별 문제집</CardTitle>
                  <CardDescription>원하는 난이도를 선택하여 문제집을 풀어보세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={selectedDifficulty === null ? "default" : "outline"}
                      onClick={() => setSelectedDifficulty(null)}
                      className={selectedDifficulty === null ? "" : "bg-transparent"}
                    >
                      전체
                    </Button>
                    {[1, 2, 3, 0].map((level) => {
                      const info = getDifficultyInfo(level)
                      return (
                        <Button
                          key={level}
                          variant={selectedDifficulty === level ? "default" : "outline"}
                          onClick={() => setSelectedDifficulty(level)}
                          className={selectedDifficulty === level ? "" : "bg-transparent"}
                        >
                          {info.label}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 문제집 목록 */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedDifficulty !== null 
                    ? `${getDifficultyInfo(selectedDifficulty).label} 문제집` 
                    : "전체 문제집"}
                </h2>

                {isLoading ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-foreground mb-2">문제집을 불러오는 중입니다</h3>
                      <p className="text-muted-foreground">잠시만 기다려주세요...</p>
                    </CardContent>
                  </Card>
                ) : filteredCollections.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">해당 난이도의 문제집이 없습니다</h3>
                      <p className="text-muted-foreground">다른 난이도를 선택해보세요</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredCollections.map((collection) => {
                    const difficultyInfo = getDifficultyInfo(collection.difficulty)
                    const isRecommended = recommendedCollections.some((rc) => rc.id === collection.id)

                    return (
                      <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <CardTitle className="text-lg">{collection.title}</CardTitle>
                                <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
                                {isRecommended && user && (
                                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                    <Star className="h-3 w-3 mr-1" />
                                    추천
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{collection.count}문제</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>약 {Math.ceil(collection.count * 0.5)}분</span>
                                </div>
                                {collection.category !== "all" && (
                                  <div className="flex items-center space-x-1">
                                    {getCategoryIcon(collection.category)}
                                    <span>{collection.category}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <Button asChild className="w-full">
                            <Link href={`/quiz/${collection.id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              퀴즈 시작하기
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>

            {/* 오른쪽 컬럼 - 추가 기능 */}
            <div className="space-y-6">
              {/* 추천 문제집 */}
              {user && recommendedCollections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-secondary" />
                      <span>맞춤 추천</span>
                    </CardTitle>
                    <CardDescription>
                      {user.name}님의 레벨({getDifficultyInfo(user.know_level).label})에 맞는 문제집
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendedCollections.slice(0, 3).map((collection) => (
                        <Button
                          key={collection.id}
                          asChild
                          variant="outline"
                          className="w-full justify-start bg-transparent hover:bg-primary/5"
                        >
                          <Link href={`/quiz/${collection.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            {collection.title.replace(' 문제집', '')}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 틀린 문제 복습 */}
              {user && wrongQuestionsCount > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <RotateCcw className="h-5 w-5 text-destructive" />
                      <span>틀린 문제 복습</span>
                    </CardTitle>
                    <CardDescription>틀린 문제들을 다시 풀어보세요</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive mb-1">{wrongQuestionsCount}</div>
                        <div className="text-sm text-muted-foreground">복습할 문제</div>
                      </div>
                      <Button asChild className="w-full bg-transparent" variant="outline">
                        <Link href="/quiz/review">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          복습 시작하기
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 퀴즈 팁 */}
              <Card>
                <CardHeader>
                  <CardTitle>퀴즈 팁</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>차근차근 문제를 읽고 답을 선택하세요</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>틀린 문제는 해설을 꼭 확인하세요</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span>정기적으로 복습하여 실력을 향상시키세요</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-chart-1 rounded-full mt-2 flex-shrink-0"></div>
                      <span>퀴즈를 끝까지 완료해야 결과가 저장됩니다</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}