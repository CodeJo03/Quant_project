import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, TrendingUp, Users, Target, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

/**
 * 메인 홈페이지 컴포넌트
 * 경제 학습 플랫폼의 랜딩 페이지로 주요 기능들을 소개하고 접근할 수 있도록 함
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              경제 지식을 쌓고
              <span className="text-primary block">투자 전략을 배우세요</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              20대를 위한 맞춤형 경제 학습 플랫폼. 기초 경제 용어부터 퀀트 분석까지, 체계적인 학습으로 경제적 사고력을
              키워보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/register">
                  학습 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/dictionary">경제사전 둘러보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 소개 섹션 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">체계적인 경제 학습 시스템</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              개인 맞춤형 학습 경험으로 경제 전문가로 성장하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 경제사전 카드 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">경제용어 사전</CardTitle>
                <CardDescription>난이도별로 분류된 경제 용어를 체계적으로 학습하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• 개인 수준에 맞는 용어 추천</li>
                  <li>• 즐겨찾기 및 복습 기능</li>
                  <li>• 실제 사례와 함께 설명</li>
                </ul>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dictionary">사전 보기</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 퀴즈 시스템 카드 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">실력 테스트</CardTitle>
                <CardDescription>객관식 퀴즈로 학습한 내용을 점검하고 실력을 향상시키세요</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• 난이도별 맞춤 문제</li>
                  <li>• 틀린 문제 복습 기능</li>
                  <li>• 학습 진도 추적</li>
                </ul>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/quiz">퀴즈 시작</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 퀀트 분석 카드 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">퀀트 분석</CardTitle>
                <CardDescription>기업 재무제표를 분석하여 투자 전략을 수립하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• 재무제표 자동 분석</li>
                  <li>• 맞춤형 투자 지표 선택</li>
                  <li>• 시각적 분석 결과 제공</li>
                </ul>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/analysis">분석 시작</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">1,000+</div>
              <div className="text-muted-foreground">경제 용어</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">퀴즈 문제</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">50+</div>
              <div className="text-muted-foreground">분석 지표</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            지금 시작해서 경제 전문가가 되어보세요
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            개인 맞춤형 학습으로 경제적 사고력을 키우고, 실전 투자 전략을 배워보세요.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/auth/register">
              무료로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <TrendingUp className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold">EconoLearn</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">20대를 위한 경제 학습 플랫폼</p>
            <div className="text-sm text-primary-foreground/60">© 2025 EconoLearn. 포트폴리오 프로젝트입니다.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
