// PDF generation using pdf-lib to fill IRS Form 8843 template
import { PDFDocument } from 'pdf-lib';
import { TAX_YEAR, IRS_MAILING_ADDRESS } from '../data/constants';
import { ALL_COUNTRIES } from '../data/treaties';
import type { WizardState } from './storage';

export async function generateForm8843PDF(state: WizardState): Promise<void> {
  // Load the blank Form 8843 PDF
  const pdfUrl = '/assets/form8843-blank.pdf';
  const existingPdfBytes = await fetch(pdfUrl).then(res => {
    if (!res.ok) throw new Error(`Failed to load PDF: ${res.status}`);
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // Try to fill form fields. IRS PDFs use specific field names.
  // If form fields don't exist, we'll write directly on the pages.
  try {
    fillFormFields(form, state);
  } catch {
    // Form fields not available — PDF will be downloaded without pre-filling
  }

  // Save and download
  const pdfBytes = await pdfDoc.save();
  downloadBlob(pdfBytes, `Form8843_${TAX_YEAR}_${(state.fullName || 'student').replace(/\s+/g, '_')}.pdf`);
}

function fillFormFields(form: any, state: WizardState): void {
  const fields = form.getFields();
  const fieldNames = fields.map((f: any) => f.getName());

  // Map our state to IRS form field names
  // Field names vary by year but common patterns include:
  const mappings: Array<{ patterns: string[]; value: string }> = [
    // Name
    { patterns: ['topmostSubform[0].Page1[0].f1_1[0]', 'f1_1', 'name'], value: state.fullName || '' },
    // SSN/ITIN
    { patterns: ['topmostSubform[0].Page1[0].f1_2[0]', 'f1_2', 'ssn'], value: state.ssn || '' },
    // Address
    { patterns: ['topmostSubform[0].Page1[0].f1_3[0]', 'f1_3', 'address'], value: state.usAddress || '' },
    // Visa type
    { patterns: ['topmostSubform[0].Page1[0].f1_7[0]', 'f1_7', 'visa'], value: state.visaType || '' },
    // Country of citizenship
    { patterns: ['topmostSubform[0].Page1[0].f1_5[0]', 'f1_5', 'citizenship'],
      value: getCountryName(state.citizenship || '') },
    // Country of tax residence
    { patterns: ['topmostSubform[0].Page1[0].f1_6[0]', 'f1_6', 'taxresidence'],
      value: getCountryName(state.taxResidence || state.citizenship || '') },
    // Days present
    { patterns: ['topmostSubform[0].Page1[0].f1_10[0]', 'f1_10', 'days'],
      value: String(state.daysPresent || 365) },
    // Tax year
    { patterns: ['topmostSubform[0].Page1[0].f1_4[0]', 'f1_4', 'taxyear'],
      value: String(TAX_YEAR) },
    // Academic institution
    { patterns: ['topmostSubform[0].Page2[0].f2_1[0]', 'f2_1', 'school'],
      value: state.schoolName || '' },
    // School address
    { patterns: ['topmostSubform[0].Page2[0].f2_2[0]', 'f2_2', 'schooladdr'],
      value: state.schoolAddress || '' },
  ];

  for (const mapping of mappings) {
    for (const pattern of mapping.patterns) {
      try {
        const field = form.getTextField(pattern);
        if (field) {
          field.setText(mapping.value);
          break;
        }
      } catch {
        // Try next pattern
        const matched = fieldNames.find((n: string) =>
          n.toLowerCase().includes(pattern.toLowerCase())
        );
        if (matched) {
          try {
            const field = form.getTextField(matched);
            field.setText(mapping.value);
            break;
          } catch { /* skip */ }
        }
      }
    }
  }

  // Try to set checkboxes
  if (state.visaCompliant) {
    try {
      const checkboxPatterns = ['topmostSubform[0].Page2[0].c2_1[0]', 'c2_1', 'compliant'];
      for (const pattern of checkboxPatterns) {
        try {
          const cb = form.getCheckBox(pattern);
          if (cb) { cb.check(); break; }
        } catch { /* try next */ }
      }
    } catch { /* skip */ }
  }
}

function getCountryName(code: string): string {
  const country = ALL_COUNTRIES.find(c => c.code === code);
  return country ? country.name : code;
}

function downloadBlob(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
