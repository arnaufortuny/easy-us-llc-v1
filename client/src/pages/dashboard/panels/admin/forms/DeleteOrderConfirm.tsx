import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "@/components/icons";

interface DeleteOrderConfirmProps {
  deleteOrderConfirm: { open: boolean; order: any };
  deleteOrderMutation: { mutate: (orderId: number) => void; isPending: boolean };
  onClose: () => void;
}

export function DeleteOrderConfirm({ deleteOrderConfirm, deleteOrderMutation, onClose }: DeleteOrderConfirmProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-red-300 dark:border-red-800 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-red-600">{t('dashboard.admin.deleteOrder')}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="py-4">
        <p className="text-sm text-muted-foreground">{t('dashboard.admin.deleteUserConfirm')} <strong>{deleteOrderConfirm.order?.application?.requestCode || deleteOrderConfirm.order?.maintenanceApplication?.requestCode || deleteOrderConfirm.order?.invoiceNumber}</strong>?</p>
        <p className="text-xs text-muted-foreground mt-2">{t('dashboard.admin.deleteOrderClient')}: {deleteOrderConfirm.order?.user?.firstName} {deleteOrderConfirm.order?.user?.lastName}</p>
        <p className="text-xs text-red-500 mt-2">{t('dashboard.admin.deleteOrderWarning')}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button variant="destructive" onClick={() => deleteOrderConfirm.order?.id && deleteOrderMutation.mutate(deleteOrderConfirm.order.id)} disabled={deleteOrderMutation.isPending} className="flex-1 rounded-full font-black" data-testid="button-confirm-delete-order">
          {deleteOrderMutation.isPending ? t('dashboard.admin.deleting') : t('dashboard.admin.deleteOrderBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
