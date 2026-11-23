import {
  BadgeCheck,
  BarChart3,
  ClipboardList,
  Clock,
  FileCheck,
  FileSearch,
  Landmark,
  Receipt,
  RefreshCw,
  Scale,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { CardTunnel, ServicesList, useIsNarrow } from './CardTunnel.jsx';

const SERVICES = [
  {
    no: '01',
    title: 'Eligibility Verification',
    desc: 'Coverage and benefits validation.',
    Icon: ShieldCheck,
  },
  {
    no: '02',
    title: 'Prior Authorization',
    desc: 'Payer requirements and follow-ups.',
    Icon: FileCheck,
  },
  {
    no: '03',
    title: 'Medical Coding Support',
    desc: 'ICD-10, CPT and HCPCS review.',
    Icon: FileSearch,
  },
  {
    no: '04',
    title: 'Charge Entry & Validation',
    desc: 'Charge capture and billing preparation.',
    Icon: ClipboardList,
  },
  {
    no: '05',
    title: 'Claim Submission',
    desc: 'Claim scrubbing and rejection resolution.',
    Icon: Send,
  },
  {
    no: '06',
    title: 'Patient Billing Support',
    desc: 'Statements and billing inquiries.',
    Icon: Receipt,
  },
  {
    no: '07',
    title: 'Denial Management',
    desc: 'Root-cause analysis and appeals.',
    Icon: RefreshCw,
  },
  {
    no: '08',
    title: 'Accounts Receivable Follow-up',
    desc: 'Aging and payer escalation.',
    Icon: Clock,
  },
  {
    no: '09',
    title: 'Payment Posting',
    desc: 'ERA/EOB posting and reconciliation.',
    Icon: Landmark,
  },
  {
    no: '10',
    title: 'Provider Credentialing',
    desc: 'Enrollment and revalidation.',
    Icon: BadgeCheck,
  },
  {
    no: '11',
    title: 'Medical Billing Audits',
    desc: 'Identify claim and workflow gaps.',
    Icon: Scale,
  },
  {
    no: '12',
    title: 'Performance Reporting',
    desc: 'KPI and payer performance visibility.',
    Icon: BarChart3,
  },
];

function TitleBlock() {
  return (
    <>
      <p className="rsv-eyebrow">OUR EXPERTISE</p>
      <h2 id="services-title">Every claim matters.</h2>
    </>
  );
}

export function ServicesShowcase() {
  const narrow = useIsNarrow(899);

  return (
    <div className="rsv-root-inner">
      {narrow ? (
        <ServicesList services={SERVICES} title={<TitleBlock />} />
      ) : (
        <CardTunnel services={SERVICES} title={<TitleBlock />} />
      )}
    </div>
  );
}
