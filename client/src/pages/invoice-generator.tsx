import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Trash2, Plus, FileDown, Receipt } from "lucide-react";
import { Link } from "wouter";
import jsPDF from "jspdf";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function InvoiceGenerator() {
  const [issuerName, setIssuerName] = useState("");
  const [issuerAddress, setIssuerAddress] = useState("");
  const [issuerEmail, setIssuerEmail] = useState("");
  const [issuerTaxId, setIssuerTaxId] = useState("");
  
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientTaxId, setClientTaxId] = useState("");
  
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [notes, setNotes] = useState("");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId(), description: "", quantity: 1, price: 0 }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const addItem = () => {
    setItems([...items, { id: generateId(), description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "£";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const generatePDF = () => {
    if (!issuerName || !clientName || items.some(i => !i.description)) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFillColor(14, 18, 21);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setTextColor(110, 220, 138);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURA', 20, 30);
      
      doc.setTextColor(247, 247, 245);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`No: ${invoiceNumber || '-'}`, pageWidth - 20, 20, { align: 'right' });
      doc.text(`Fecha: ${formatDate(invoiceDate)}`, pageWidth - 20, 28, { align: 'right' });
      if (dueDate) {
        doc.text(`Vence: ${formatDate(dueDate)}`, pageWidth - 20, 36, { align: 'right' });
      }

      let yPos = 60;
      
      doc.setTextColor(110, 220, 138);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('DE:', 20, yPos);
      
      doc.setTextColor(14, 18, 21);
      doc.setFontSize(11);
      doc.text(issuerName, 20, yPos + 8);
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      let issuerY = yPos + 16;
      if (issuerAddress) {
        const addressLines = doc.splitTextToSize(issuerAddress, 70);
        doc.text(addressLines, 20, issuerY);
        issuerY += addressLines.length * 5;
      }
      if (issuerEmail) { doc.text(issuerEmail, 20, issuerY); issuerY += 5; }
      if (issuerTaxId) { doc.text(`ID Fiscal: ${issuerTaxId}`, 20, issuerY); }

      doc.setTextColor(110, 220, 138);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('PARA:', 110, yPos);
      
      doc.setTextColor(14, 18, 21);
      doc.setFontSize(11);
      doc.text(clientName, 110, yPos + 8);
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      let clientY = yPos + 16;
      if (clientAddress) {
        const addressLines = doc.splitTextToSize(clientAddress, 70);
        doc.text(addressLines, 110, clientY);
        clientY += addressLines.length * 5;
      }
      if (clientEmail) { doc.text(clientEmail, 110, clientY); clientY += 5; }
      if (clientTaxId) { doc.text(`ID Fiscal: ${clientTaxId}`, 110, clientY); }

      yPos = Math.max(issuerY, clientY) + 20;

      doc.setFillColor(247, 247, 245);
      doc.rect(15, yPos, pageWidth - 30, 10, 'F');
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('DESCRIPCION', 20, yPos + 7);
      doc.text('CANT.', 130, yPos + 7);
      doc.text('PRECIO', 150, yPos + 7);
      doc.text('TOTAL', 175, yPos + 7);

      yPos += 15;
      doc.setTextColor(14, 18, 21);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      items.forEach((item) => {
        const total = item.quantity * item.price;
        const descLines = doc.splitTextToSize(item.description, 100);
        doc.text(descLines, 20, yPos);
        doc.text(String(item.quantity), 130, yPos);
        doc.text(`${item.price.toFixed(2)} ${currencySymbol}`, 150, yPos);
        doc.text(`${total.toFixed(2)} ${currencySymbol}`, 175, yPos);
        yPos += Math.max(descLines.length * 5, 8);
      });

      yPos += 5;
      doc.setDrawColor(230, 233, 236);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;

      doc.setFillColor(14, 18, 21);
      doc.rect(130, yPos, 60, 15, 'F');
      doc.setTextColor(247, 247, 245);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL:', 135, yPos + 10);
      doc.text(`${subtotal.toFixed(2)} ${currencySymbol}`, 185, yPos + 10, { align: 'right' });

      if (notes) {
        yPos += 30;
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('NOTAS:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(notes, 100);
        doc.text(noteLines, 20, yPos + 6);
      }

      doc.setTextColor(156, 163, 175);
      doc.setFontSize(7);
      doc.text('Generado con Easy US LLC Invoice Generator', pageWidth / 2, 285, { align: 'center' });

      doc.save(`factura-${invoiceNumber || Date.now()}.pdf`);
      setIsGenerating(false);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-bold text-foreground cursor-pointer">Easy US LLC</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" data-testid="link-dashboard">
              Mi Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Generador de Facturas</h1>
              <p className="text-muted-foreground text-sm">Crea facturas profesionales en segundos</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-accent">Datos del Emisor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="issuerName">Nombre / Empresa *</Label>
                <Input
                  id="issuerName"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  placeholder="Tu nombre o empresa"
                  data-testid="input-issuer-name"
                />
              </div>
              <div>
                <Label htmlFor="issuerAddress">Direccion</Label>
                <Textarea
                  id="issuerAddress"
                  value={issuerAddress}
                  onChange={(e) => setIssuerAddress(e.target.value)}
                  placeholder="Direccion completa"
                  rows={2}
                  data-testid="input-issuer-address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issuerEmail">Email</Label>
                  <Input
                    id="issuerEmail"
                    type="email"
                    value={issuerEmail}
                    onChange={(e) => setIssuerEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                    data-testid="input-issuer-email"
                  />
                </div>
                <div>
                  <Label htmlFor="issuerTaxId">ID Fiscal / NIF</Label>
                  <Input
                    id="issuerTaxId"
                    value={issuerTaxId}
                    onChange={(e) => setIssuerTaxId(e.target.value)}
                    placeholder="12345678A"
                    data-testid="input-issuer-tax-id"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-accent">Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nombre / Empresa *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nombre del cliente"
                  data-testid="input-client-name"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Direccion</Label>
                <Textarea
                  id="clientAddress"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Direccion completa"
                  rows={2}
                  data-testid="input-client-address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                    data-testid="input-client-email"
                  />
                </div>
                <div>
                  <Label htmlFor="clientTaxId">ID Fiscal / NIF</Label>
                  <Input
                    id="clientTaxId"
                    value={clientTaxId}
                    onChange={(e) => setClientTaxId(e.target.value)}
                    placeholder="12345678A"
                    data-testid="input-client-tax-id"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-accent">Detalles de la Factura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">No Factura</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="2024-001"
                  data-testid="input-invoice-number"
                />
              </div>
              <div>
                <Label htmlFor="invoiceDate">Fecha *</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  data-testid="input-invoice-date"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Vencimiento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  data-testid="input-due-date"
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <NativeSelect
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  data-testid="select-currency"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </NativeSelect>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader className="pb-4 flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold text-accent">Conceptos</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              data-testid="button-add-item"
            >
              <Plus className="w-4 h-4 mr-1" />
              Anadir
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-12 sm:col-span-6">
                    {index === 0 && <Label className="text-xs text-muted-foreground">Descripcion *</Label>}
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Descripcion del servicio"
                      data-testid={`input-item-description-${index}`}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    {index === 0 && <Label className="text-xs text-muted-foreground">Cant.</Label>}
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      data-testid={`input-item-quantity-${index}`}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    {index === 0 && <Label className="text-xs text-muted-foreground">Precio ({currencySymbol})</Label>}
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      data-testid={`input-item-price-${index}`}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-item-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-total">
                  {subtotal.toFixed(2)} {currencySymbol}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-accent">Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Condiciones de pago, instrucciones, agradecimientos..."
              rows={3}
              data-testid="input-notes"
            />
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={generatePDF}
            disabled={isGenerating}
            className="px-8"
            data-testid="button-generate-pdf"
          >
            <FileDown className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generando...' : 'Descargar Factura PDF'}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          La factura se genera localmente y no se guarda en ningun servidor.
        </p>
      </main>
    </div>
  );
}
