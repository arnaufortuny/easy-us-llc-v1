import { useState } from "react";
import { Check, AlertCircle, Lightbulb, ArrowRight, Clock, DollarSign, Shield } from "@/components/icons";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, viewportOnce, transitions } from "@/lib/animations";
import { getFormationPriceFormatted, getMaintenancePriceFormatted } from "@shared/config/pricing";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface StateConfig {
  key: "newMexico" | "wyoming" | "delaware";
  name: string;
  badge: string;
  formationPrice: string;
  maintenancePrice: string;
  processingTime: string;
}

export function StateComparison() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const states: StateConfig[] = [
    {
      key: "newMexico",
      name: "New Mexico",
      badge: t("stateComparison.popular"),
      formationPrice: getFormationPriceFormatted("newMexico"),
      maintenancePrice: getMaintenancePriceFormatted("newMexico"),
      processingTime: "2-3 " + t("stateComparison.days"),
    },
    {
      key: "wyoming",
      name: "Wyoming",
      badge: t("stateComparison.premium"),
      formationPrice: getFormationPriceFormatted("wyoming"),
      maintenancePrice: getMaintenancePriceFormatted("wyoming"),
      processingTime: "2-3 " + t("stateComparison.days"),
    },
    {
      key: "delaware",
      name: "Delaware",
      badge: t("stateComparison.startups"),
      formationPrice: getFormationPriceFormatted("delaware"),
      maintenancePrice: getMaintenancePriceFormatted("delaware"),
      processingTime: "3-5 " + t("stateComparison.days"),
    },
  ];

  const active = states[activeIndex];
  const pros = t(`stateComparison.${active.key}.pros`, { returnObjects: true }) as string[];
  const cons = t(`stateComparison.${active.key}.cons`, { returnObjects: true }) as string[];
  const idealIf = t(`stateComparison.${active.key}.idealIf`);
  const tagline = t(`stateComparison.${active.key}.tagline`);

  return (
    <section className="py-16 sm:py-24 bg-background" id="state-comparison">
      <div className="w-full px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center justify-center">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-center leading-[1.1]"
            style={{ fontWeight: 900 }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <span className="text-foreground">{t("stateComparison.title")}</span><br/>
            <span className="text-foreground">{t("stateComparison.titleLine2")}</span><br/>
            <span className="text-accent">{t("stateComparison.titleHighlight")}</span><br/>
            <span className="text-accent">{t("stateComparison.titleHighlight2")}</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base sm:text-lg mt-4 text-center max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={transitions.fast}
          >
            {t("stateComparison.subtitle")}
          </motion.p>
          <motion.div 
            className="w-24 h-1 bg-accent mt-6 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 p-1.5 bg-accent/8 dark:bg-accent/10 border border-accent/20 rounded-full mb-8 sm:mb-10 max-w-xl mx-auto" data-testid="state-selector-tabs">
            {states.map((state, index) => (
              <button
                key={state.key}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-full text-sm font-black tracking-tight transition-all duration-200 ${
                  activeIndex === index
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "text-muted-foreground"
                }`}
                data-testid={`button-select-${state.key}`}
              >
                <span>{state.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeIndex === index
                    ? "bg-white/20 text-white"
                    : "bg-transparent text-muted-foreground/60"
                }`}>
                  {state.badge}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
                <div className="bg-accent/5 dark:bg-accent/10 border border-accent/15 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center gap-1" data-testid={`card-formation-price-${active.key}`}>
                  <DollarSign className="w-4 h-4 text-accent mb-0.5" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-bold">{t("stateComparison.features.formationPrice")}</p>
                  <p className="text-xl sm:text-2xl font-black text-accent tracking-tight">{active.formationPrice}</p>
                </div>

                <div className="bg-accent/5 dark:bg-accent/10 border border-accent/15 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center gap-1" data-testid={`card-maintenance-price-${active.key}`}>
                  <Shield className="w-4 h-4 text-accent mb-0.5" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-bold">{t("stateComparison.features.maintenancePrice")}</p>
                  <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{active.maintenancePrice}</p>
                  <p className="text-[10px] text-muted-foreground">/ {t("stateComparison.perYear", "año")}</p>
                </div>

                <div className="bg-accent/5 dark:bg-accent/10 border border-accent/15 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center gap-1" data-testid={`card-processing-time-${active.key}`}>
                  <Clock className="w-4 h-4 text-accent mb-0.5" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-bold">{t("stateComparison.features.processingTime")}</p>
                  <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{active.processingTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                <div className="border border-accent/15 rounded-2xl p-5" data-testid={`card-advantages-${active.key}`}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <h4 className="font-black text-base text-foreground tracking-tight">{t("stateComparison.pros")}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pros.map((pro, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-accent/5 dark:bg-accent/10 rounded-full px-3 py-1.5" data-testid={`text-advantage-${active.key}-${idx}`}>
                        <Check className="w-3 h-3 text-accent flex-shrink-0" />
                        {pro}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-orange-200 dark:border-orange-800/30 rounded-2xl p-5" data-testid={`card-considerations-${active.key}`}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h4 className="font-black text-base text-foreground tracking-tight">{t("stateComparison.cons")}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cons.map((con, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-orange-50 dark:bg-orange-900/10 rounded-full px-3 py-1.5" data-testid={`text-consideration-${active.key}-${idx}`}>
                        <AlertCircle className="w-3 h-3 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                        {con}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-accent/5 dark:bg-accent/10 border border-accent/20 rounded-2xl p-5" data-testid={`card-ideal-${active.key}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-accent" />
                    </div>
                    <h4 className="font-black text-base text-foreground tracking-tight sm:hidden">{t("stateComparison.idealIf")}</h4>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-base text-foreground tracking-tight mb-1.5 hidden sm:block">{t("stateComparison.idealIf")}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{idealIf}</p>
                    <p className="text-sm sm:text-base font-black text-accent mt-2 tracking-tight">{tagline}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="text-center text-lg sm:text-xl text-foreground mt-10 max-w-3xl mx-auto font-black tracking-tight"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 0.4 }}
        >
          {t("stateComparison.humanMessage")}
        </motion.p>

        <motion.div 
          className="flex flex-row items-center justify-center gap-3 sm:gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.5 }}
        >
          <Link href="/llc/formation">
            <Button 
              className="bg-accent hover:bg-accent/90 text-primary font-black text-sm sm:text-base rounded-full px-5 sm:px-8 h-10 sm:h-11 shadow-lg shadow-accent/20 transition-all transform active:scale-95"
              data-testid="button-im-ready"
            >
              {t("stateComparison.imReady")}
              <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
            </Button>
          </Link>
          <Link href="/servicios#state-comparison">
            <Button 
              variant="outline"
              className="font-black text-sm sm:text-base rounded-full px-5 sm:px-8 h-10 sm:h-11 border-2 transition-all transform active:scale-95"
              data-testid="button-need-help"
            >
              {t("stateComparison.needHelp")}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
