export interface Dataset {
  id?: string;
  name: string;
  format: string;
  rows: string;
  cols: number;
  size: string;
  healthScore: number;
  missingPct: number;
  problemType: string;
  status: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  target?: string;
}

export const datasets: Dataset[] = [
  {
    id: 'ds-007',
    name: 'sensor_iot_telemetry_june.parquet',
    format: 'Parquet',
    rows: '5,760,000',
    cols: 18,
    size: '1.2 GB',
    healthScore: 79,
    missingPct: 6.8,
    problemType: 'Time Series',
    status: 'Ready',
    version: 'v1',
    uploadedBy: 'James Okonkwo',
    uploadedAt: '2026-06-23 08:30',
    target: 'anomaly_flag',
  },
  {
    id: 'ds-008',
    name: 'sales_forecast_q1_2026.csv',
    format: 'CSV',
    rows: '128,400',
    cols: 22,
    size: '18.4 MB',
    healthScore: 78,
    missingPct: 7.3,
    problemType: 'Regression',
    status: 'Ready',
    version: 'v2',
    uploadedBy: 'Marcus Kim',
    uploadedAt: '2026-06-22 12:14',
    target: 'sales_amount',
  },
  {
    id: 'ds-009',
    name: 'medical_claims_2025.csv',
    format: 'CSV',
    rows: '320,000',
    cols: 52,
    size: '94.7 MB',
    healthScore: 55,
    missingPct: 21.6,
    problemType: 'Classification',
    status: 'Error',
    version: 'v1',
    uploadedBy: 'Aiko Tanaka',
    uploadedAt: '2026-06-21 17:40',
    target: 'claim_approved',
  },
  {
    id: 'ds-010',
    name: 'nlp_support_tickets.json',
    format: 'JSON',
    rows: '87,200',
    cols: 9,
    size: '22.1 MB',
    healthScore: 92,
    missingPct: 0.8,
    problemType: 'Classification',
    status: 'Ready',
    version: 'v3',
    uploadedBy: 'Dr. Priya Nair',
    uploadedAt: '2026-06-20 10:22',
    target: 'category',
  },
  {
    id: 'ds-011',
    name: 'ecommerce_clickstream_may.parquet',
    format: 'Parquet',
    rows: '9,200,000',
    cols: 34,
    size: '2.1 GB',
    healthScore: 83,
    missingPct: 5.2,
    problemType: 'Clustering',
    status: 'Archived',
    version: 'v2',
    uploadedBy: 'James Okonkwo',
    uploadedAt: '2026-06-18 09:05',
  },
  {
    id: 'ds-012',
    name: 'credit_scoring_bureau.xlsx',
    format: 'XLSX',
    rows: '43,500',
    cols: 41,
    size: '15.8 MB',
    healthScore: 87,
    missingPct: 4.1,
    problemType: 'Classification',
    status: 'Ready',
    version: 'v1',
    uploadedBy: 'Marcus Kim',
    uploadedAt: '2026-06-17 14:48',
    target: 'default_risk',
  },
];