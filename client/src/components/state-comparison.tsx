import { Check, MessageCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeInUp, viewportOnce, transitions } from "@/lib/animations";
import { getFormationPriceFormatted, getMaintenancePriceFormatted } from "@shared/config/pricing";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface StateData {
  name: string;
  badge: string;
  badgeStyle: string;
  formationPrice: string;
  maintenancePrice: string;
  processingTime: string;
  privacy: boolean;
  noStateTax: boolean;
  idealFor: string;
}

export function StateComparison() {
  const { t } = useTranslation();

  const states: StateData[] = [
    {
      name: "New Mexico",
      badge: t("stateComparison.popular"),
      badgeStyle: "bg-accent/20 text-accent",
      formationPrice: getFormationPriceFormatted("newMexico"),
      maintenancePrice: getMaintenancePriceFormatted("newMexico"),
      processingTime: "2-3 " + t("stateComparison.days"),
      privacy: true,
      noStateTax: true,
      idealFor: t("stateComparison.idealFor.newMexico"),
    },
    {
      name: "Wyoming",
      badge: t("stateComparison.premium"),
      badgeStyle: "bg-accent text-primary-foreground",
      formationPrice: getFormationPriceFormatted("wyoming"),
      maintenancePrice: getMaintenancePriceFormatted("wyoming"),
      processingTime: "2-3 " + t("stateComparison.days"),
      privacy: true,
      noStateTax: true,
      idealFor: t("stateComparison.idealFor.wyoming"),
    },
    {
      name: "Delaware",
      badge: t("stateComparison.startups"),
      badgeStyle: "bg-accent/20 text-accent",
      formationPrice: getFormationPriceFormatted("delaware"),
      maintenancePrice: getMaintenancePriceFormatted("delaware"),
      processingTime: "3-5 " + t("stateComparison.days"),
      privacy: true,
      noStateTax: true,
      idealFor: t("stateComparison.idealFor.delaware"),
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-muted/30" id="comparador">
      <div className="w-full px-4 sm:px-8">
        <div className="text-center mb-8 sm:mb-12 flex flex-col items-center justify-center">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-center leading-[1.1] will-change-[transform,opacity]"
            style={{ fontWeight: 900 }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <span className="text-foreground">{t("stateComparison.title")}</span>{" "}
            <span className="text-accent">{t("stateComparison.titleHighlight")}</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base sm:text-lg mt-2 sm:mt-3 text-center max-w-2xl will-change-opacity"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={transitions.fast}
          >
            {t("stateComparison.subtitle")}
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {states.map((state, index) => (
            <motion.div
              key={state.name}
              className="bg-background rounded-2xl border border-border p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-foreground">{state.name}</h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${state.badgeStyle}`}>
                  {state.badge}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{t("stateComparison.features.formationPrice")}</span>
                  <span className="font-bold text-foreground">{state.formationPrice}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{t("stateComparison.features.maintenancePrice")}</span>
                  <span className="font-bold text-foreground">{state.maintenancePrice}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{t("stateComparison.features.processingTime")}</span>
                  <span className="font-medium text-foreground">{state.processingTime}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{t("stateComparison.features.privacy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{t("stateComparison.features.noStateTax")}</span>
                </div>
              </div>

              <div className="bg-accent/10 rounded-xl p-3 text-center">
                <span className="text-xs font-medium text-muted-foreground">{t("stateComparison.features.idealFor")}</span>
                <p className="text-sm font-bold text-foreground mt-1">{state.idealFor}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.2 }}
        >
          <Link href="/llc/formation">
            <Button 
              className="bg-accent hover:bg-accent/90 text-primary font-black text-sm sm:text-base rounded-full px-8 py-6 h-12 shadow-md shadow-accent/20 transition-all transform active:scale-95"
              data-testid="button-im-ready"
            >
              {t("stateComparison.imReady")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a 
            href="https://wa.me/34611047000?text=Hola,%20necesito%20ayuda%20para%20elegir%20el%20estado%20ideal%20para%20mi%20LLC"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-accent hover:bg-accent/90 text-primary font-black text-sm sm:text-base rounded-full px-8 py-6 h-12 shadow-md shadow-accent/20 transition-all transform active:scale-95"
              data-testid="button-need-help"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {t("stateComparison.needHelp")}
            </Button>
          </a>
        </motion.div>

        <motion.p
          className="text-center text-muted-foreground text-xs sm:text-sm mt-6 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 0.3 }}
        >
          {t("stateComparison.disclaimer")}
        </motion.p>
      </div>
    </section>
  );
}
