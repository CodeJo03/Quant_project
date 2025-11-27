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
  Trophy,
  BrainCircuit,
  Zap
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
        return { label: "Basic", color: "bg-chart-3/10 text-chart-3 border-chart-3/20", description: "기본 경제 개념" }
      case 2:
        return { label: "Intermediate", color: "bg-primary/10 text-primary border-primary/20", description: "투자 분석 기초" }
      case 3:
        return { label: "Advanced", color: "bg-chart-5/10 text-chart-5 border-chart-5/20", description: "고급 투자 이론" }
      default:
        return { label: "General", color: "bg-muted text-muted-foreground", description: "전체 레벨" }
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
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Skill Assessment</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              실전 퀴즈를 통해 금융 지식을 테스트하고 역량을 강화하세요.
              {user && <span className="text-primary block mt-1">{user.name}님의 현재 레벨은 {getDifficultyInfo(user.know_level).label}입니다.</span>}
            </p>
          </div>
        </div>

        {/* 통계 카드들 - 그리드 레이아웃 개선 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Available</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
                <p className="text-3xl font-bold text-foreground mt-1">{collections.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Trophy className="h-6 w-6 text-secondary" />
                </div>
                <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">Current Level</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Rank</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {user ? getDifficultyInfo(user.know_level).label : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-destructive/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <BrainCircuit className="h-6 w-6 text-destructive" />
                </div>
                <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">Review Needed</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incorrect Answers</p>
                <p className="text-3xl font-bold text-foreground mt-1">{wrongQuestionsCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 - 문제집 목록 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 난이도 필터 - 탭 스타일로 변경 */}
            <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg w-fit">
              <Button
                variant={selectedDifficulty === null ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedDifficulty(null)}
                className="rounded-md"
              >
                All Levels
              </Button>
              {[1, 2, 3, 0].map((level) => {
                const info = getDifficultyInfo(level)
                return (
                  <Button
                    key={level}
                    variant={selectedDifficulty === level ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(level)}
                    className="rounded-md"
                  >
                    {info.label}
                  </Button>
                )
              })}
            </div>

            {/* 문제집 목록 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {selectedDifficulty !== null
                    ? `${getDifficultyInfo(selectedDifficulty).label} Quizzes`
                    : "All Quizzes"}
                </h2>
                <span className="text-sm text-muted-foreground">{filteredCollections.length} quizzes available</span>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 border border-dashed border-border rounded-xl">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground animate-pulse">Loading quizzes...</p>
                </div>
              ) : filteredCollections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-border rounded-xl bg-muted/30">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No quizzes found</h3>
                  <p className="text-muted-foreground">Try selecting a different difficulty level.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredCollections.map((collection) => {
                    const difficultyInfo = getDifficultyInfo(collection.difficulty)
                    const isRecommended = recommendedCollections.some((rc) => rc.id === collection.id)

                    return (
                      <Card key={collection.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{collection.title}</h3>
                                {isRecommended && user && (
                                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 text-[10px] px-1.5 h-5">
                                    Recommended
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <Badge variant="outline" className={`${difficultyInfo.color} text-[10px] px-2 py-0 h-5`}>
                                  {difficultyInfo.label}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3.5 w-3.5" />
                                  <span>{collection.count} Qs</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>~{Math.ceil(collection.count * 0.5)} min</span>
                                </div>
                                {collection.category !== "all" && (
                                  <div className="flex items-center gap-1">
                                    {getCategoryIcon(collection.category)}
                                    <span>{collection.category}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button asChild className="shrink-0 w-full sm:w-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <Link href={`/quiz/${collection.id}`}>
                                <Play className="h-4 w-4 mr-2" />
                                Start Quiz
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 컬럼 - 추가 기능 */}
          <div className="space-y-6">
            {/* 추천 문제집 */}
            {user && recommendedCollections.length > 0 && (
              <Card className="border-secondary/20 bg-secondary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Star className="h-4 w-4 text-secondary" />
                    <span>Recommended for You</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendedCollections.slice(0, 3).map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/quiz/${collection.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background border border-transparent hover:border-secondary/20 transition-all group"
                      >
                        <span className="text-sm font-medium group-hover:text-secondary transition-colors truncate flex-1 mr-2">
                          {collection.title.replace(' 문제집', '')}
                        </span>
                        <Play className="h-3 w-3 text-muted-foreground group-hover:text-secondary" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 틀린 문제 복습 */}
            {user && wrongQuestionsCount > 0 && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <RotateCcw className="h-4 w-4 text-destructive" />
                    <span>Review Incorrect Answers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Questions to review</span>
                      <span className="text-xl font-bold text-destructive">{wrongQuestionsCount}</span>
                    </div>
                    <Button asChild className="w-full bg-background hover:bg-destructive/10 text-destructive border border-destructive/20" variant="outline">
                      <Link href="/quiz/review">
                        Start Review Session
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 퀴즈 팁 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Read each question carefully. Financial terms can be tricky.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Review explanations for incorrect answers to improve your score.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Regular practice is key to mastering quantitative analysis.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}