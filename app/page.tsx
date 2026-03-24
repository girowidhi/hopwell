"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Heart, 
  BarChart3, 
  MessageSquare, 
  Music, 
  CheckCircle2 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Hopewell ChMS</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#benefits" className="text-gray-600 hover:text-gray-900">
              Benefits
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight lg:text-5xl xl:text-6xl text-gray-900">
              Modern Church Management for Kenya
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Streamline your church operations with our comprehensive platform designed specifically for Kenyan churches. Manage members, giving, events, and more—all in one secure system.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">✓ 30-day free trial • No credit card required</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-24 w-24 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Church Management Admin Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl font-bold lg:text-4xl text-gray-900 mb-4">
              Powerful Features for Every Role
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tailored functionality for administrators, pastors, treasurers, and members
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Member Management */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-200 transition">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Member Management</h3>
              <p className="text-gray-600">
                Track members, families, attendance, and spiritual growth with comprehensive profiles.
              </p>
            </div>

            {/* Financial Management */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-200 transition">
              <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Financial Management</h3>
              <p className="text-gray-600">
                Track giving, expenses, budgets, and generate financial reports with M-Pesa integration.
              </p>
            </div>

            {/* Event Management */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-200 transition">
              <CheckCircle2 className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Management</h3>
              <p className="text-gray-600">
                Plan, promote, and manage church events, services, and activities seamlessly.
              </p>
            </div>

            {/* Communications */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-200 transition">
              <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Communications</h3>
              <p className="text-gray-600">
                Send SMS and email campaigns, manage prayer requests, and stay connected.
              </p>
            </div>

            {/* Worship Management */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-200 transition">
              <Music className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Worship Planning</h3>
              <p className="text-gray-600">
                Organize songs, create setlists, schedule rehearsals, and share media.
              </p>
            </div>

            {/* Live Streaming */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-200 transition">
              <Heart className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Streaming</h3>
              <p className="text-gray-600">
                Stream services, sermons, and events to reach members worldwide with Mux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl font-bold lg:text-4xl text-gray-900 mb-4">
              Why Choose Hopewell ChMS?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Designed for Kenya</h3>
                <p className="text-gray-600">Built specifically for Kenyan churches with M-Pesa, Twilio SMS, and local compliance.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">Enterprise-grade security with Supabase, regular backups, and compliance.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mobile First</h3>
                <p className="text-gray-600">Fully responsive design works on smartphones, tablets, and desktops.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600">Smart features powered by OpenAI for sermon assistance and member insights.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl text-white mb-4">
            Ready to Transform Your Church?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Kenyan churches using Hopewell ChMS to streamline operations and grow spiritually.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-blue-500" />
              <span className="text-white font-semibold">Hopewell ChMS</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Support</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Hopewell ChMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
