"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight, RotateCcw, Trophy, Target, BookOpen, Loader2 } from "lucide-react"

interface Question {
  _id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  difficulty: 1 | 2 | 3
  category: string
}

interface Quiz {
  collection_id: string
  title: string
  questions: Question[]
  total: number
}

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params?.id as string

  const [user, setUser] = useState<any>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 사용자 정보 로드
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error)
    }
  }, [])

  // 퀴즈 데이터 로드
  useEffect(() => {
    if (collectionId) {
      fetchQuiz()
    }
  }, [collectionId])

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isQuizStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isQuizStarted, showResults, startTime])

  const fetchQuiz = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`http://localhost:8000/api/quiz/generate/${collectionId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error("문제를 불러올 수 없습니다")
      }
      
      // 문제집 제목 생성
      const titles: { [key: string]: string } = {
        "level1-economy": "1단계 경제 용어 문제집",
        "level1-finance": "1단계 금융 경제용어 문제집",
        "level1-all": "1단계 모든 경제 용어 문제집",
        "level2-economy": "2단계 경제 용어 문제집",
        "level2-finance": "2단계 금융 경제용어 문제집",
        "level2-all": "2단계 모든 경제 용어 문제집",
        "level3-economy": "3단계 경제 용어 문제집",
        "level3-finance": "3단계 금융 경제용어 문제집",
        "level3-all": "3단계 모든 경제 용어 문제집",
        "all-comprehensive": "모든 경제용어 종합 문제집",
      }
      
      setQuiz({
        ...data,
        title: titles[collectionId] || "경제 용어 문제집"
      })
      setSelectedAnswers(new Array(data.questions.length).fill(-1))
    } catch (error) {
      console.error("퀴즈 로드 실패:", error)
      setError(error instanceof Error ? error.message : "퀴즈를 불러오는데 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

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
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
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
  const finishQuiz = async () => {
    if (!quiz) return
    
    setShowResults(true)

    // 로그인한 사용자만 결과 저장
    if (!user) return

    // 틀린 문제들 찾기
    const wrongQuestionIds = quiz.questions
      .filter((question, index) => selectedAnswers[index] !== question.correct_answer)
      .map(q => q._id)

    // 서버에 결과 전송
    try {
      const response = await fetch("http://localhost:8000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          wrong_question_ids: wrongQuestionIds
        })
      })
      
      if (!response.ok) {
        console.error("결과 저장 실패")
      }
    } catch (error) {
      console.error("결과 저장 중 오류:", error)
    }
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

  // 에러 화면
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md">
            <CardContent className="p-12 text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">오류가 발생했습니다</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => router.push("/quiz")}>
                퀴즈 목록으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 로딩 화면
  if (isLoading || !quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">퀴즈를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

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
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">{quiz.total}</div>
                    <div className="text-sm text-muted-foreground">문제 수</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">{Math.ceil(quiz.total * 0.5)}</div>
                    <div className="text-sm text-muted-foreground">예상 시간(분)</div>
                  </div>
                </div>

                <Alert>
                  <BookOpen className="h-4 w-4" />
                  <AlertDescription>
                    각 문제를 신중히 읽고 답을 선택하세요. 퀴즈를 끝까지 완료해야 틀린 문제가 저장되어 복습할 수 있습니다.
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
      (answer, index) => answer === quiz.questions[index].correct_answer,
    ).length
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)

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
                    <div className="text-2xl font-bold text-destructive mb-1">
                      {quiz.questions.length - correctAnswers}
                    </div>
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
                      fetchQuiz()
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
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index]
                const isCorrect = userAnswer === question.correct_answer
                const difficultyInfo = getDifficultyInfo(question.difficulty)

                return (
                  <Card key={question._id}>
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
                          if (optionIndex === question.correct_answer) {
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
                                {optionIndex === question.correct_answer && (
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
                {quiz.questions.map((_, index) => (
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