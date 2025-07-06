/*
  # Create sales_records table

  1. New Tables
    - `sales_records`
      - `id` (uuid, primary key)
      - `id_documento` (text) - Document ID
      - `tipo_documento` (text) - Document type
      - `doc_num` (text) - Document number
      - `fec_emis` (date) - Emission date
      - `co_ven` (text) - Vendor code
      - `nombre_vendedor` (text) - Vendor name
      - `co_cond` (text) - Condition code
      - `co_cli` (text) - Client code
      - `nombre_cliente` (text) - Client name
      - `tipo_venta` (text) - Sale type
      - `tasa` (numeric) - Rate
      - `co_sucu_in` (text) - Branch code
      - `nombre_sucursal` (text) - Branch name
      - `co_art` (text) - Article code
      - `des_art` (text) - Article description
      - `total_art` (numeric) - Article total
      - `prec_vta` (numeric) - Sale price
      - `reng_neto` (numeric) - Net line
      - `monto_imp` (numeric) - Tax amount
      - `total_usd` (numeric) - Total USD
      - `marcas_de_vehiculos` (text) - Vehicle brands
      - `fecha_formatted` (text) - Formatted date
      - `dia_semana` (text) - Day of week
      - `numero_semana` (integer) - Week number
      - `mes` (text) - Month
      - `trimestre` (text) - Quarter
      - `semestre` (text) - Semester
      - `created_at` (timestamp) - Creation timestamp

  2. Security
    - Enable RLS on `sales_records` table
    - Add policy for public read access (since using anon key)
    - Add policy for public insert access for data uploads
    - Add policy for public delete access for data management
*/

CREATE TABLE IF NOT EXISTS sales_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_documento text,
  tipo_documento text,
  doc_num text,
  fec_emis date,
  co_ven text,
  nombre_vendedor text,
  co_cond text,
  co_cli text,
  nombre_cliente text,
  tipo_venta text,
  tasa numeric,
  co_sucu_in text,
  nombre_sucursal text,
  co_art text,
  des_art text,
  total_art numeric,
  prec_vta numeric,
  reng_neto numeric,
  monto_imp numeric,
  total_usd numeric,
  marcas_de_vehiculos text,
  fecha_formatted text,
  dia_semana text,
  numero_semana integer,
  mes text,
  trimestre text,
  semestre text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON sales_records
  FOR SELECT
  TO anon
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access"
  ON sales_records
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access"
  ON sales_records
  FOR DELETE
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sales_records_fec_emis ON sales_records(fec_emis);
CREATE INDEX IF NOT EXISTS idx_sales_records_co_ven ON sales_records(co_ven);
CREATE INDEX IF NOT EXISTS idx_sales_records_co_cli ON sales_records(co_cli);
CREATE INDEX IF NOT EXISTS idx_sales_records_created_at ON sales_records(created_at);