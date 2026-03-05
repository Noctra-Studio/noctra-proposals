-- Tabla de propuestas
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'changes_requested', 'rejected', 'cancelled')),

  -- Datos del cliente
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT,
  client_phone TEXT,

  -- Datos del proyecto
  project_name TEXT NOT NULL,
  project_description TEXT,

  -- Servicios (array JSON)
  services JSONB NOT NULL DEFAULT '[]',

  -- Financiero
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  subtotal_after_discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  iva_percentage NUMERIC(5,2) NOT NULL DEFAULT 16,
  iva_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Condiciones
  payment_terms TEXT,
  delivery_weeks INTEGER,
  valid_until DATE,
  notes TEXT,

  -- Respuesta del cliente
  client_response TEXT CHECK (client_response IN ('accepted', 'changes_requested', 'rejected')),
  client_comments TEXT,
  client_responded_at TIMESTAMPTZ,

  -- Control
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de contratos
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),

  -- Datos legales
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_rfc TEXT,
  client_address TEXT,

  -- Proyecto
  project_name TEXT NOT NULL,
  services JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(12,2) NOT NULL,

  -- Pagos
  payment_schedule JSONB NOT NULL DEFAULT '[]',

  -- Tiempos
  estimated_weeks INTEGER NOT NULL,
  buffer_weeks INTEGER NOT NULL DEFAULT 1,
  total_weeks INTEGER GENERATED ALWAYS AS (estimated_weeks + buffer_weeks) STORED,
  start_date DATE,
  estimated_end_date DATE,

  -- Firma
  signed_at TIMESTAMPTZ,
  client_signed_name TEXT,

  -- Control
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de historial de cambios
CREATE TABLE proposal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_history ENABLE ROW LEVEL SECURITY;

-- Las propuestas son visibles públicamente por slug (solo lectura)
CREATE POLICY "Public read by slug" ON proposals FOR SELECT USING (true);

-- Solo service role puede escribir (desde API routes con SUPABASE_SERVICE_ROLE_KEY)
-- El dashboard usa service role, no exponer a usuarios

-- Función para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
