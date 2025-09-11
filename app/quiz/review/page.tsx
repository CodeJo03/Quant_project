"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, Trophy } from "lucide-react"

/**
 * 틀린 문제 복습 페이지 컴포넌트
 * 이전에 틀린 문제들을 다시 풀어볼 수 있는 기능 제공
 */

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 1 | 2 | 3
  category: string
}

export default function QuizReviewPage() {
  const router = useRouter()
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isReviewStarted, setIsReviewStarted] = useState(false)

  // 틀린 문제들 로드
  useEffect(() => {
    const quizResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    const allWrongQuestions: Question[] = []

    quizResults.forEach((result: any) => {
      allWrongQuestions.push(...result.wrongAnswers)
    })

    // 중복 제거 (같은 문제 ID 기준)
    const uniqueWrongQuestions = allWrongQuestions.filter(
      (question, index, self) => index === self.findIndex((q) => q.id === question.id),
    )

    setWrongQuestions(uniqueWrongQuestions)
    setSelectedAnswers(new Array(uniqueWrongQuestions.length).fill(-1))

    if (uniqueWrongQuestions.length === 0) {
      router.push("/quiz")
    }
  }, [router])

  // 복습 시작
  const startReview = () => {
    setIsReviewStarted(true)
  }

  // 답안 선택
  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  // 다음 문제로 이동
  const nextQuestion = () => {
    if (currentQuestionIndex < wrongQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // 이전 문제로 이동
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // 복습 완료
  const finishReview = () => {
    setShowResults(true)
  }

  // 난이도 정보
  const getDifficultyInfo = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { label: "초급", color: "bg-green-100 text-green-800" }
      case 2:
        return { label: "중급", color: "bg-blue-100 text-blue-800" }
      case 3:
        return { label: "고급", color: "bg-purple-100 text-purple-800" }
      default:
        return { label: "중급", color: "bg-blue-100 text-blue-800" }
    }
  }

  if (wrongQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">복습 문제를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = wrongQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / wrongQuestions.length) * 100

  // 복습 시작 전 화면
  if (!isReviewStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/quiz")}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              퀴즈 목록으로 돌아가기
            </Button>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl mb-2">틀린 문제 복습</CardTitle>
                <p className="text-muted-foreground">이전에 틀린 문제들을 다시 풀어보세요</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-destructive mb-2">{wrongQuestions.length}</div>
                  <div className="text-muted-foreground">복습할 문제 수</div>
                </div>

                {/* 카테고리별 분포 */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">카테고리별 분포</h3>
                  <div className="space-y-2">
                    {Object.entries(
                      wrongQuestions.reduce(
                        (acc, question) => {
                          acc[question.category] = (acc[question.category] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{category}</span>
                        <Badge variant="outline">{count}문제</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={startReview} className="w-full" size="lg">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  복습 시작하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // 결과 화면
  if (showResults) {
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === wrongQuestions[index].correctAnswer,
    ).length
    const score = Math.round((correctAnswers / wrongQuestions.length) * 100)
    const improvedQuestions = wrongQuestions.filter(
      (question, index) => selectedAnswers[index] === question.correctAnswer,
    )

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 복습 결과 */}
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">복습 완료!</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">{score}점</div>
                <p className="text-muted-foreground">
                  {wrongQuestions.length}문제 중 {correctAnswers}문제를 개선했습니다
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-chart-1 mb-1">{improvedQuestions.length}</div>
                    <div className="text-sm text-muted-foreground">개선된 문제</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-destructive mb-1">
                      {wrongQuestions.length - correctAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground">여전히 틀린 문제</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => router.push("/quiz")} variant="outline" className="flex-1 bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    퀴즈 목록으로
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentQuestionIndex(0)
                      setSelectedAnswers(new Array(wrongQuestions.length).fill(-1))
                      setShowResults(false)
                      setIsReviewStarted(false)
                    }}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    다시 복습하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 문제별 해설 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">문제별 해설</h2>
              {wrongQuestions.map((question, index) => {
                const userAnswer = selectedAnswers[index]
                const isCorrect = userAnswer === question.correctAnswer
                const difficultyInfo = getDifficultyInfo(question.difficulty)

                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {index + 1}. {question.question}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
                            <Badge variant="outline">{question.category}</Badge>
                          </div>
                        </div>
                        {isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-chart-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          let className = "p-3 rounded-lg border "
                          if (optionIndex === question.correctAnswer) {
                            className += "bg-chart-1/10 border-chart-1 text-chart-1"
                          } else if (optionIndex === userAnswer && !isCorrect) {
                            className += "bg-destructive/10 border-destructive text-destructive"
                          } else {
                            className += "bg-muted border-border"
                          }

                          return (
                            <div key={optionIndex} className={className}>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                <span>{option}</span>
                                {optionIndex === question.correctAnswer && (
                                  <Badge variant="secondary" className="ml-auto bg-chart-1/20 text-chart-1">
                                    정답
                                  </Badge>
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <Badge variant="secondary" className="ml-auto bg-destructive/20 text-destructive">
                                    선택
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">해설</h4>
                        <p className="text-muted-foreground text-sm">{question.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 복습 진행 화면
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 상단 정보 바 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/quiz")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  나가기
                </Button>
                <div className="text-sm text-muted-foreground">
                  {currentQuestionIndex + 1} / {wrongQuestions.length}
                </div>
              </div>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
                <RotateCcw className="h-3 w-3 mr-1" />
                복습 모드
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 문제 카드 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl flex-1">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </CardTitle>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getDifficultyInfo(currentQuestion.difficulty).color}>
                    {getDifficultyInfo(currentQuestion.difficulty).label}
                  </Badge>
                  <Badge variant="outline">{currentQuestion.category}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto p-4 ${
                      selectedAnswers[currentQuestionIndex] === index ? "" : "bg-transparent"
                    }`}
                    onClick={() => selectAnswer(index)}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전 문제
            </Button>

            {currentQuestionIndex === wrongQuestions.length - 1 ? (
              <Button
                onClick={finishReview}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="bg-primary hover:bg-primary/90"
              >
                복습 완료
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="bg-primary hover:bg-primary/90"
              >
                다음 문제
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* 문제 네비게이션 */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {wrongQuestions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestionIndex === index ? "default" : "outline"}
                    size="sm"
                    className={`w-10 h-10 ${
                      currentQuestionIndex === index
                        ? ""
                        : selectedAnswers[index] !== -1
                          ? "bg-secondary/20 border-secondary text-secondary"
                          : "bg-transparent"
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
