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
} from "lucide-react"
import Link from "next/link"

/**
 * 퀴즈 메인 페이지 컴포넌트
 * 퀴즈 선택, 통계 확인, 틀린 문제 복습 기능 제공
 */

// 퀴즈 데이터 타입 정의
interface Quiz {
  id: string
  title: string
  description: string
  difficulty: 1 | 2 | 3
  category: string
  questionCount: number
  estimatedTime: number
  questions: Question[]
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 1 | 2 | 3
  category: string
}

// 퀴즈 결과 타입
interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: Question[]
  completedAt: string
  timeTaken: number
}

// 샘플 퀴즈 데이터
const sampleQuizzes: Quiz[] = [
  {
    id: "basic-economics",
    title: "기초 경제학",
    description: "GDP, 인플레이션 등 기본 경제 개념을 다루는 퀴즈",
    difficulty: 1,
    category: "거시경제",
    questionCount: 10,
    estimatedTime: 5,
    questions: [
      {
        id: "q1",
        question: "GDP는 무엇의 줄임말인가요?",
        options: [
          "Gross Domestic Product",
          "General Development Program",
          "Global Distribution Policy",
          "Government Debt Program",
        ],
        correctAnswer: 0,
        explanation: "GDP는 Gross Domestic Product(국내총생산)의 줄임말로, 한 나라의 경제 규모를 나타내는 지표입니다.",
        difficulty: 1,
        category: "거시경제",
      },
      {
        id: "q2",
        question: "인플레이션이란 무엇인가요?",
        options: [
          "물가가 지속적으로 하락하는 현상",
          "물가가 지속적으로 상승하는 현상",
          "환율이 상승하는 현상",
          "금리가 하락하는 현상",
        ],
        correctAnswer: 1,
        explanation: "인플레이션은 물가가 지속적으로 상승하여 화폐의 구매력이 감소하는 현상입니다.",
        difficulty: 1,
        category: "거시경제",
      },
    ],
  },
  {
    id: "investment-analysis",
    title: "투자 분석 기초",
    description: "PER, ROE 등 기본적인 투자 지표를 다루는 퀴즈",
    difficulty: 2,
    category: "투자분석",
    questionCount: 8,
    estimatedTime: 6,
    questions: [
      {
        id: "q3",
        question: "PER이 15배라는 것은 무엇을 의미하나요?",
        options: ["주가가 순자산의 15배", "주가가 연간 순이익의 15배", "배당수익률이 15%", "부채비율이 15%"],
        correctAnswer: 1,
        explanation: "PER(주가수익비율)이 15배라는 것은 현재 주가가 연간 주당순이익의 15배라는 의미입니다.",
        difficulty: 2,
        category: "투자분석",
      },
    ],
  },
  {
    id: "advanced-portfolio",
    title: "고급 포트폴리오 이론",
    description: "샤프비율, 베타 등 고급 투자 이론을 다루는 퀴즈",
    difficulty: 3,
    category: "포트폴리오",
    questionCount: 12,
    estimatedTime: 10,
    questions: [
      {
        id: "q4",
        question: "샤프비율이 높다는 것은 무엇을 의미하나요?",
        options: ["위험 대비 수익률이 높다", "변동성이 높다", "베타값이 높다", "상관관계가 높다"],
        correctAnswer: 0,
        explanation: "샤프비율이 높다는 것은 동일한 위험 수준에서 더 높은 수익률을 제공한다는 의미입니다.",
        difficulty: 3,
        category: "포트폴리오",
      },
    ],
  },
]

export default function QuizPage() {
  const [user, setUser] = useState<any>(null)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)

  // 사용자 정보 및 퀴즈 결과 로드
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      const parsedUser = JSON.parse(userData)
      setSelectedDifficulty(parsedUser.know_level)
    }

    const savedResults = localStorage.getItem("quizResults")
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults))
    }
  }, [])

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
        return { label: "중급", color: "bg-blue-100 text-blue-800", description: "투자 분석 기초" }
    }
  }

  // 사용자 레벨에 맞는 퀴즈 필터링
  const getRecommendedQuizzes = () => {
    if (!user) return sampleQuizzes

    const userLevel = user.know_level
    return sampleQuizzes.filter((quiz) => quiz.difficulty <= userLevel + 1 && quiz.difficulty >= userLevel - 1)
  }

  // 선택된 난이도에 따른 퀴즈 필터링
  const getFilteredQuizzes = () => {
    if (selectedDifficulty === null) return sampleQuizzes
    return sampleQuizzes.filter((quiz) => quiz.difficulty === selectedDifficulty)
  }

  // 퀴즈 통계 계산
  const getQuizStats = () => {
    if (quizResults.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongQuestions: 0,
      }
    }

    const totalQuizzes = quizResults.length
    const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0)
    const averageScore = Math.round(totalScore / totalQuizzes)
    const totalQuestions = quizResults.reduce((sum, result) => sum + result.totalQuestions, 0)
    const correctAnswers = quizResults.reduce((sum, result) => sum + result.correctAnswers, 0)
    const wrongQuestions = quizResults.reduce((sum, result) => sum + result.wrongAnswers.length, 0)

    return {
      totalQuizzes,
      averageScore,
      totalQuestions,
      correctAnswers,
      wrongQuestions,
    }
  }

  // 틀린 문제들 수집
  const getWrongQuestions = (): Question[] => {
    const wrongQuestions: Question[] = []
    quizResults.forEach((result) => {
      wrongQuestions.push(...result.wrongAnswers)
    })
    return wrongQuestions
  }

  const stats = getQuizStats()
  const wrongQuestions = getWrongQuestions()
  const recommendedQuizzes = getRecommendedQuizzes()
  const filteredQuizzes = getFilteredQuizzes()

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">응시한 퀴즈</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-primary" />
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
                  <Target className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">총 문제 수</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalQuestions}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">정답 수</p>
                    <p className="text-2xl font-bold text-foreground">{stats.correctAnswers}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">틀린 문제</p>
                    <p className="text-2xl font-bold text-foreground">{stats.wrongQuestions}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 왼쪽 컬럼 - 퀴즈 목록 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 난이도 필터 */}
              <Card>
                <CardHeader>
                  <CardTitle>난이도별 퀴즈</CardTitle>
                  <CardDescription>원하는 난이도를 선택하여 퀴즈를 풀어보세요</CardDescription>
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
                    {[1, 2, 3].map((level) => {
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

              {/* 퀴즈 목록 */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedDifficulty ? `${getDifficultyInfo(selectedDifficulty).label} 퀴즈` : "전체 퀴즈"}
                </h2>

                {filteredQuizzes.map((quiz) => {
                  const difficultyInfo = getDifficultyInfo(quiz.difficulty)
                  const isRecommended = recommendedQuizzes.some((rq) => rq.id === quiz.id)

                  return (
                    <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-lg">{quiz.title}</CardTitle>
                              <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
                              {isRecommended && user && (
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                  <Star className="h-3 w-3 mr-1" />
                                  추천
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="mb-3">{quiz.description}</CardDescription>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{quiz.questionCount}문제</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>약 {quiz.estimatedTime}분</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{quiz.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <Button asChild className="w-full">
                          <Link href={`/quiz/${quiz.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            퀴즈 시작하기
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}

                {filteredQuizzes.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">해당 난이도의 퀴즈가 없습니다</h3>
                      <p className="text-muted-foreground">다른 난이도를 선택해보세요</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* 오른쪽 컬럼 - 추가 기능 */}
            <div className="space-y-6">
              {/* 추천 퀴즈 */}
              {user && recommendedQuizzes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-secondary" />
                      <span>맞춤 추천</span>
                    </CardTitle>
                    <CardDescription>
                      {user.name}님의 레벨({getDifficultyInfo(user.know_level).label})에 맞는 퀴즈
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendedQuizzes.slice(0, 3).map((quiz) => (
                        <Button
                          key={quiz.id}
                          asChild
                          variant="outline"
                          className="w-full justify-start bg-transparent hover:bg-primary/5"
                        >
                          <Link href={`/quiz/${quiz.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            {quiz.title}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 틀린 문제 복습 */}
              {wrongQuestions.length > 0 && (
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
                        <div className="text-2xl font-bold text-destructive mb-1">{wrongQuestions.length}</div>
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

              {/* 학습 진도 */}
              <Card>
                <CardHeader>
                  <CardTitle>학습 진도</CardTitle>
                  <CardDescription>이번 주 퀴즈 목표</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>퀴즈 응시</span>
                        <span>{Math.min(stats.totalQuizzes, 5)}/5</span>
                      </div>
                      <Progress value={(Math.min(stats.totalQuizzes, 5) / 5) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>평균 점수</span>
                        <span>{stats.averageScore}/80%</span>
                      </div>
                      <Progress value={(stats.averageScore / 80) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

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
