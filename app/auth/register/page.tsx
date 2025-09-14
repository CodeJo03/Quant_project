"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

/**
 * 회원가입 페이지 컴포넌트
 * 사용자의 기본 정보와 경제 지식 수준, 관심 분야를 수집하여 맞춤형 학습 경험 제공
 */
export default function RegisterPage() {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    email: "",
    know_level: "",
    like_company: [] as string[],
    like_category: [] as string[],
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // 관심 회사 목록 (실제로는 API에서 가져올 데이터)
  const companies = [
    { id: "1", name: "삼성전자" },
    { id: "2", name: "SK하이닉스" },
    { id: "3", name: "NAVER" },
    { id: "4", name: "카카오" },
    { id: "5", name: "LG화학" },
    { id: "6", name: "현대자동차" },
    { id: "7", name: "셀트리온" },
    { id: "8", name: "KB금융" },
  ]

  // 퀀트 분석 카테고리 목록
  const categories = [
    { id: "1", name: "재무비율 분석" },
    { id: "2", name: "성장성 지표" },
    { id: "3", name: "수익성 지표" },
    { id: "4", name: "안정성 지표" },
    { id: "5", name: "활동성 지표" },
    { id: "6", name: "밸류에이션" },
    { id: "7", name: "기술적 분석" },
    { id: "8", name: "ESG 평가" },
  ]

  // 입력값 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // 체크박스 변경 핸들러 (관심 회사/카테고리)
  const handleCheckboxChange = (field: "like_company" | "like_category", value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }))
  }

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.user_id.trim()) newErrors.user_id = "사용자 ID를 입력해주세요"
    if (formData.user_id.length < 4) newErrors.user_id = "사용자 ID는 4자 이상이어야 합니다"

    if (!formData.password) newErrors.password = "비밀번호를 입력해주세요"
    if (formData.password.length < 8) newErrors.password = "비밀번호는 8자 이상이어야 합니다"
    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/.test(formData.password)) {
      newErrors.password = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다"
    }

    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요"
    if (!formData.email.trim()) newErrors.email = "이메일을 입력해주세요"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요"
    }

    if (!formData.age) newErrors.age = "나이를 입력해주세요"
    const age = Number.parseInt(formData.age)
    if (isNaN(age) || age < 18 || age > 100) {
      newErrors.age = "올바른 나이를 입력해주세요 (18-100)"
    }

    if (!formData.know_level) newErrors.know_level = "경제 지식 수준을 선택해주세요"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 회원가입 처리
  // 백과 연결 상호작용 잘 되는지 확인 완료
  /* 
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: "hello" }),
    });
    const data = await response.json();
    alert("응답: " + JSON.stringify(data));
  } catch (err) {
    alert("에러: " + err);
  }
  }
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // 필요한 필드만 추출
      const { user_id, password, name, age, email, know_level, like_company, like_category } = formData
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          password,
          name,
          age: Number(age),
          email,
          know_level: Number(know_level),
          like_company,
          like_category
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "회원가입 실패")
      }

      alert("회원가입이 완료되었습니다! 로그인해주세요.")
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("회원가입 오류:", error)
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">회원가입</CardTitle>
              <CardDescription>EconoLearn에 가입하여 맞춤형 경제 학습을 시작하세요</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 기본 정보 섹션 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">기본 정보</h3>

                  {/* 사용자 ID */}
                  <div className="space-y-2">
                    <Label htmlFor="user_id">사용자 ID *</Label>
                    <Input
                      id="user_id"
                      type="text"
                      value={formData.user_id}
                      onChange={(e) => handleInputChange("user_id", e.target.value)}
                      placeholder="4자 이상의 영문, 숫자 조합"
                      className={errors.user_id ? "border-destructive" : ""}
                    />
                    {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                  </div>

                  {/* 비밀번호 */}
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호 *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="8자 이상, 영문/숫자/특수문자 포함"
                        className={errors.password ? "border-destructive pr-10" : "pr-10"}
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

                  {/* 비밀번호 확인 */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="비밀번호를 다시 입력하세요"
                        className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>

                  {/* 이름 */}
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="실명을 입력하세요"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  {/* 나이와 이메일 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">나이 *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="나이"
                        min="18"
                        max="100"
                        className={errors.age ? "border-destructive" : ""}
                      />
                      {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="example@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* 학습 정보 섹션 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">학습 정보</h3>

                  {/* 경제 지식 수준 */}
                  <div className="space-y-2">
                    <Label htmlFor="know_level">경제 지식 수준 *</Label>
                    <Select
                      value={formData.know_level}
                      onValueChange={(value) => handleInputChange("know_level", value)}
                    >
                      <SelectTrigger className={errors.know_level ? "border-destructive" : ""}>
                        <SelectValue placeholder="현재 경제 지식 수준을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">초급 - 경제 용어가 생소함</SelectItem>
                        <SelectItem value="2">중급 - 기본적인 경제 개념 이해</SelectItem>
                        <SelectItem value="3">고급 - 투자 경험 및 심화 지식 보유</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.know_level && <p className="text-sm text-destructive">{errors.know_level}</p>}
                  </div>

                  {/* 관심 회사 */}
                  <div className="space-y-3">
                    <Label>관심 회사 (선택사항)</Label>
                    <p className="text-sm text-muted-foreground">
                      퀀트 분석에서 우선적으로 보고 싶은 회사를 선택하세요
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {companies.map((company) => (
                        <div key={company.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`company-${company.id}`}
                            checked={formData.like_company.includes(company.id)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("like_company", company.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={`company-${company.id}`} className="text-sm">
                            {company.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 관심 분석 카테고리 */}
                  <div className="space-y-3">
                    <Label>관심 분석 카테고리 (선택사항)</Label>
                    <p className="text-sm text-muted-foreground">
                      퀀트 분석에서 중점적으로 보고 싶은 지표를 선택하세요
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={formData.like_category.includes(category.id)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("like_category", category.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="space-y-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "가입 처리 중..." : "회원가입"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline">
                      로그인하기
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
