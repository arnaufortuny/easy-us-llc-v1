import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { X, Loader2 } from "@/components/icons";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface GenerateInvoiceFormProps {
  generateInvoiceDialog: { open: boolean; order: any };
  orderInvoiceAmount: string;
  setOrderInvoiceAmount: (val: string) => void;
  orderInvoiceCurrency: string;
  setOrderInvoiceCurrency: (val: string) => void;
  isGeneratingInvoice: boolean;
  setIsGeneratingInvoice: (val: boolean) => void;
  setFormMessage: (msg: { type: 'error' | 'success' | 'info'; text: string } | null) => void;
  onClose: () => void;
}

export function GenerateInvoiceForm({ generateInvoiceDialog, orderInvoiceAmount, setOrderInvoiceAmount, orderInvoiceCurrency, setOrderInvoiceCurrency, isGeneratingInvoice, setIsGeneratingInvoice, setFormMessage, onClose }: GenerateInvoiceFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('dashboard.admin.generateInvoice')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.orderLabel')}: {generateInvoiceDialog.order?.application?.requestCode || generateInvoiceDialog.order?.maintenanceApplication?.requestCode || generateInvoiceDialog.order?.invoiceNumber}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.invoiceAmount')}</Label>
          <Input type="number" 
            step="0.01" 
            value={orderInvoiceAmount} 
            onChange={e => setOrderInvoiceAmount(e.target.value)}
            className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" 
            placeholder="899.00"
            data-testid="input-invoice-amount"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.currency')}</Label>
          <NativeSelect 
            value={orderInvoiceCurrency} 
            onValueChange={setOrderInvoiceCurrency}
            className="w-full rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
          >
            <NativeSelectItem value="EUR">EUR (€)</NativeSelectItem>
            <NativeSelectItem value="USD">USD ($)</NativeSelectItem>
          </NativeSelect>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button 
          className="flex-1 bg-accent text-accent-foreground font-black rounded-full"
          disabled={!orderInvoiceAmount || isNaN(parseFloat(orderInvoiceAmount)) || parseFloat(orderInvoiceAmount) <= 0 || isGeneratingInvoice}
          onClick={async () => {
            setIsGeneratingInvoice(true);
            try {
              const amountCents = Math.round(parseFloat(orderInvoiceAmount) * 100);
              if (amountCents <= 0) {
                setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.amountMustBeGreater") });
                return;
              }
              const res = await apiRequest("POST", `/api/admin/orders/${generateInvoiceDialog.order?.id}/generate-invoice`, {
                amount: amountCents,
                currency: orderInvoiceCurrency
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || t("dashboard.toasts.couldNotGenerate"));
              }
              setFormMessage({ type: 'success', text: t("dashboard.toasts.invoiceGenerated") + ". " + t("dashboard.toasts.invoiceGeneratedDesc", { amount: orderInvoiceAmount, currency: orderInvoiceCurrency }) });
              queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
              queryClient.invalidateQueries({ queryKey: ["/api/user/documents"] });
              window.open(`/api/orders/${generateInvoiceDialog.order?.id}/invoice`, '_blank');
              onClose();
              setOrderInvoiceAmount("");
            } catch (err: any) {
              setFormMessage({ type: 'error', text: t("common.error") + ". " + (err.message || t("dashboard.toasts.couldNotGenerate")) });
            } finally {
              setIsGeneratingInvoice(false);
            }
          }}
          data-testid="button-confirm-generate-invoice"
        >
          {isGeneratingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.generateInvoiceBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
