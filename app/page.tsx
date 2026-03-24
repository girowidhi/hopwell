"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Heart,
  BarChart3,
  MessageSquare,
  Music,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Building,
  CreditCard,
  Lock,
  Monitor,
  Play,
  Star,
  Sparkles,
  Calendar,
  Video,
  Wallet,
  Smartphone,
  Cross,
  Circle,
  BookOpen,
  Church,
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"video" | "demo" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3D Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      type: "cross" | "particle";
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        type: Math.random() > 0.7 ? "cross" : "particle",
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      gradient.addColorStop(0, "#0A0F1E");
      gradient.addColorStop(1, "#05070F");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.globalAlpha = particle.opacity;
        if (particle.type === "cross") {
          ctx.strokeStyle = "#C9A87C";
          ctx.lineWidth = 1.5;
          const size = particle.size * 3;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y - size / 2);
          ctx.lineTo(particle.x, particle.y + size / 2);
          ctx.moveTo(particle.x - size / 3, particle.y - size / 6);
          ctx.lineTo(particle.x + size / 3, particle.y - size / 6);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#C9A87C";
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openModal = (type: "video" | "demo") => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const features = [
    {
      icon: Users,
      title: "Cell Group Management",
      description:
        "Manage house fellowships, cell groups, and small groups with attendance tracking, schedules, and member assignments across your church locations.",
    },
    {
      icon: Circle,
      title: "Cell Group System",
      description:
        "Organize your church into thriving cell groups with automated routing, visit tracking, and reports for effective discipleship.",
    },
    {
      icon: Wallet,
      title: "Offering & Tithe Tracking",
      description:
        "Record offerings, tithes, and donations with M-Pesa integration. Generate detailed reports for church finance committees.",
    },
    {
      icon: MessageSquare,
      title: "SMS Notifications",
      description:
        "Send bulk SMS to congregation for service reminders, announcements, prayer requests, and urgent notifications via Twilio.",
    },
    {
      icon: BookOpen,
      title: "Youth Ministry",
      description:
        "Coordinate youth programs, events, and Bible study groups. Track participation and engage the younger generation.",
    },
    {
      icon: Calendar,
      title: "Event Scheduling",
      description:
        "Plan and manage church events, services, revivals, and conferences with online registration and attendee tracking.",
    },
  ];

  const whyChooseUs = [
    {
      icon: Zap,
      title: "Local M-Pesa Integration",
      description:
        "Seamlessly accept tithes and offerings via M-Pesa with automatic reconciliation and instant notifications.",
    },
    {
      icon: Heart,
      title: "Built for Kenyan Churches",
      description:
        "Designed with input from pastors and church administrators across Kenya to meet real ministry needs.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security to protect member data. Fully compliant with Kenyan data protection regulations.",
    },
    {
      icon: Globe,
      title: "SMS-First Communication",
      description:
        "Reach your congregation instantly with bulk SMS for announcements, reminders, and pastoral care.",
    },
  ];

  const pricing = {
    monthly: [
      {
        name: "Fellowship",
        price: 2999,
        features: [
          "Up to 100 Members",
          "Basic Member Records",
          "Cell Group Management",
          "SMS Notifications (500/month)",
          "Email Support",
        ],
        popular: false,
      },
      {
        name: "Parish",
        price: 5999,
        features: [
          "Up to 500 Members",
          "Full Member Management",
          "Offering & Tithe Tracking",
          "M-Pesa Integration",
          "SMS Notifications (2,000/month)",
          "Event Management",
          "Priority Support",
        ],
        popular: true,
      },
      {
        name: " Diocese",
        price: 14999,
        features: [
          "Unlimited Members",
          "Multi-Campus Support",
          "Advanced Analytics",
          "Custom Branding",
          "Unlimited SMS",
          "API Access",
          "Dedicated Account Manager",
        ],
        popular: false,
      },
    ],
    yearly: [
      {
        name: "Fellowship",
        price: 29990,
        features: [
          "Up to 100 Members",
          "Basic Member Records",
          "Cell Group Management",
          "SMS Notifications (6,000/year)",
          "Email Support",
          "2 Months Free",
        ],
        popular: false,
      },
      {
        name: "Parish",
        price: 59990,
        features: [
          "Up to 500 Members",
          "Full Member Management",
          "Offering & Tithe Tracking",
          "M-Pesa Integration",
          "SMS Notifications (24,000/year)",
          "Event Management",
          "Priority Support",
          "2 Months Free",
        ],
        popular: true,
      },
      {
        name: " Diocese",
        price: 149990,
        features: [
          "Unlimited Members",
          "Multi-Campus Support",
          "Advanced Analytics",
          "Custom Branding",
          "Unlimited SMS",
          "API Access",
          "Dedicated Account Manager",
          "2 Months Free",
        ],
        popular: false,
      },
    ],
  };

  const testimonials = [
    {
      text: "Hopewell ChMS transformed how we manage our cell groups in Nairobi. The M-Pesa integration for tithes has increased our collection efficiency by 40%. Our pastors can now focus on ministry instead of paperwork.",
      author: "Pastor David Waweru",
      role: "Senior Pastor, Ruiru Gospel Church",
      avatar: "DW",
    },
    {
      text: "The SMS notification feature is a game-changer! We can instantly notify our 3,000+ members about service times, emergencies, and prayer requests. Worth every shilling.",
      author: "Sarah Atieno",
      role: "Church Secretary, Mombasa Pentecostal",
      avatar: "SA",
    },
    {
      text: "As a growing church with multiple cell groups across Kisumu, this system keeps us connected. The cell group management and attendance tracking have strengthened our discipleship program.",
      author: "Rev. Joseph Otieno",
      role: "Bishop, Living Faith Church Kisumu",
      avatar: "JO",
    },
    {
      text: "The youth ministry module helped us engage our young people effectively. We've seen increased participation in our programs since implementing Hopewell ChMS.",
      author: "Grace Wanjiku",
      role: "Youth Pastor, Nairobi Baptist Church",
      avatar: "GW",
      avatarGender: "female",
    },
  ];

  const stats = [
    { number: "500+", label: "Churches" },
    { number: "50K+", label: "Members" },
    { number: "KES 200M+", label: "Processed" },
    { number: "1M+", label: "SMS Sent" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white overflow-x-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn" />
          
          {/* Modal Content */}
          <div 
            className={`relative bg-gradient-to-b from-[#1a1f35] to-[#0A0F1E] border border-[#C9A87C]/30 rounded-2xl p-8 max-w-2xl w-full mx-4 ${
              modalType === "video" 
                ? "animate-slideInRight" 
                : "animate-scaleIn"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A87C]/20 transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>

            {modalType === "video" && (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#C9A87C] to-[#9B7B4C] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Play className="w-8 h-8 text-[#0A0F1E] ml-1" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#C9A87C]">
                  Watch Hopewell ChMS Demo
                </h3>
                <p className="text-white/70 mb-6">
                  See how Kenyan churches are transforming their ministry operations with our comprehensive management system.
                </p>
                <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center border border-white/10">
                  <p className="text-white/50">Video player placeholder</p>
                </div>
              </div>
            )}

            {modalType === "demo" && (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-[#C9A87C]">
                  Schedule a Free Demo
                </h3>
                <p className="text-white/70 mb-6">
                  Our team will walk you through how Hopewell ChMS can transform your church operations.
                </p>
                <form className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Church Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C9A87C] focus:outline-none transition-colors"
                      placeholder="Your Church Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C9A87C] focus:outline-none transition-colors"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C9A87C] focus:outline-none transition-colors"
                      placeholder="pastor@church.co.ke"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-[#C9A87C] to-[#9B7B4C] text-[#0A0F1E] hover:opacity-90 rounded-lg py-6 font-semibold">
                    Request Demo
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0F1E]/95 backdrop-blur-md border-b border-[#C9A87C]/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C9A87C] to-[#9B7B4C] rounded-xl flex items-center justify-center transform group-hover:rotate-0 rotate-12 transition-transform duration-300">
              <Cross className="w-5 h-5 text-[#0A0F1E] -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-bold font-serif">Hopewell ChMS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-[#C9A87C] transition-colors duration-200">
              Features
            </a>
            <a href="#pricing" className="text-white/80 hover:text-[#C9A87C] transition-colors duration-200">
              Pricing
            </a>
            <a href="#testimonials" className="text-white/80 hover:text-[#C9A87C] transition-colors duration-200">
              Testimonials
            </a>
            <a href="#contact" className="text-white/80 hover:text-[#C9A87C] transition-colors duration-200">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-[#C9A87C] text-[#C9A87C] hover:bg-[#C9A87C] hover:text-[#0A0F1E] rounded-full px-6 transition-all duration-200">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-[#C9A87C] to-[#9B7B4C] text-[#0A0F1E] hover:opacity-90 rounded-full px-6 font-semibold transition-all duration-200 hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 md:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A87C]/10 border border-[#C9A87C]/20">
                <Sparkles className="w-4 h-4 text-[#C9A87C]" />
                <span className="text-[#C9A87C] text-sm font-medium">
                  Trusted by 500+ Churches Across Kenya
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight">
                Church Management{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#E5D4A1]">
                  Made Simple
                </span>
                for Kenya
              </h1>

              <p className="text-xl text-white/70 max-w-xl leading-relaxed">
                Manage members, track offerings with M-Pesa, coordinate cell groups, 
                and send SMS notifications—all in one powerful platform designed 
                specifically for Kenyan churches.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#C9A87C] to-[#9B7B4C] text-[#0A0F1E] hover:opacity-90 rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#C9A87C]/30"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#C9A87C]/50 text-[#C9A87C] hover:bg-[#C9A87C]/10 rounded-full px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                  onClick={() => openModal("video")}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <p className="text-white/50 text-sm">
                ✓ 14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 z-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#C9A87C]/50 transition-all duration-300 hover:transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-[#C9A87C] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#C9A87C]/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-[#C9A87C] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-[#05070F]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Powerful{" "}
              <span className="text-[#C9A87C]">Features</span> for Kenyan Churches
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Everything you need to manage your church effectively, built with 
              Kenyan churches in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#C9A87C]/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-[#C9A87C]/10"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#C9A87C]/20 to-[#9B7B4C]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-[#C9A87C]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why" className="relative py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
                  Why Kenyan Churches{" "}
                  <span className="text-[#C9A87C]">Choose Hopewell</span>
                </h2>
                <p className="text-white/60 text-lg">
                  We understand the unique challenges facing churches in Kenya. 
                  Our platform is built to help you focus on what matters most— 
                  making disciples and growing the kingdom.
                </p>
              </div>

              <div className="space-y-6">
                {whyChooseUs.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="w-12 h-12 bg-[#C9A87C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[#C9A87C]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-white/60">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 border border-[#C9A87C]/20 rounded-full animate-pulse" />
                <div className="absolute inset-8 border border-[#C9A87C]/30 rounded-full" />
                <div className="absolute inset-16 border border-[#C9A87C]/40 rounded-full" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#C9A87C] to-[#9B7B4C] rounded-2xl flex items-center justify-center transform rotate-12 animate-float">
                  <Cross className="w-16 h-16 text-[#0A0F1E]" />
                </div>

                <div className="absolute top-8 left-8 w-16 h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center animate-float-delayed">
                  <Smartphone className="w-8 h-8 text-[#C9A87C]" />
                </div>
                <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center animate-float">
                  <Wallet className="w-8 h-8 text-[#C9A87C]" />
                </div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center animate-float-delayed">
                  <MessageSquare className="w-8 h-8 text-[#C9A87C]" />
                </div>
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center animate-float">
                  <Users className="w-8 h-8 text-[#C9A87C]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 bg-[#05070F]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Simple,{" "}
              <span className="text-[#C9A87C]">Affordable</span> Pricing
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Choose the plan that fits your church size and budget. All prices in Kenyan Shillings.
            </p>

            <div className="inline-flex items-center bg-white/5 rounded-full p-1">
              <button
                onClick={() => setPricingPeriod("monthly")}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  pricingPeriod === "monthly"
                    ? "bg-[#C9A87C] text-[#0A0F1E]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingPeriod("yearly")}
                className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                  pricingPeriod === "yearly"
                    ? "bg-[#C9A87C] text-[#0A0F1E]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Yearly
                <span className="text-xs bg-[#9B7B4C] text-white px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing[pricingPeriod].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white/5 border rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  plan.popular
                    ? "border-[#C9A87C] bg-[#C9A87C]/5"
                    : "border-white/10 hover:border-[#C9A87C]/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C9A87C] to-[#9B7B4C] text-[#0A0F1E] px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#C9A87C]">
                    KES {plan.price.toLocaleString()}
                  </span>
                  <span className="text-white/60">
                    /{pricingPeriod === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70">
                      <CheckCircle className="w-5 h-5 text-[#C9A87C] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-full py-6 transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#C9A87C] to-[#9B7B4C] text-[#0A0F1E] hover:opacity-90"
                      : "border border-[#C9A87C] text-[#C9A87C] hover:bg-[#C9A87C] hover:text-[#0A0F1E]"
                  }`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              What Kenyan{" "}
              <span className="text-[#C9A87C]">Church Leaders</span> Say
            </h2>
            <p className="text-white/60 text-lg">
              Trusted by churches across Kenya
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-[#C9A87C]/20 rounded-full flex items-center justify-center">
                <span className="text-[#C9A87C] text-2xl">"</span>
              </div>

              <div className="text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C9A87C] text-[#C9A87C]" />
                  ))}
                </div>

                <p className="text-xl md:text-2xl leading-relaxed mb-8 italic">
                  "{testimonials[activeTestimonial].text}"
                </p>

                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#C9A87C] to-[#9B7B4C] rounded-full flex items-center justify-center mx-auto mb-3 text-[#0A0F1E] font-bold text-xl">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="font-semibold text-[#C9A87C] text-lg">
                    {testimonials[activeTestimonial].author}
                  </div>
                  <div className="text-white/60">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() =>
                    setActiveTestimonial(
                      (prev) => (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C9A87C] hover:text-[#C9A87C] transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                  }
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C9A87C] hover:text-[#C9A87C] transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === activeTestimonial
                      ? "w-8 bg-[#C9A87C]"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A87C]/10 to-[#9B7B4C]/10" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              Ready to Transform Your{" "}
              <span className="text-[#C9A87C]">Church</span>?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Join 500+ Kenyan churches already using Hopewell ChMS to 
              streamline operations and grow their ministry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#C9A87C] to-[#9B7B4C] text-[#0A0F1E] hover:opacity-90 rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#C9A87C]/30"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg transition-all duration-300"
                onClick={() => openModal("demo")}
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-[#05070F] border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C9A87C] to-[#9B7B4C] rounded-xl flex items-center justify-center">
                  <Cross className="w-5 h-5 text-[#0A0F1E]" />
                </div>
                <span className="text-xl font-bold font-serif">Hopewell ChMS</span>
              </Link>
              <p className="text-white/60 mb-6">
                Empowering Kenyan churches with modern technology for effective ministry management.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C9A87C] hover:text-[#0A0F1E] transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C9A87C] hover:text-[#0A0F1E] transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.32,6.44a.5.5,0,0,0-.2-.87l-.79-.2A.5.5,0,0,1,22,4.67l.44-.89a.5.5,0,0,0-.58-.7l-2,.56a.5.5,0,0,1-.44-.08,5,5,0,0,0-2.9-1.7.5.5,0,0,0-.52.23l-.69,1.38a.5.5,0,0,1-.45.31,3.52,3.52,0,0,0-2.5-1,.5.5,0,0,0-.17.94l1.12.57a.5.5,0,0,1,.25.68l-.54,1a.5.5,0,0,0,.26.65,8.37,8.37,0,0,0,3.4.74.5.5,0,0,0,.47-.33l.68-2.75a.5.5,0,0,1,.64-.32l2.1.53a.5.5,0,0,0,.4-.2l1.74-2.56A.5.5,0,0,0,23.32,6.44Z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C9A87C] hover:text-[#0A0F1E] transition-colors duration-200">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[#C9A87C] font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-white/60 hover:text-[#C9A87C] transition-colors duration-200">Home</a></li>
                <li><a href="#features" className="text-white/60 hover:text-[#C9A87C] transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" className="text-white/60 hover:text-[#C9A87C] transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#C9A87C] transition-colors duration-200">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#C9A87C] font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/60">
                  <Phone className="w-5 h-5 text-[#C9A87C]" />
                  +254 700 123 456
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <Mail className="w-5 h-5 text-[#C9A87C]" />
                  info@hopewellchms.co.ke
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-5 h-5 text-[#C9A87C]" />
                  Nairobi, Kenya
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#C9A87C] font-semibold mb-4">Features</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/60">
                  <Users className="w-5 h-5 text-[#C9A87C]" />
                  Cell Group Management
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <Wallet className="w-5 h-5 text-[#C9A87C]" />
                  M-Pesa Integration
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <MessageSquare className="w-5 h-5 text-[#C9A87C]" />
                  Bulk SMS
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <Calendar className="w-5 h-5 text-[#C9A87C]" />
                  Event Management
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/40">
              © 2026 Hopewell ChMS. All rights reserved. Built for the Kenyan Church.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; animation-delay: 2s; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
}
