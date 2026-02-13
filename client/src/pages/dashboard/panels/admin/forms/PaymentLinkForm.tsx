import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "@/components/icons";
import { apiRequest } from "@/lib/queryClient";
import { AdminUserData } from "@/components/dashboard";

interface PaymentLinkFormProps {
  paymentLinkDialog: { open: boolean; user: AdminUserData | null };
  paymentLinkUrl: string;
  setPaymentLinkUrl: (val: string) => void;
  paymentLinkAmount: string;
  setPaymentLinkAmount: (val: string) => void;
  paymentLinkMessage: string;
  setPaymentLinkMessage: (val: string) => void;
  isSendingPaymentLink: boolean;
  setIsSendingPaymentLink: (val: boolean) => void;
  setPaymentLinkDialog: (val: { open: boolean; user: AdminUserData | null }) => void;
  setFormMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  onClose: () => void;
}

export function PaymentLinkForm({
  paymentLinkDialog,
  paymentLinkUrl,
  setPaymentLinkUrl,
  paymentLinkAmount,
  setPaymentLinkAmount,
  paymentLinkMessage,
  setPaymentLinkMessage,
  isSendingPaymentLink,
  setIsSendingPaymentLink,
  setPaymentLinkDialog,
  setFormMessage,
  onClose,
}: PaymentLinkFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground">{t('dashboard.admin.sendPaymentLink')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.sendPaymentLinkDesc')} {paymentLinkDialog.user?.firstName} {paymentLinkDialog.user?.lastName}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.paymentLinkUrl')}</Label>
          <Input value={paymentLinkUrl}
            onChange={(e) => setPaymentLinkUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
            data-testid="input-payment-link-url"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.paymentAmount')}</Label>
          <Input value={paymentLinkAmount}
            onChange={(e) => setPaymentLinkAmount(e.target.value)}
            placeholder={t('dashboard.admin.paymentAmountPlaceholder')}
            className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
            data-testid="input-payment-link-amount"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.paymentMessage')}</Label>
          <Textarea value={paymentLinkMessage}
            onChange={(e) => setPaymentLinkMessage(e.target.value)}
            placeholder={t('dashboard.admin.paymentMessagePlaceholder')}
            className="rounded-xl border-border bg-background dark:bg-card"
            rows={3}
            data-testid="input-payment-link-message"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button onClick={async () => {
            if (!paymentLinkUrl || !paymentLinkAmount) {
              setFormMessage({ type: 'error', text: t("form.validation.requiredFields") });
              return;
            }
            setIsSendingPaymentLink(true);
            try {
              await apiRequest("POST", "/api/admin/send-payment-link", {
                userId: paymentLinkDialog.user?.id,
                paymentLink: paymentLinkUrl,
                amount: paymentLinkAmount,
                message: paymentLinkMessage || `Por favor, completa el pago de ${paymentLinkAmount} a través del siguiente enlace.`
              });
              setFormMessage({ type: 'success', text: t("dashboard.toasts.paymentLinkSent") + ". " + t("dashboard.toasts.paymentLinkSentDesc", { email: paymentLinkDialog.user?.email }) });
              setPaymentLinkDialog({ open: false, user: null });
              setPaymentLinkUrl("");
              setPaymentLinkAmount("");
              setPaymentLinkMessage("");
            } catch (err: any) {
              setFormMessage({ type: 'error', text: t("common.error") + ". " + (err.message || t("dashboard.toasts.couldNotSendLink")) });
            } finally {
              setIsSendingPaymentLink(false);
            }
          }}
          disabled={isSendingPaymentLink || !paymentLinkUrl || !paymentLinkAmount}
          className="flex-1 bg-accent text-accent-foreground font-black rounded-full"
          data-testid="button-send-payment-link"
        >
          {isSendingPaymentLink ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.sendPaymentLinkBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
