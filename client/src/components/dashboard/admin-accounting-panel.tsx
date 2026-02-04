import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Plus, Download, TrendingUp, TrendingDown, DollarSign, Edit, Trash2, Loader2 } from "lucide-react";
import type { AccountingTransaction } from "@shared/schema";

const INCOME_CATEGORIES = ['llc_formation', 'maintenance', 'consultation', 'other_income'];
const EXPENSE_CATEGORIES = ['state_fees', 'registered_agent', 'bank_fees', 'marketing', 'software', 'other_expense'];

export function AdminAccountingPanel() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [periodFilter, setPeriodFilter] = useState<'month' | 'year' | 'all'>('month');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [transactionDialog, setTransactionDialog] = useState<{ open: boolean; transaction: AccountingTransaction | null }>({ open: false, transaction: null });
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    reference: '',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const { data: transactions = [], isLoading: txLoading, refetch: refetchTransactions } = useQuery<AccountingTransaction[]>({
    queryKey: ["/api/admin/accounting/transactions", typeFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter) params.set('type', typeFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await apiRequest("GET", `/api/admin/accounting/transactions?${params.toString()}`);
      return res.json();
    }
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<{
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    categoryBreakdown: { category: string; type: string; total: number }[];
  }>({
    queryKey: ["/api/admin/accounting/summary", periodFilter],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/accounting/summary?period=${periodFilter}`);
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/accounting/transactions", data);
      if (!res.ok) throw new Error("Transaction creation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/summary"] });
      toast({ title: t('dashboard.admin.transactionCreated') || "Transacción creada" });
      setTransactionDialog({ open: false, transaction: null });
      resetForm();
    },
    onError: () => {
      toast({ title: t('common.error'), variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiRequest("PATCH", `/api/admin/accounting/transactions/${id}`, data);
      if (!res.ok) throw new Error("Transaction update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/summary"] });
      toast({ title: t('dashboard.admin.transactionUpdated') || "Transacción actualizada" });
      setTransactionDialog({ open: false, transaction: null });
      resetForm();
    },
    onError: () => {
      toast({ title: t('common.error'), variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/accounting/transactions/${id}`);
      if (!res.ok) throw new Error("Transaction deletion failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/summary"] });
      toast({ title: t('dashboard.admin.transactionDeleted') || "Transacción eliminada" });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      type: 'income',
      category: '',
      amount: '',
      description: '',
      reference: '',
      transactionDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const openEditDialog = (tx: AccountingTransaction) => {
    setFormData({
      type: tx.type as 'income' | 'expense',
      category: tx.category,
      amount: (Math.abs(tx.amount) / 100).toString(),
      description: tx.description || '',
      reference: tx.reference || '',
      transactionDate: tx.transactionDate ? new Date(tx.transactionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: tx.notes || ''
    });
    setTransactionDialog({ open: true, transaction: tx });
  };

  const handleSubmit = () => {
    if (!formData.category || !formData.amount) {
      toast({ title: t('common.requiredFields'), variant: "destructive" });
      return;
    }
    if (transactionDialog.transaction) {
      updateMutation.mutate({ id: transactionDialog.transaction.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set('type', typeFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await apiRequest("GET", `/api/admin/accounting/export-csv?${params.toString()}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transacciones_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "CSV descargado" });
    } catch (err) {
      toast({ title: t('common.error'), variant: "destructive" });
    }
  };

  const getCategoryLabel = (category: string) => {
    return t(`dashboard.admin.categories.${category}`) || category;
  };

  const formatAmount = (cents: number) => {
    return (cents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.totalIncome')}</p>
              <p className="text-xl font-black text-green-600">
                {summaryLoading ? '...' : formatAmount(summary?.totalIncome || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.totalExpenses')}</p>
              <p className="text-xl font-black text-red-600">
                {summaryLoading ? '...' : formatAmount(summary?.totalExpenses || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.netBalance')}</p>
              <p className={`text-xl font-black ${(summary?.netBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summaryLoading ? '...' : formatAmount(summary?.netBalance || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['month', 'year', 'all'] as const).map(p => (
            <Button
              key={p}
              variant={periodFilter === p ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setPeriodFilter(p)}
            >
              {p === 'month' ? t('dashboard.admin.thisMonth') : p === 'year' ? t('dashboard.admin.thisYear') : t('dashboard.admin.allTime')}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={handleExportCSV}
          >
            <Download className="w-3 h-3 mr-1" /> {t('dashboard.admin.exportCSV')}
          </Button>
          <Button
            size="sm"
            className="rounded-full text-xs bg-accent text-accent-foreground"
            onClick={() => {
              resetForm();
              setTransactionDialog({ open: true, transaction: null });
            }}
          >
            <Plus className="w-3 h-3 mr-1" /> {t('dashboard.admin.addTransaction')}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <NativeSelect
          value={typeFilter}
          onValueChange={setTypeFilter}
          className="rounded-xl h-9 text-xs w-32"
        >
          <NativeSelectItem value="">{t('common.all')}</NativeSelectItem>
          <NativeSelectItem value="income">{t('dashboard.admin.income')}</NativeSelectItem>
          <NativeSelectItem value="expense">{t('dashboard.admin.expenses')}</NativeSelectItem>
        </NativeSelect>
        <NativeSelect
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          className="rounded-xl h-9 text-xs w-40"
        >
          <NativeSelectItem value="">{t('dashboard.admin.allCategories')}</NativeSelectItem>
          {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map(cat => (
            <NativeSelectItem key={cat} value={cat}>{getCategoryLabel(cat)}</NativeSelectItem>
          ))}
        </NativeSelect>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
        <div className="divide-y">
          {txLoading ? (
            <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t('dashboard.admin.noTransactions')}</p>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {tx.type === 'income' ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-black text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : ''}{formatAmount(tx.amount)}
                      </span>
                      <Badge variant="outline" className="text-[9px]">{getCategoryLabel(tx.category)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{tx.description || '-'}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {tx.transactionDate && new Date(tx.transactionDate).toLocaleDateString('es-ES')}
                      {tx.reference && ` | ${tx.reference}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => openEditDialog(tx)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-red-600"
                    onClick={() => {
                      if (confirm('¿Eliminar esta transacción?')) {
                        deleteMutation.mutate(tx.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Sheet open={transactionDialog.open} onOpenChange={(open) => setTransactionDialog({ open, transaction: open ? transactionDialog.transaction : null })}>
        <SheetContent side="right" className="bg-white dark:bg-card w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-xl font-semibold">
              {transactionDialog.transaction ? t('dashboard.admin.editTransaction') : t('dashboard.admin.addTransaction')}
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              {transactionDialog.transaction ? 'Modifica los datos' : 'Añade un ingreso o gasto'}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pb-20">
            <div>
              <Label className="text-sm font-semibold mb-2 block">{t('dashboard.admin.transactionType')}</Label>
              <NativeSelect
                value={formData.type}
                onValueChange={(val) => setFormData(p => ({ ...p, type: val as 'income' | 'expense', category: '' }))}
                className="w-full rounded-xl h-11"
              >
                <NativeSelectItem value="income">{t('dashboard.admin.income')}</NativeSelectItem>
                <NativeSelectItem value="expense">{t('dashboard.admin.expenses')}</NativeSelectItem>
              </NativeSelect>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">{t('dashboard.admin.category')}</Label>
              <NativeSelect
                value={formData.category}
                onValueChange={(val) => setFormData(p => ({ ...p, category: val }))}
                className="w-full rounded-xl h-11"
              >
                <NativeSelectItem value="">{t('dashboard.admin.selectCategory') || 'Seleccionar...'}</NativeSelectItem>
                {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                  <NativeSelectItem key={cat} value={cat}>{getCategoryLabel(cat)}</NativeSelectItem>
                ))}
              </NativeSelect>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">{t('dashboard.admin.amount')} (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
                className="rounded-xl h-11"
                placeholder="0.00"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">{t('dashboard.admin.transactionDate')}</Label>
              <Input
                type="date"
                value={formData.transactionDate}
                onChange={(e) => setFormData(p => ({ ...p, transactionDate: e.target.value }))}
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">{t('dashboard.admin.description')}</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                className="rounded-xl h-11"
                placeholder="Descripción breve..."
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Referencia</Label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData(p => ({ ...p, reference: e.target.value }))}
                className="rounded-xl h-11"
                placeholder="Nº factura, recibo, etc."
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Notas</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full bg-accent text-accent-foreground font-semibold rounded-full"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setTransactionDialog({ open: false, transaction: null })}
              className="w-full rounded-full"
            >
              {t('common.cancel')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
