import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, TrendingUp, Users, Target, Award, ArrowRight, BarChart3, PieChart, LineChart } from "lucide-react"
import Link from "next/link"

/**
 * 메인 홈페이지 컴포넌트
 * 금융 터미널 스타일의 전문적인 랜딩 페이지
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navigation />

      {/* 히어로 섹션 - 금융 대시보드 느낌 */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Financial Intelligence Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                데이터로 읽는<br />
                <span className="text-primary">경제의 흐름</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 text-pretty leading-relaxed">
                EconoLearn은 20대를 위한 전문 퀀트 분석 및 경제 학습 플랫폼입니다.
                실시간 데이터 분석과 체계적인 커리큘럼으로 당신의 금융 지능을 깨우세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-lg px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Link href="/auth/register">
                    무료로 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 h-12 border-primary/20 hover:bg-primary/5 bg-background/50 backdrop-blur-sm">
                  <Link href="/analysis">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                    시장 분석 보기
                  </Link>
                </Button>
              </div>
            </div>

            {/* 우측 추상적 차트 그래픽 */}
            <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
              <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur-md shadow-2xl p-6 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50"></div>

                {/* 가상의 차트 UI */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Market Index</div>
                      <div className="text-2xl font-bold flex items-center">
                        2,543.89
                        <span className="text-chart-3 text-sm ml-2 flex items-center bg-chart-3/10 px-1.5 py-0.5 rounded">
                          <TrendingUp className="h-3 w-3 mr-1" /> +1.2%
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {['1D', '1W', '1M', '1Y'].map((period) => (
                        <div key={period} className={`text-xs px-2 py-1 rounded cursor-pointer ${period === '1M' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                          {period}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 차트 라인 (CSS로 구현) */}
                  <div className="h-[200px] w-full relative border-l border-b border-border/50">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path d="M0,150 C50,140 100,160 150,100 C200,40 250,80 300,60 C350,40 400,20 500,10" fill="none" stroke="var(--primary)" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      <path d="M0,150 C50,140 100,160 150,100 C200,40 250,80 300,60 C350,40 400,20 500,10 L500,200 L0,200 Z" fill="url(#gradient)" opacity="0.2" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* 인터랙티브 포인트 */}
                    <div className="absolute top-[60px] left-[300px] w-3 h-3 bg-background border-2 border-primary rounded-full shadow-[0_0_10px_var(--primary)] z-10"></div>
                    <div className="absolute top-[30px] left-[300px] bg-card border border-border px-3 py-1.5 rounded text-xs shadow-lg">
                      <div className="font-bold">High</div>
                      <div className="text-chart-3">+24.5%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      { label: "Volume", value: "1.2B", color: "text-foreground" },
                      { label: "Volatility", value: "Low", color: "text-chart-3" },
                      { label: "Sentiment", value: "Bullish", color: "text-chart-3" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-background/50 rounded p-3 border border-border/50">
                        <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                        <div className={`font-semibold ${stat.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 그리드 */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Professional Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              전문가 수준의 분석 도구와 체계적인 학습 시스템을 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 퀀트 분석 카드 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Quant Analysis</CardTitle>
                <CardDescription>기업 재무제표 기반 데이터 분석</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>재무제표 자동 시각화</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>커스텀 투자 지표 설정</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>실시간 시장 데이터 연동</li>
                </ul>
                <Button asChild className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-0">
                  <Link href="/analysis">분석 시작하기</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 경제사전 카드 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">Economic Wiki</CardTitle>
                <CardDescription>체계적인 경제 용어 데이터베이스</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></div>난이도별 용어 분류</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></div>실무 중심 예제 제공</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></div>스마트 검색 시스템</li>
                </ul>
                <Button asChild className="w-full bg-accent/10 text-accent-foreground hover:bg-accent hover:text-accent-foreground border-0">
                  <Link href="/dictionary">사전 검색하기</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 퀴즈 시스템 카드 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5 group">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <GraduationCap className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl group-hover:text-secondary transition-colors">Skill Assessment</CardTitle>
                <CardDescription>실전형 경제 지식 테스트</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></div>레벨별 맞춤형 퀴즈</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></div>오답 노트 및 분석</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></div>학습 성취도 리포트</li>
                </ul>
                <Button asChild className="w-full bg-secondary/10 text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground border-0">
                  <Link href="/quiz">테스트 시작하기</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 데이터 통계 섹션 */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
            <div className="p-4">
              <div className="text-4xl font-bold text-foreground mb-2 tabular-nums">1,240+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Economic Terms</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-foreground mb-2 tabular-nums">500+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Quiz Problems</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-foreground mb-2 tabular-nums">150+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Analysis Metrics</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-foreground mb-2 tabular-nums">24/7</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Market Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">EconoLearn</span>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p className="mb-2">Financial Intelligence Platform for Next Gen</p>
              <p>© 2025 EconoLearn. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
