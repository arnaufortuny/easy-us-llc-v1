import type { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const logActivity = async (title: string, data: any, _req?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[LOG] ${title}:`, data);
  }
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  paid: "Pagado",
  filed: "Presentado",
  documents_ready: "Documentos listos",
  completed: "Completado",
  cancelled: "Cancelado"
};

export const DOC_TYPE_LABELS: Record<string, string> = {
  'articles_of_organization': 'Artículos de Organización',
  'certificate_of_formation': 'Certificado de Formación',
  'boir': 'BOIR',
  'ein_document': 'Documento EIN',
  'operating_agreement': 'Acuerdo Operativo',
  'invoice': 'Factura',
  'passport': 'Pasaporte / DNI',
  'id': 'Documento de Identidad',
  'other': 'Otro Documento'
};

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
