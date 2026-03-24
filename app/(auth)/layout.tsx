import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0F1E] via-[#0F1525] to-[#05070F] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C9A87C]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C9A87C]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      {/* Decorative Crosses */}
      <div className="absolute top-20 left-20 text-[#C9A87C]/10">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2v20M2 12h20" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 text-[#C9A87C]/10">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2v20M2 12h20" strokeLinecap="round" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10 p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wide">Hopewell ChMS</h1>
          <p className="mt-2 text-[#C9A87C]/80">Church Management System</p>
        </div>
        {children}
      </div>
    </div>
  );
}
