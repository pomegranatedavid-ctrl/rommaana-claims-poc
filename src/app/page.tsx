"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, FileText, Globe } from "lucide-react";
import { useTranslation } from "@/context/language-context";

export default function Home() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#be123c] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-[#be123c]">Rommaana</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-[#be123c]">{t("common.products") || "Products"}</a>
            <a href="#" className="hover:text-[#be123c]">{t("common.claims") || "Claims"}</a>
            <a href="#" className="hover:text-[#be123c]">{t("common.about") || "About Us"}</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-slate-600 font-bold"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>
            <Link href="/login">
              <Button variant="ghost">{t("common.login") || "Log In"}</Button>
            </Link>
            <Link href="/login">
              <Button>{t("common.get_started") || "Get Started"}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-white to-slate-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {t("hero.title_part1") || "Insurance Claims,"} <span className="text-[#be123c]">{t("hero.title_part2") || "Reimagined."}</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              {t("hero.description") || "Experience the future of Saudi insurance. Report accidents, get instant AI assessments, and receive settlements in minutes, not days."}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/claims/new">
                <Button size="lg" className="rounded-full px-8 text-lg h-12">
                  {t("hero.cta") || "File a Claim Now"}
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-12">
                {t("hero.learn_more") || "Learn More"}
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="w-10 h-10 text-amber-500" />}
                title="Instant AI Service"
                description="Our Claims Agents analyze damage in seconds using advanced computer vision."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-10 h-10 text-[#be123c]" />}
                title="IA Compliant"
                description="Fully regulated by the Saudi Insurance Authority. Your rights are protected."
              />
              <FeatureCard
                icon={<FileText className="w-10 h-10 text-emerald-500" />}
                title="Paperless Process"
                description="No more forms. Just chat with us and upload photos. We handle the rest."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Rummanat alTaqniyat. Riyadh, Saudi Arabia. CR: 7050190359 </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
