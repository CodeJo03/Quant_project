"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, GraduationCap, TrendingUp, User, Menu, X } from "lucide-react"
import { useState } from "react"

/**
 * 메인 네비게이션 컴포넌트
 * 경제 학습 플랫폼의 주요 섹션들로 이동할 수 있는 네비게이션 바
 */
export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 네비게이션 메뉴 아이템들 정의
  const navItems = [
    {
      href: "/",
      label: "홈",
      icon: BookOpen,
      description: "메인 대시보드",
    },
    {
      href: "/dictionary",
      label: "경제사전",
      icon: BookOpen,
      description: "경제용어 학습",
    },
    {
      href: "/quiz",
      label: "퀴즈",
      icon: GraduationCap,
      description: "실력 테스트",
    },
    {
      href: "/analysis",
      label: "퀀트분석",
      icon: TrendingUp,
      description: "투자 분석 도구",
    },
    {
      href: "/profile",
      label: "프로필",
      icon: User,
      description: "개인 설정",
    },
  ]

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 브랜드명 */}
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-secondary" />
            <Link href="/" className="text-xl font-bold hover:text-secondary transition-colors">
              EconoLearn
            </Link>
          </div>

          {/* 데스크톱 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-primary/80 hover:text-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <div className="flex items-center space-x-2 ml-4">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoggedIn(false)}
                  className="text-primary-foreground border-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  로그아웃
                </Button>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary-foreground border-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-foreground hover:text-secondary"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* 모바일 네비게이션 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-primary/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-primary/80 hover:text-secondary"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
