"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

/**
 * 로그인 페이지 컴포넌트
 * 사용자 인증을 처리하고 개인화된 대시보드로 이동
 */
export default function LoginPage() {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // 입력값 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (loginError) {
      setLoginError("")
    }
  }

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.user_id.trim()) {
      newErrors.user_id = "사용자 ID를 입력해주세요"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setLoginError("")

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // 로그인 성공: 사용자 정보 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            user_id: data.user_id,
            name: data.name,
            know_level: data.know_level,
            email: data.email,
            isLoggedIn: true,
          }),
        )
        alert("로그인 성공!")
        window.location.href = "/dashboard"
      } else {
        setLoginError(data.detail || "사용자 ID 또는 비밀번호가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("로그인 오류:", error)
      setLoginError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">로그인</CardTitle>
              <CardDescription>EconoLearn 계정으로 로그인하세요</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 로그인 에러 메시지 */}
                {loginError && (
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                {/* 사용자 ID */}
                <div className="space-y-2">
                  <Label htmlFor="user_id">사용자 ID</Label>
                  <Input
                    id="user_id"
                    type="text"
                    value={formData.user_id}
                    onChange={(e) => handleInputChange("user_id", e.target.value)}
                    placeholder="사용자 ID를 입력하세요"
                    className={errors.user_id ? "border-destructive" : ""}
                    autoComplete="username"
                  />
                  {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                {/* 로그인 버튼 */}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>

                {/* 회원가입 링크 */}
                <div className="text-center text-sm text-muted-foreground">
                  계정이 없으신가요?{" "}
                  <Link href="/auth/register" className="text-primary hover:underline">
                    회원가입하기
                  </Link>
                </div>

                {/* 임시 테스트 계정 안내 */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">테스트용 계정</h4>
                  <p className="text-xs text-muted-foreground">
                    개발 단계에서는 임의의 ID와 비밀번호로 로그인이 가능합니다.
                    <br />
                    예: ID: test123, 비밀번호: password123
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
