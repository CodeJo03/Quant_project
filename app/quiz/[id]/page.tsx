"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight, RotateCcw, Trophy, Target, BookOpen } from "lucide-react"

/**
 * 퀴즈 실행 페이지 컴포넌트
 * 개별 퀴즈를 진행하고 결과를 표시
 */

// 퀴즈 데이터 (실제로는 API에서 가져올 데이터)
const quizData: any = {
  "basic-economics": {
    id: "basic-economics",
    title: "기초 경제학",
    description: "GDP, 인플레이션 등 기본 경제 개념을 다루는 퀴즈",
    difficulty: 1,
    category: "거시경제",
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
      },
      {
        id: "q3",
        question: "중앙은행의 주요 역할은 무엇인가요?",
        options: ["세금 징수", "통화정책 수행", "예산 편성", "무역 관리"],
        correctAnswer: 1,
        explanation: "중앙은행의 주요 역할은 통화정책을 수행하여 물가 안정과 경제 성장을 도모하는 것입니다.",
      },
      {
        id: "q4",
        question: "경제성장률이 마이너스라는 것은 무엇을 의미하나요?",
        options: ["경제가 성장하고 있다", "경제가 침체되고 있다", "물가가 상승하고 있다", "실업률이 감소하고 있다"],
        correctAnswer: 1,
        explanation: "경제성장률이 마이너스라는 것은 전년 대비 경제 규모가 축소되어 경제가 침체되고 있음을 의미합니다.",
      },
      {
        id: "q5",
        question: "실업률이 높아지면 일반적으로 어떤 현상이 나타나나요?",
        options: ["소비 증가", "소비 감소", "물가 상승", "수출 증가"],
        correctAnswer: 1,
        explanation: "실업률이 높아지면 소득이 감소하여 일반적으로 소비가 감소하는 현상이 나타납니다.",
      },
    ],
  },
  "investment-analysis": {
    id: "investment-analysis",
    title: "투자 분석 기초",
    description: "PER, ROE 등 기본적인 투자 지표를 다루는 퀴즈",
    difficulty: 2,
    category: "투자분석",
    questions: [
      {
        id: "q1",
        question: "PER이 15배라는 것은 무엇을 의미하나요?",
        options: ["주가가 순자산의 15배", "주가가 연간 순이익의 15배", "배당수익률이 15%", "부채비율이 15%"],
        correctAnswer: 1,
        explanation: "PER(주가수익비율)이 15배라는 것은 현재 주가가 연간 주당순이익의 15배라는 의미입니다.",
      },
      {
        id: "q2",
        question: "ROE가 높다는 것은 무엇을 의미하나요?",
        options: ["부채가 많다", "자기자본 대비 수익성이 높다", "주가가 높다", "배당을 많이 준다"],
        correctAnswer: 1,
        explanation: "ROE(자기자본이익률)가 높다는 것은 자기자본 대비 수익성이 높아 경영 효율성이 좋다는 의미입니다.",
      },
    ],
  },
}

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isQuizStarted, setIsQuizStarted] = useState(false)

  // 퀴즈 데이터 로드
  useEffect(() => {
    const quizInfo = quizData[quizId]
    if (quizInfo) {
      setQuiz(quizInfo)
      setSelectedAnswers(new Array(quizInfo.questions.length).fill(-1))
    } else {
      router.push("/quiz")
    }
  }, [quizId, router])

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isQuizStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isQuizStarted, showResults, startTime])

  // 퀴즈 시작
  const startQuiz = () => {
    setIsQuizStarted(true)
    setStartTime(Date.now())
  }

  // 답안 선택
  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  // 다음 문제로 이동
  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // 이전 문제로 이동
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // 퀴즈 완료
  const finishQuiz = () => {
    setShowResults(true)

    // 결과 계산
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer,
    ).length
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const wrongAnswers = quiz.questions.filter(
      (question: any, index: number) => selectedAnswers[index] !== question.correctAnswer,
    )

    // 결과 저장
    const result = {
      quizId: quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      wrongAnswers,
      completedAt: new Date().toISOString(),
      timeTaken: timeElapsed,
    }

    const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    existingResults.push(result)
    localStorage.setItem("quizResults", JSON.stringify(existingResults))
  }

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">퀴즈를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const difficultyInfo = getDifficultyInfo(quiz.difficulty)

  // 퀴즈 시작 전 화면
  if (!isQuizStarted) {
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
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
                  <Badge variant="outline">{quiz.category}</Badge>
                </div>
                <p className="text-muted-foreground">{quiz.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">{quiz.questions.length}</div>
                    <div className="text-sm text-muted-foreground">문제 수</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">5-10</div>
                    <div className="text-sm text-muted-foreground">예상 시간(분)</div>
                  </div>
                </div>

                <Alert>
                  <BookOpen className="h-4 w-4" />
                  <AlertDescription>
                    각 문제를 신중히 읽고 답을 선택하세요. 퀴즈 완료 후 틀린 문제에 대한 해설을 확인할 수 있습니다.
                  </AlertDescription>
                </Alert>

                <Button onClick={startQuiz} className="w-full" size="lg">
                  퀴즈 시작하기
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
      (answer, index) => answer === quiz.questions[index].correctAnswer,
    ).length
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const wrongAnswers = quiz.questions.filter(
      (question: any, index: number) => selectedAnswers[index] !== question.correctAnswer,
    )

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 결과 요약 */}
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">퀴즈 완료!</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">{score}점</div>
                <p className="text-muted-foreground">
                  {quiz.questions.length}문제 중 {correctAnswers}문제를 맞혔습니다
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-chart-1 mb-1">{correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">정답</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-destructive mb-1">{wrongAnswers.length}</div>
                    <div className="text-sm text-muted-foreground">오답</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">{formatTime(timeElapsed)}</div>
                    <div className="text-sm text-muted-foreground">소요 시간</div>
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
                      setSelectedAnswers(new Array(quiz.questions.length).fill(-1))
                      setShowResults(false)
                      setIsQuizStarted(false)
                      setTimeElapsed(0)
                    }}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    다시 풀기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 문제별 해설 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">문제별 해설</h2>
              {quiz.questions.map((question: any, index: number) => {
                const userAnswer = selectedAnswers[index]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex-1">
                          {index + 1}. {question.question}
                        </CardTitle>
                        {isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-chart-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => {
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

  // 퀴즈 진행 화면
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
                  {currentQuestionIndex + 1} / {quiz.questions.length}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 문제 카드 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => (
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

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={finishQuiz}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="bg-primary hover:bg-primary/90"
              >
                퀴즈 완료
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
                {quiz.questions.map((_: any, index: number) => (
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
