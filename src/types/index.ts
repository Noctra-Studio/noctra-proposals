export type ProposalStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "changes_requested"
  | "rejected"
  | "cancelled";
export type ClientResponse = "accepted" | "changes_requested" | "rejected";
export type DiscountType = "percentage" | "fixed";
export type ContractStatus = "draft" | "sent" | "signed" | "cancelled";

export interface ServiceItem {
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface PaymentScheduleItem {
  percentage: number;
  amount: number;
  description: string;
  due_date?: string; // ISO 8601 YYYY-MM-DD o equivalente
  paid?: boolean;
}

export interface Proposal {
  id: string; // UUID
  slug: string;
  status: ProposalStatus;

  // Datos del cliente
  client_name: string;
  client_email: string;
  client_company?: string;
  client_phone?: string;

  // Datos del proyecto
  project_name: string;
  project_description?: string;

  // Servicios (array JSON)
  services: ServiceItem[];

  // Financiero
  subtotal: number;
  discount_type?: DiscountType;
  discount_value?: number;
  discount_amount?: number;
  subtotal_after_discount: number;
  iva_percentage: number;
  iva_amount: number;
  total: number;

  // Condiciones
  payment_terms?: string;
  delivery_weeks?: number;
  valid_until?: string; // Date (string format)
  notes?: string;

  // Respuesta del cliente
  client_response?: ClientResponse;
  client_comments?: string;
  client_responded_at?: string; // TIMESTAMPTZ

  // Control
  sent_at?: string; // TIMESTAMPTZ
  created_at?: string; // TIMESTAMPTZ
  updated_at?: string; // TIMESTAMPTZ
}

export interface Contract {
  id: string; // UUID
  proposal_id?: string; // UUID references proposals
  slug: string;
  status: ContractStatus;

  // Datos legales
  client_name: string;
  client_company?: string;
  client_rfc?: string;
  client_address?: string;

  // Proyecto
  project_name: string;
  services: ServiceItem[];
  total: number;

  // Pagos
  payment_schedule: PaymentScheduleItem[];

  // Tiempos
  estimated_weeks: number;
  buffer_weeks: number;
  total_weeks: number; // Generated column
  start_date?: string; // Date
  estimated_end_date?: string; // Date

  // Firma
  signed_at?: string; // TIMESTAMPTZ
  client_signed_name?: string;

  // Control
  sent_at?: string; // TIMESTAMPTZ
  created_at?: string; // TIMESTAMPTZ
  updated_at?: string; // TIMESTAMPTZ
}

export interface ProposalHistory {
  id: string; // UUID
  proposal_id?: string; // UUID
  action: string;
  description?: string;
  created_at?: string; // TIMESTAMPTZ
}
