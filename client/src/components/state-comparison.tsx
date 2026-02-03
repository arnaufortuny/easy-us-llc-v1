import { Check, X, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeInUp, viewportOnce, transitions } from "@/lib/animations";
import { getFormationPriceFormatted, getMaintenancePriceFormatted } from "@shared/config/pricing";

interface ComparisonRow {
  feature: string;
  newMexico: string | boolean;
  wyoming: string | boolean;
  delaware: string | boolean;
  tooltip?: string;
}

export function StateComparison() {
  const { t } = useTranslation();

  const comparisonData: ComparisonRow[] = [
    {
      feature: t("stateComparison.features.formationPrice"),
      newMexico: getFormationPriceFormatted("newMexico"),
      wyoming: getFormationPriceFormatted("wyoming"),
      delaware: getFormationPriceFormatted("delaware"),
    },
    {
      feature: t("stateComparison.features.maintenancePrice"),
      newMexico: getMaintenancePriceFormatted("newMexico"),
      wyoming: getMaintenancePriceFormatted("wyoming"),
      delaware: getMaintenancePriceFormatted("delaware"),
    },
    {
      feature: t("stateComparison.features.processingTime"),
      newMexico: "2-3 " + t("stateComparison.days"),
      wyoming: "2-3 " + t("stateComparison.days"),
      delaware: "3-5 " + t("stateComparison.days"),
    },
    {
      feature: t("stateComparison.features.stateFee"),
      newMexico: "$0",
      wyoming: "$100",
      delaware: "$300",
    },
    {
      feature: t("stateComparison.features.annualReport"),
      newMexico: "$0",
      wyoming: "$60",
      delaware: "$300",
    },
    {
      feature: t("stateComparison.features.privacy"),
      newMexico: true,
      wyoming: true,
      delaware: true,
    },
    {
      feature: t("stateComparison.features.noStateTax"),
      newMexico: true,
      wyoming: true,
      delaware: true,
    },
    {
      feature: t("stateComparison.features.idealFor"),
      newMexico: t("stateComparison.idealFor.newMexico"),
      wyoming: t("stateComparison.idealFor.wyoming"),
      delaware: t("stateComparison.idealFor.delaware"),
    },
  ];

  const renderValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-accent mx-auto" />
      ) : (
        <X className="w-5 h-5 text-destructive mx-auto" />
      );
    }
    return <span className="text-foreground font-medium">{value}</span>;
  };

  return (
    <section className="py-12 sm:py-16 bg-muted/30" id="comparador">
      <div className="w-full px-4 sm:px-8">
        <div className="text-center mb-8 sm:mb-12 flex flex-col items-center justify-center">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-center will-change-[transform,opacity]"
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

        <motion.div
          className="max-w-5xl mx-auto overflow-hidden rounded-2xl border border-border bg-background shadow-lg"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-accent/10">
                  <th className="text-left p-4 sm:p-5 font-black text-foreground text-sm sm:text-base">
                    {t("stateComparison.characteristic")}
                  </th>
                  <th className="text-center p-4 sm:p-5 font-black text-foreground text-sm sm:text-base">
                    <div className="flex flex-col items-center gap-1">
                      <span>New Mexico</span>
                      <span className="text-xs font-medium text-accent bg-accent/20 px-2 py-0.5 rounded-full">
                        {t("stateComparison.popular")}
                      </span>
                    </div>
                  </th>
                  <th className="text-center p-4 sm:p-5 font-black text-foreground text-sm sm:text-base">
                    <div className="flex flex-col items-center gap-1">
                      <span>Wyoming</span>
                      <span className="text-xs font-medium text-primary-foreground bg-accent px-2 py-0.5 rounded-full">
                        {t("stateComparison.premium")}
                      </span>
                    </div>
                  </th>
                  <th className="text-center p-4 sm:p-5 font-black text-foreground text-sm sm:text-base">
                    <div className="flex flex-col items-center gap-1">
                      <span>Delaware</span>
                      <span className="text-xs font-medium text-accent bg-accent/20 px-2 py-0.5 rounded-full">
                        {t("stateComparison.startups")}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-t border-border ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                  >
                    <td className="p-4 sm:p-5 text-sm sm:text-base text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        {row.feature}
                        {row.tooltip && (
                          <Info className="w-4 h-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-center text-sm sm:text-base">
                      {renderValue(row.newMexico)}
                    </td>
                    <td className="p-4 sm:p-5 text-center text-sm sm:text-base">
                      {renderValue(row.wyoming)}
                    </td>
                    <td className="p-4 sm:p-5 text-center text-sm sm:text-base">
                      {renderValue(row.delaware)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
