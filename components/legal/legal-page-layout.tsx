import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FooterSection } from "@/components/landing/footer-section";
import { BrandLogo } from "@/components/brand-logo";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen">
      {/* Navigation - 与首页保持一致的简洁导航 */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <Link href="/" className="transition-opacity hover:opacity-85">
            <BrandLogo markClassName="h-8 w-8" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Legal content */}
      <article className="max-w-3xl mx-auto px-5 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: {lastUpdated}
        </p>

        <div className="legal-content text-foreground/90 leading-relaxed">
          {children}
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
