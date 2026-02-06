import { useTranslation } from "react-i18next";
import { FileText, Calendar, MessageSquare, Wrench, CreditCard, Activity } from "lucide-react";

const features = [
  { icon: Activity, titleKey: "auth.clientArea.feature1Title", descKey: "auth.clientArea.feature1Desc" },
  { icon: FileText, titleKey: "auth.clientArea.feature2Title", descKey: "auth.clientArea.feature2Desc" },
  { icon: Calendar, titleKey: "auth.clientArea.feature3Title", descKey: "auth.clientArea.feature3Desc" },
  { icon: MessageSquare, titleKey: "auth.clientArea.feature4Title", descKey: "auth.clientArea.feature4Desc" },
  { icon: Wrench, titleKey: "auth.clientArea.feature5Title", descKey: "auth.clientArea.feature5Desc" },
  { icon: CreditCard, titleKey: "auth.clientArea.feature6Title", descKey: "auth.clientArea.feature6Desc" },
];

export function ClientAreaPanel() {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex flex-col justify-center px-8 xl:px-12" data-testid="section-client-area-panel">
      <div className="max-w-md">
        <h2 className="text-2xl xl:text-3xl font-black text-foreground tracking-tight mb-2" data-testid="text-client-area-title">
          {t("auth.clientArea.title")}
        </h2>
        <p className="text-sm text-muted-foreground mb-8" data-testid="text-client-area-subtitle">
          {t("auth.clientArea.subtitle")}
        </p>

        <div className="space-y-5">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4" data-testid={`feature-item-${index}`}>
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{t(feature.titleKey)}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t(feature.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
