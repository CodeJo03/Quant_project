"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, GraduationCap, TrendingUp, User, Menu, X, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * 메인 네비게이션 컴포넌트
 * 금융 터미널 스타일의 전문적인 네비게이션 바
 */
export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // 스크롤 감지하여 네비게이션 바 스타일 변경
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 로그인 상태를 localStorage에서 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      setIsLoggedIn(!!user)
    }
  }, [])

  // 로그인/로그아웃 시 상태 동기화
  useEffect(() => {
    const handleStorage = () => {
      const user = localStorage.getItem("user")
      setIsLoggedIn(!!user)
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  const navItems = [
    {
      href: "/",
      label: "대시보드",
      icon: BarChart3,
      description: "시장 개요 및 현황",
    },
    {
      href: "/dictionary",
      label: "경제사전",
      icon: BookOpen,
      description: "금융 용어 및 정의",
    },
    {
      href: "/quiz",
      label: "퀴즈",
      icon: GraduationCap,
      description: "지식 테스트",
    },
    {
      href: "/analysis",
      label: "퀀트분석",
      icon: TrendingUp,
      description: "데이터 기반 투자 분석",
    },
    {
      href: "/profile",
      label: "프로필",
      icon: User,
      description: "계정 설정",
    },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${scrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-md"
          : "bg-background/50 backdrop-blur-sm border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 영역 */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <Link href="/" className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground">EconoLearn</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Financial Intelligence</span>
            </Link>
          </div>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <div className="h-6 w-px bg-border mx-4" />

            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                >
                  로그아웃
                </Button>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
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
              className="text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl absolute w-full shadow-xl animate-in slide-in-from-top-5">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`p-2 rounded-md ${isActive ? "bg-primary/20" : "bg-muted"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground font-normal">{item.description}</span>
                  </div>
                </Link>
              )
            })}

            <div className="border-t border-border my-4 pt-4 flex flex-col space-y-3">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full justify-center border-destructive/50 text-destructive"
                >
                  로그아웃
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
