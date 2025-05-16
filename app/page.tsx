"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useKifayat } from "@/components/kifayat-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export default function Home() {
  const { user, isLoggedIn } = useKifayat()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      if (!user?.onboardingComplete) {
        router.push("/onboarding")
      } else {
        router.push("/dashboard")
      }
    }
  }, [isLoggedIn, user, router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="bg-green-600 p-4 rounded-full">
            <Leaf className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-green-800">Kifayat</h1>
        <p className="text-xl text-green-700">کفایت شعاری، بجلی بچت</p>
        <p className="text-gray-600 mt-2">AI-powered electricity optimization for Pakistani households</p>

        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                Take control of your electricity costs with personalized recommendations and smart usage planning.
              </p>

              <div className="flex flex-col space-y-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-100">
            English
          </Button>
          <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-100">
            اردو
          </Button>
        </div>
      </div>
    </main>
  )
}
