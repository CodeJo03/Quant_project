"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, BookOpen, Trophy, TrendingUp, Settings, Star } from "lucide-react"

/**
 * 사용자 프로필 페이지
 * 개인 정보, 학습 진도, 즐겨찾기, 설정을 관리하는 페이지
 */
export default function ProfilePage() {
  // 로그인 상태 및 사용자 정보
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (user) {
        setUserInfo(JSON.parse(user))
      } else {
        setUserInfo(null)
      }
    }
  }, [])

  // 학습 통계 데이터 (더미)
  const learningStats = {
    totalQuizzes: 45,
    correctAnswers: 38,
    accuracy: 84,
    studiedTerms: 127,
    favoriteTerms: 23,
    currentStreak: 7,
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardHeader>
            <CardTitle>로그인이 필요합니다</CardTitle>
            <CardDescription>프로필 정보를 보려면 로그인을 해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth/login">로그인 하러 가기</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* 페이지 헤더 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">프로필</h1>
          <p className="text-xl text-muted-foreground">학습 진도와 개인 설정을 관리하세요</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              개인정보
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              학습진도
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              즐겨찾기
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              설정
            </TabsTrigger>
          </TabsList>

          {/* 개인정보 탭 */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  개인정보
                </CardTitle>
                <CardDescription>회원가입 시 입력한 정보를 확인하고 수정할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" value={userInfo.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">나이</Label>
                    <Input id="age" value={userInfo.age} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" value={userInfo.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">경제 지식 수준</Label>
                    <Select value={userInfo.know_level.toString()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">초급 (1단계)</SelectItem>
                        <SelectItem value="2">중급 (2단계)</SelectItem>
                        <SelectItem value="3">고급 (3단계)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>관심 회사</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(userInfo.like_company) && userInfo.like_company.length > 0 ? (
                        userInfo.like_company.map((company: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {company}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">아직 설정하지 않았습니다.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>관심 분석 카테고리</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(userInfo.like_category) && userInfo.like_category.length > 0 ? (
                        userInfo.like_category.map((category: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">아직 설정하지 않았습니다.</span>
                      )}
                    </div>
                  </div>
                </div>

                <Button className="w-full">정보 수정</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 학습진도 탭 */}
          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    퀴즈 성과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">총 퀴즈 수</span>
                      <span className="font-semibold">{learningStats.totalQuizzes}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">정답 수</span>
                      <span className="font-semibold text-primary">{learningStats.correctAnswers}개</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">정답률</span>
                        <span className="font-semibold">{learningStats.accuracy}%</span>
                      </div>
                      <Progress value={learningStats.accuracy} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-secondary" />
                    학습 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">학습한 용어</span>
                      <span className="font-semibold">{learningStats.studiedTerms}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">즐겨찾기</span>
                      <span className="font-semibold text-secondary">{learningStats.favoriteTerms}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">연속 학습일</span>
                      <span className="font-semibold">{learningStats.currentStreak}일</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    레벨 진행도
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">중급</div>
                      <div className="text-sm text-muted-foreground">Level {userInfo.know_level}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>다음 레벨까지</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      고급 레벨까지 25개 용어 더 학습하세요!
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 즐겨찾기 탭 */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  즐겨찾기 목록
                </CardTitle>
                <CardDescription>즐겨찾기한 경제 용어와 분석 결과를 확인할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="terms">
                  <TabsList>
                    <TabsTrigger value="terms">경제 용어</TabsTrigger>
                    <TabsTrigger value="analysis">분석 결과</TabsTrigger>
                  </TabsList>

                  <TabsContent value="terms" className="space-y-4">
                    {["GDP", "인플레이션", "금리", "환율", "주가수익비율"].map((term, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{term}</h4>
                          <p className="text-sm text-muted-foreground">
                            {index === 0 && "국내총생산 - 한 나라의 경제 규모를 나타내는 지표"}
                            {index === 1 && "물가상승률 - 전반적인 물가 수준의 지속적인 상승"}
                            {index === 2 && "이자율 - 돈을 빌려주고 받는 대가"}
                            {index === 3 && "통화교환비율 - 서로 다른 통화 간의 교환 비율"}
                            {index === 4 && "PER - 주가를 주당순이익으로 나눈 투자지표"}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    {["삼성전자 재무분석", "SK하이닉스 가치평가", "NAVER 성장성 분석"].map((analysis, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{analysis}</h4>
                          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()} 분석 결과</p>
                        </div>
                        <Button variant="outline" size="sm">
                          다시보기
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 설정 탭 */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  설정
                </CardTitle>
                <CardDescription>앱 사용 환경을 개인화할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">알림 설정</Label>
                      <p className="text-sm text-muted-foreground">학습 리마인더 알림을 받습니다</p>
                    </div>
                    <Button variant="outline" size="sm">
                      설정
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">다크 모드</Label>
                      <p className="text-sm text-muted-foreground">어두운 테마를 사용합니다</p>
                    </div>
                    <Button variant="outline" size="sm">
                      토글
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">데이터 내보내기</Label>
                      <p className="text-sm text-muted-foreground">학습 데이터를 내보냅니다</p>
                    </div>
                    <Button variant="outline" size="sm">
                      내보내기
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button variant="destructive" className="w-full">
                    계정 삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
