'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Loader2, TrendingUp, Shield, AlertTriangle, CheckCircle2, Code2, BarChart3, Database, Zap, Activity, Target, Award, Clock, FileText, Sparkles, ArrowRight, Settings, Gauge, User, MapPin, Car as CarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import './pendulum.css'


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
// Types for API response
interface PredictionResponse {
  claim_probability: number
  prediction: number
  risk_level: 'Low' | 'Medium' | 'High'
  threshold_used: number
    top_risk_drivers: string[]
}

interface FormData {
  policy_tenure: number
  age_of_car: number
  age_of_policyholder: number
  population_density: number
  area_cluster: string
  segment: string
  fuel_type: string
  transmission_type: string
  airbags: number
  ncap_rating: number
}

const DEFAULT_FORM_DATA: FormData = {
  policy_tenure: 3,
  age_of_car: 2,
  age_of_policyholder: 35,
  population_density: 200,
  area_cluster: 'C18',
  segment: 'B2',
  fuel_type: 'Petrol',
  transmission_type: 'Manual',
  airbags: 2,
  ncap_rating: 4
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
  setLoading(true)
  setError(null)
  setPrediction(null)

  try {
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/predict`
    console.log("API URL:", API_URL)

    // Run API call and delay in parallel
    const [response] = await Promise.all([
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }),
      sleep(5000), // 👈 FORCE 5-second loading animation
    ])

    if (!response.ok) {
      throw new Error("Failed to get prediction from the model")
    }

    const data: PredictionResponse = await response.json()
    setPrediction(data)
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "An error occurred while processing your request"
    )
  } finally {
    setLoading(false)
  }
}

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-lg'
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200 shadow-lg'
      case 'High': return 'bg-red-50 text-red-700 border-red-200 shadow-lg'
      default: return 'bg-slate-50 text-slate-700 border-slate-200 shadow-lg'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low': return <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      case 'Medium': return <AlertTriangle className="h-8 w-8 text-amber-600" />
      case 'High': return <AlertTriangle className="h-8 w-8 text-red-600" />
      default: return <Shield className="h-8 w-8 text-slate-600" />
    }
  }

  const getProgressColor = (probability: number) => {
    if (probability < 0.4) return 'bg-emerald-500'
    if (probability < 0.7) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getSliderColor = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100
    if (percentage < 33) return 'from-emerald-400 to-emerald-600'
    if (percentage < 66) return 'from-amber-400 to-amber-600'
    return 'from-red-400 to-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl flex-shrink-0">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                    Prediction Simulator
                  </h1>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 shadow-lg text-sm font-semibold">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Interactive Demo
                </Badge>
                <Badge variant="outline" className="border-amber-300 text-amber-700 px-4 py-2 text-sm font-semibold">
                  <Settings className="h-4 w-4 mr-2" />
                  Real-time Updates
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section: Prediction Simulator */}
          <section id="simulator" className="scroll-mt-24">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 overflow-hidden">
                  <CardHeader className="flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    Input Parameters
                  </CardTitle>
                  <CardDescription className="mt-2 text-blue-100 text-base">
                    Adjust parameters using interactive sliders to predict claim probability
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Policy Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-3 uppercase tracking-wider">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      Policy Details
                    </h3>
                    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/60">
                      {/* Policy Tenure Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="policy_tenure" className="text-slate-700 font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Policy Tenure
                          </Label>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            {formData.policy_tenure} years
                          </Badge>
                        </div>
                        <Slider
                          id="policy_tenure"
                          min={1}
                          max={15}
                          step={1}
                          value={[formData.policy_tenure]}
                          onValueChange={(value) => setFormData({ ...formData, policy_tenure: value[0] })}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>1 year</span>
                          <span>15 years</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="area_cluster" className="text-slate-700 font-semibold mb-2 block flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            Area Cluster
                          </Label>
                          <Select
                            value={formData.area_cluster}
                            onValueChange={(value) => setFormData({ ...formData, area_cluster: value })}
                          >
                            <SelectTrigger className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                              <SelectValue placeholder="Select area cluster" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 22 }, (_, i) => {
                                const cluster = `C${i + 1}`
                                return (
                                  <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="segment" className="text-slate-700 font-semibold mb-2 block flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-blue-600" />
                            Segment
                          </Label>
                          <Select
                            value={formData.segment}
                            onValueChange={(value) => setFormData({ ...formData, segment: value })}
                          >
                            <SelectTrigger className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                              <SelectValue placeholder="Select segment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A (Mini)</SelectItem>
                              <SelectItem value="B1">B1</SelectItem>
                              <SelectItem value="B2">B2</SelectItem>
                              <SelectItem value="C1">C1</SelectItem>
                              <SelectItem value="C2">C2</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="Utility">Utility</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                  {/* Vehicle Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-3 uppercase tracking-wider">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-md">
                        <CarIcon className="h-4 w-4 text-white" />
                      </div>
                      Vehicle Details
                    </h3>
                    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-200/60">
                      {/* Vehicle Age Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="age_of_car" className="text-slate-700 font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-indigo-600" />
                            Vehicle Age
                          </Label>
                          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                            {formData.age_of_car} years
                          </Badge>
                        </div>
                        <Slider
                          id="age_of_car"
                          min={0}
                          max={20}
                          step={1}
                          value={[formData.age_of_car]}
                          onValueChange={(value) => setFormData({ ...formData, age_of_car: value[0] })}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>New</span>
                          <span>20 years</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fuel_type" className="text-slate-700 font-semibold mb-2 block">Fuel Type</Label>
                          <Select
                            value={formData.fuel_type}
                            onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                          >
                            <SelectTrigger className="mt-1 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Petrol">Petrol</SelectItem>
                              <SelectItem value="Diesel">Diesel</SelectItem>
                              <SelectItem value="CNG">CNG</SelectItem>
                              <SelectItem value="Electric">Electric</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="transmission_type" className="text-slate-700 font-semibold mb-2 block">Transmission</Label>
                          <Select
                            value={formData.transmission_type}
                            onValueChange={(value) => setFormData({ ...formData, transmission_type: value })}
                          >
                            <SelectTrigger className="mt-1 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Manual">Manual</SelectItem>
                              <SelectItem value="Automatic">Automatic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* NCAP Rating Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="ncap_rating" className="text-slate-700 font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4 text-indigo-600" />
                            NCAP Safety Rating
                          </Label>
                          <Badge className={cn(
                            formData.ncap_rating >= 4 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                            formData.ncap_rating >= 3 ? "bg-amber-100 text-amber-700 border-amber-200" :
                            "bg-red-100 text-red-700 border-red-200"
                          )}>
                            {formData.ncap_rating} Stars
                          </Badge>
                        </div>
                        <Slider
                          id="ncap_rating"
                          min={1}
                          max={5}
                          step={1}
                          value={[formData.ncap_rating]}
                          onValueChange={(value) => setFormData({ ...formData, ncap_rating: value[0] })}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>⭐</span>
                          <span>⭐⭐⭐⭐⭐</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="airbags" className="text-slate-700 font-semibold mb-2 block">Number of Airbags</Label>
                        <Select
                          value={formData.airbags.toString()}
                          onValueChange={(value) => setFormData({ ...formData, airbags: parseInt(value) })}
                        >
                          <SelectTrigger className="mt-1 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                            <SelectValue placeholder="Select airbags" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0 Airbags</SelectItem>
                            <SelectItem value="1">1 Airbag</SelectItem>
                            <SelectItem value="2">2 Airbags</SelectItem>
                            <SelectItem value="4">4 Airbags</SelectItem>
                            <SelectItem value="6">6 Airbags</SelectItem>
                            <SelectItem value="8">8 Airbags</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                  {/* Driver & Environment */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-3 uppercase tracking-wider">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      Driver & Environment
                    </h3>
                    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl border border-slate-200/60">
                      {/* Policyholder Age Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="age_of_policyholder" className="text-slate-700 font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-purple-600" />
                            Policyholder Age
                          </Label>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            {formData.age_of_policyholder} years
                          </Badge>
                        </div>
                        <Slider
                          id="age_of_policyholder"
                          min={18}
                          max={80}
                          step={1}
                          value={[formData.age_of_policyholder]}
                          onValueChange={(value) => setFormData({ ...formData, age_of_policyholder: value[0] })}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>18 years</span>
                          <span>80 years</span>
                        </div>
                      </div>

                      {/* Population Density Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="population_density" className="text-slate-700 font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            Population Density
                          </Label>
                          <Badge className={cn(
                            formData.population_density < 300 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                            formData.population_density < 700 ? "bg-amber-100 text-amber-700 border-amber-200" :
                            "bg-red-100 text-red-700 border-red-200"
                          )}>
                            {formData.population_density} people/km²
                          </Badge>
                        </div>
                        <Slider
                          id="population_density"
                          min={100}
                          max={10000}
                          step={50}
                          value={[formData.population_density]}
                          onValueChange={(value) => setFormData({ ...formData, population_density: value[0] })}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>Low (100)</span>
                          <span>High (10000)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePredict}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 text-lg font-bold py-6 rounded-2xl group"
                    size="lg"
                  >
                    
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Processing Prediction...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Predict Claim Probability
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {error && (
                    <Alert variant="destructive" className="mt-4 border-red-300 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-red-900 font-semibold">Error</AlertTitle>
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 overflow-hidden">
                  <CardHeader className="flex flex-col gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Prediction Results
                  </CardTitle>
                  <CardDescription className="mt-2 text-indigo-100 text-base">
                    Real-time model output and risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-8">
                      {/* Pendulum Animation */}
                      <div className="pendulum-container">
                        <div className="pendulum_box">
                          <div className="ball first"></div>
                          <div className="ball"></div>
                          <div className="ball"></div>
                          <div className="ball"></div>
                          <div className="ball last"></div>
                        </div>
                      </div>

                      {/* Loading Text */}
                      <div className="text-center space-y-4">
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Analyzing Risk Factors...
                        </p>
                        <p className="text-lg text-slate-600 max-w-sm">
                          Processing through logistic regression model with 42 features
                        </p>
                        <div className="flex items-center gap-4 justify-center text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span>Feature Extraction</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <span>Model Inference</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                            <span>Risk Calculation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : prediction ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                      {/* Claim Probability */}
                      <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                          <Label className="text-lg font-bold text-slate-900">Claim Probability</Label>
                          <Badge className={cn(
                            prediction.claim_probability < 0.4 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                            prediction.claim_probability < 0.7 ? "bg-amber-100 text-amber-700 border-amber-200" :
                            "bg-red-100 text-red-700 border-red-200"
                          )}>
                            {prediction.claim_probability < 0.4 ? 'Low Risk' : prediction.claim_probability < 0.7 ? 'Medium Risk' : 'High Risk'}
                          </Badge>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border-2 border-slate-200">
                          <div className="text-6xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                            {(prediction.claim_probability * 100).toFixed(2)}%
                          </div>
                          <div className="text-sm text-slate-600 font-medium">Predicted Probability</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-medium text-slate-600">
                            <span>Safe</span>
                            <span>Risky</span>
                          </div>
                          <Progress
                            value={prediction.claim_probability * 100}
                            className="h-4 bg-slate-200"
                          />
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>0%</span>
                            <span>Threshold: {(prediction.threshold_used * 100).toFixed(0)}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                      {/* Risk Level Badge */}
                      <div className="space-y-4">
                        <Label className="text-lg font-bold text-slate-900">Risk Level</Label>
                        <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl border-2 border-slate-200">
                          {getRiskIcon(prediction.risk_level)}
                          <Badge
                            className={cn(
                              'text-2xl py-3 px-8 border-2 font-bold shadow-xl',
                              getRiskBadgeColor(prediction.risk_level)
                            )}
                          >
                            {prediction.risk_level}
                          </Badge>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                      {/* Decision */}
                      <div className="space-y-4">
                        <Label className="text-lg font-bold text-slate-900">Model Decision</Label>
                        <div className={cn(
                          'p-8 rounded-2xl border-2 text-center shadow-lg',
                          prediction.prediction === 1
                            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
                            : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300'
                        )}>
                          <div className="flex items-center justify-center gap-3 mb-3">
                            {prediction.prediction === 1 ? (
                              <AlertTriangle className="h-10 w-10 text-red-600" />
                            ) : (
                              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                            )}
                            <p className="text-3xl font-bold text-slate-900">
                              {prediction.prediction === 1
                                ? 'Likely to Claim'
                                : 'Unlikely to Claim'}
                            </p>
                          </div>
                          <p className="text-base text-slate-600">
                            Risk threshold set at {(prediction.threshold_used * 100).toFixed(0)}% to prioritize identifying high-risk policies.
                          </p>
                        </div>
                      </div>
                       {/* Explanation: Top Risk Drivers */}
                        {prediction.top_risk_drivers && prediction.top_risk_drivers.length > 0 && (
                          <div className="space-y-4">
                            <Label className="text-lg font-bold text-slate-900">
                              Why the Model Flagged This Policy
                            </Label>
                            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-lg">
                              <ul className="space-y-3">
                                {prediction.top_risk_drivers.map((reason, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <span className="text-slate-700 leading-relaxed text-base">
                                      {reason}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}             
                      {/* Key Insights */}
                      <div className="space-y-4">
                        <Label className="text-lg font-bold text-slate-900">Key Insights</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="text-sm text-blue-700 font-semibold mb-1">Prediction</div>
                            <div className="text-2xl font-bold text-slate-900">
                              {prediction.prediction === 1 ? 'CLAIM' : 'NO CLAIM'}
                            </div>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                            <div className="text-sm text-indigo-700 font-semibold mb-1">Threshold Used</div>
                            <div className="text-2xl font-bold text-slate-900">
                              {(prediction.threshold_used * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6 shadow-xl">
                        <BarChart3 className="h-12 w-12 text-slate-400" />
                      </div>
                      <p className="text-2xl font-bold text-slate-800 mb-2">Ready to Predict</p>
                      <p className="text-base text-slate-600 max-w-md">
                        Fill in the policy and vehicle details using the interactive sliders, then click "Predict Claim Probability" to see the model output
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                        <Sparkles className="h-4 w-4" />
                        <span>Adjust sliders to see real-time value updates</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          {/* Section: Model Outputs & Visuals */}
          <section id="model-outputs" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">What My Model Is Doing Internally</h2>
              <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 shadow-lg text-sm font-semibold">
                Model Outputs & Visuals
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Probability Distribution */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 flex flex-col items-center text-center shadow-xl">
                <BarChart3 className="h-10 w-10 text-blue-600 mb-4" />
                <div className="font-bold text-lg text-blue-900 mb-3">Probability Distribution</div>
                <div className="text-base text-slate-700 leading-relaxed">
                  Our model outputs a probability between 0 and 1 for each policy, representing the estimated chance of a claim. Most policies cluster at low probabilities, but a meaningful minority are flagged as higher risk.
                </div>
              </div>
              {/* Top Coefficients */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 flex flex-col items-center text-center shadow-xl">
                <TrendingUp className="h-10 w-10 text-indigo-600 mb-4" />
                <div className="font-bold text-lg text-indigo-900 mb-3">Top Coefficients</div>
                <div className="text-base text-slate-700 leading-relaxed">
                  We interpret logistic regression coefficients as odds ratios: features with the largest positive coefficients most strongly increase claim odds, while negative coefficients are protective. This provides transparency into our model's risk drivers.
                </div>
              </div>
              {/* Decision Threshold */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 flex flex-col items-center text-center shadow-xl">
                <Target className="h-10 w-10 text-purple-600 mb-4" />
                <div className="font-bold text-lg text-purple-900 mb-3">Decision Threshold</div>
                <div className="text-base text-slate-700 leading-relaxed">
                  We set our model's decision threshold at 0.40: policies with claim probability above 40% are classified as "claim". This threshold balances recall and precision for academic risk control.
                </div>
              </div>
            </div>
          </section>

          <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <section id="insights" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">Model Insights</h2>
              <Badge className="ml-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 shadow-lg text-sm font-semibold">
                Feature Interpretability
              </Badge>
            </div>
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Feature Interpretability</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Understanding which factors drive claim likelihood
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Risk-Increasing Factors */}
                  <div className="space-y-5 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow-md">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-xl">Key Risk-Increasing Factors</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-red-900">Area Cluster:</strong> Certain geographic areas show significantly higher claim rates, likely due to traffic density and road conditions.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-red-900">Lower NCAP Safety Rating:</strong> Vehicles with fewer safety features have higher claim probabilities, indicating increased risk in accidents.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">3</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-red-900">Vehicle Category:</strong> Certain segments and vehicle types demonstrate elevated risk profiles based on historical claim data.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">4</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-red-900">Lower Number of Airbags:</strong> Reduced safety features correlate with higher claim frequencies and severity.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Protective Factors */}
                  <div className="space-y-5 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-xl">Key Protective Factors</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-emerald-900">Higher NCAP Rating:</strong> Vehicles with 5-star safety ratings reduce claim odds by approximately 20–30%, holding other factors constant.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-emerald-900">Older Vehicle Age:</strong> In this dataset, older vehicles are associated with lower claim rates, potentially reflecting more cautious driving behavior or lower insured value.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">3</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-emerald-900">Longer Policy Tenure:</strong> Policies with longer tenure demonstrate lower claim risk, indicating stability and experience.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">4</span>
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          <strong className="text-emerald-900">Certain Clusters:</strong> Specific area clusters show better-than-average risk profiles, possibly due to infrastructure or demographic factors.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md">
                  <Code2 className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="text-blue-900 font-bold">Coefficient Interpretation</AlertTitle>
                  <AlertDescription className="text-slate-700 text-base mt-2">
                    The model uses logistic regression coefficients to quantify each feature's impact. Positive coefficients increase the log-odds of a claim (higher risk), while negative coefficients decrease them (lower risk). The magnitude indicates the strength of influence.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Section 6: Evaluation & Business Interpretation */}
          <section id="evaluation" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">Evaluation & Business Interpretation</h2>
              <Badge className="ml-auto bg-gradient-to-r from-violet-500 to-purple-500 text-white px-5 py-2 shadow-lg text-sm font-semibold">
                Model Performance
              </Badge>
            </div>
            <div className="space-y-8">
              {/* Model Performance */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-violet-50/30 to-purple-50/30 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Model Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">0.59</div>
                      <div className="text-sm text-slate-600 font-bold uppercase tracking-wider mb-2">ROC-AUC Score</div>
                      <p className="text-xs text-slate-500">
                        Measures the model's ability to distinguish between claim and no-claim cases
                      </p>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border-2 border-indigo-200 hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-3">~62%</div>
                      <div className="text-sm text-slate-600 font-bold uppercase tracking-wider mb-2">Accuracy</div>
                      <p className="text-xs text-slate-500">
                        Overall prediction correctness on the test dataset
                      </p>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-200 hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">0.40</div>
                      <div className="text-sm text-slate-600 font-bold uppercase tracking-wider mb-2">Decision Threshold</div>
                      <p className="text-xs text-slate-500">
                        Optimized threshold to balance recall and precision
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calibration Note */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Calibration & Risk Ranking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-slate-700 leading-relaxed text-lg">
                    The model is optimized for <strong className="text-indigo-700">risk ranking</strong> rather than perfectly calibrated probabilities, which is common in insurance underwriting. The ROC-AUC of 0.59 indicates the model has better-than-random discrimination ability.
                  </p>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    While not a high-performing model in isolation, it provides a baseline framework that can be improved with feature engineering, additional data sources, or alternative modeling approaches such as Random Forest or Gradient Boosting.
                  </p>
                </CardContent>
              </Card>

              {/* Business Decision */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-50 via-violet-50/30 to-purple-50/30 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Business Decision Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    The model intentionally <strong className="text-violet-700">prioritizes recall of claim cases</strong>, accepting higher false positives to reduce underwriting losses. This trade-off reflects an underwriting strategy that emphasizes risk control over market share in this demonstration.
                  </p>
                  <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-violet-200 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex-shrink-0">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-base text-slate-700 leading-relaxed">
                           <strong className="text-violet-900">Key Insight:</strong> This dashboard is an academic demonstration of our insurance risk modeling work. Real-world implementation would require further validation, regulatory review, and possibly a combination of models and expert rules.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* Section 7: Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white mt-20 border-t-4 border-indigo-500">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Tech Stack */}
              <div>
                <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                  <Code2 className="h-6 w-6" />
                  Tech Stack
                </h3>
                <div className="space-y-3 text-base">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Code2 className="h-5 w-5 text-blue-400" />
                    <span><strong>Backend:</strong> Python, scikit-learn, FastAPI</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Code2 className="h-5 w-5 text-indigo-400" />
                    <span><strong>Frontend:</strong> Next.js 15, TypeScript, Tailwind CSS</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <span><strong>Deployment:</strong> Railway (backend), Vercel (frontend)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Database className="h-5 w-5 text-emerald-400" />
                    <span><strong>Model:</strong> Logistic Regression (scikit-learn)</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div>
                <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  Disclaimer
                </h3>
                <div className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border-2 border-red-500/30 backdrop-blur-sm">
                  <p className="text-base leading-relaxed text-slate-200">
                    This model and dashboard are for <strong className="text-white">academic demonstration purposes only</strong>. The predictions and risk assessments should not be used for actual insurance underwriting or pricing decisions.
                  </p>
                  <p className="text-base leading-relaxed text-slate-200 mt-4">
                    Real-world implementation requires validation on additional datasets, regulatory compliance, and integration with comprehensive risk assessment frameworks.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-10 bg-white/20" />

            <div className="text-center space-y-4">
                            <div className="mt-6 p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md inline-block">
                <p className="text-sm uppercase tracking-wider text-slate-300 mb-2">
                  Our Team
                </p>
                <p className="text-base font-semibold text-white leading-relaxed">
                  Aditi Sreenivas (25020441011)<br/>
                  Akash (25020441020)<br/>
                  Jay Deore (25020441119)<br/>
                  Roshni R (25020441225)<br/>
                  Dixit Sharma (25020441095)
                </p>
              </div>
              </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
