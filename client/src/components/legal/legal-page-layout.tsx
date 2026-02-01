import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Download, FileText, Calendar } from "lucide-react";

interface LegalPageLayoutProps {
  title: string;
  titleHighlight: string;
  lastUpdated: string;
  pdfUrl?: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, titleHighlight, lastUpdated, pdfUrl, children }: LegalPageLayoutProps) {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = pdfUrl.split('/').pop() || 'documento.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-brand-lime selection:text-brand-dark print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <header className="bg-gradient-to-br from-brand-lime/10 via-brand-lime/5 to-transparent pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 print:pt-4 print:pb-4">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-brand-dark leading-[1.1] mb-4 sm:mb-6 print:text-2xl">
              {title} <span className="text-brand-lime">{titleHighlight}</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{t("legal.documentInfo")}</span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 print:hidden">
              <button 
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-full px-6 sm:px-8 h-11 font-bold text-sm shadow-lg transition-all gap-2 hover-elevate"
                style={{ backgroundColor: '#6EDC8A', color: '#0E1215' }}
                data-testid="button-download-pdf"
              >
                <Download className="w-4 h-4" />
                {t("legal.downloadPdf")}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-8 sm:py-12 lg:py-16 bg-background print:py-2">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 print:px-2">
          <div className="max-w-4xl">
            <div ref={contentRef} className="space-y-8 sm:space-y-10 lg:space-y-12 print:space-y-4">
              {children}
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

interface LegalSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <section className="print:break-inside-avoid">
      <div className="flex items-start gap-4 mb-5 sm:mb-6">
        <div 
          className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center print:w-10 print:h-10"
          style={{ backgroundColor: '#6EDC8A' }}
        >
          <span className="font-black text-base sm:text-lg print:text-sm" style={{ color: '#0E1215' }}>{number}</span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-dark tracking-tight pt-2 sm:pt-3 print:text-lg print:pt-1">
          {title}
        </h2>
      </div>
      <div className="sm:pl-[4.5rem] space-y-4 text-base sm:text-lg text-brand-dark/85 leading-relaxed print:text-sm print:space-y-2 print:pl-0">
        {children}
      </div>
    </section>
  );
}

interface LegalSubSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LegalSubSection({ title, children }: LegalSubSectionProps) {
  return (
    <div className="mt-5 sm:mt-6 print:mt-3">
      <h3 className="text-base sm:text-lg font-bold text-brand-dark mb-2 sm:mb-3 print:text-sm print:mb-2">{title}</h3>
      <div className="space-y-3 print:space-y-1">{children}</div>
    </div>
  );
}

interface LegalListProps {
  items: string[];
  ordered?: boolean;
}

export function LegalList({ items, ordered = false }: LegalListProps) {
  return (
    <ul className="space-y-2 sm:space-y-3 print:space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-lime mt-2.5 sm:mt-3" />
          <span className="text-brand-dark/80">{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface LegalHighlightBoxProps {
  children: React.ReactNode;
  variant?: 'info' | 'dark';
}

export function LegalHighlightBox({ children, variant = 'info' }: LegalHighlightBoxProps) {
  if (variant === 'dark') {
    return (
      <div className="bg-brand-dark text-white rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-10 shadow-lg print:bg-gray-100 print:text-black print:p-4 print:rounded-lg">
        <div className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium print:text-sm">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-lime/5 border border-brand-lime/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 space-y-1 sm:space-y-2 print:p-4 print:rounded-lg print:border">
      <div className="text-sm sm:text-base text-brand-dark/80 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
