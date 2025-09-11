"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Target,
  Clock,
  Award,
  ArrowRight,
  BarChart3,
  BookMarked,
  Brain,
} from "lucide-react"
import Link from "next/link"

/**
 * 개인화된 대시보드 컴포넌트
 * 사용자의 학습 진도, 추천 콘텐츠, 최근 활동을 표시
 */
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 사용자 정보 로드
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      window.location.href = "/auth/login"
    }
    setIsLoading(false)
  }, [])

  // 로딩 중이거나 사용자 정보가 없는 경우
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  // 사용자 레벨에 따른 추천 콘텐츠
  const getRecommendedContent = (knowLevel: number) => {
    switch (knowLevel) {
      case 1:
        return {
          level: "초급",
          color: "bg-green-100 text-green-800",
          terms: ["GDP", "인플레이션", "금리", "주식", "채권"],
          description: "기본 경제 용어부터 차근차근 학습해보세요",
        }
      case 2:
        return {
          level: "중급",
          color: "bg-blue-100 text-blue-800",
          terms: ["PER", "ROE", "부채비율", "유동비율", "매출총이익률"],
          description: "재무 분석의 기초를 익혀보세요",
        }
      case 3:
        return {
          level: "고급",
          color: "bg-purple-100 text-purple-800",
          terms: ["샤프비율", "베타", "알파", "VaR", "포트폴리오 이론"],
          description: "고급 투자 이론과 리스크 관리를 학습하세요",
        }
      default:
        return {
          level: "중급",
          color: "bg-blue-100 text-blue-800",
          terms: ["PER", "ROE", "부채비율", "유동비율", "매출총이익률"],
          description: "재무 분석의 기초를 익혀보세요",
        }
    }
  }

  const recommendedContent = getRecommendedContent(user.know_level)

  // 임시 학습 통계 데이터 (실제로는 API에서 가져올 데이터)
  const stats = {
    totalTermsLearned: 45,
    totalQuizzesTaken: 12,
    averageScore: 78,
    studyStreak: 5,
    weeklyProgress: 65,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 환영 메시지 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">안녕하세요, {user.name}님!</h1>
            <p className="text-lg text-muted-foreground">
              오늘도 경제 학습을 계속해보세요. 꾸준한 학습이 전문가로 가는 길입니다.
            </p>
          </div>

          {/* 학습 통계 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">학습한 용어</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalTermsLearned}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">퀴즈 응시</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalQuizzesTaken}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">평균 점수</p>
                    <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
                  </div>
                  <Target className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">연속 학습</p>
                    <p className="text-2xl font-bold text-foreground">{stats.studyStreak}일</p>
                  </div>
                  <Award className="h-8 w-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 왼쪽 컬럼 - 추천 학습 콘텐츠 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 이번 주 학습 진도 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>이번 주 학습 진도</span>
                  </CardTitle>
                  <CardDescription>목표 대비 {stats.weeklyProgress}% 달성했습니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={stats.weeklyProgress} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>이번 주 목표: 10개 용어 학습</span>
                      <span>{Math.round((stats.weeklyProgress / 100) * 10)}/10 완료</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 맞춤 추천 학습 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-secondary" />
                    <span>맞춤 추천 학습</span>
                    <Badge className={recommendedContent.color}>{recommendedContent.level}</Badge>
                  </CardTitle>
                  <CardDescription>{recommendedContent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {recommendedContent.terms.map((term, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start bg-transparent hover:bg-primary/5"
                          asChild
                        >
                          <Link href={`/dictionary?search=${term}`}>
                            <BookMarked className="h-4 w-4 mr-2" />
                            {term}
                          </Link>
                        </Button>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/dictionary">
                        경제사전에서 더 보기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 퀴즈 추천 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    <span>오늘의 퀴즈</span>
                  </CardTitle>
                  <CardDescription>학습한 내용을 테스트해보세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{recommendedContent.level} 레벨 퀴즈</h4>
                        <p className="text-sm text-muted-foreground">10문제 • 예상 소요시간 5분</p>
                      </div>
                      <Button asChild>
                        <Link href="/quiz">시작하기</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 컬럼 - 빠른 액세스 */}
            <div className="space-y-6">
              {/* 빠른 액세스 */}
              <Card>
                <CardHeader>
                  <CardTitle>빠른 액세스</CardTitle>
                  <CardDescription>자주 사용하는 기능들</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/dictionary">
                      <BookOpen className="h-4 w-4 mr-2" />
                      경제사전
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/quiz">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      퀴즈 풀기
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/analysis">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      퀀트 분석
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* 최근 활동 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>최근 활동</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">GDP 용어 학습 완료</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-muted-foreground">중급 퀴즈 85점 달성</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-muted-foreground">삼성전자 재무분석 완료</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 학습 목표 */}
              <Card>
                <CardHeader>
                  <CardTitle>이번 달 목표</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>용어 학습</span>
                        <span>23/50</span>
                      </div>
                      <Progress value={46} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>퀴즈 응시</span>
                        <span>12/20</span>
                      </div>
                      <Progress value={60} className="h-2" />
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
