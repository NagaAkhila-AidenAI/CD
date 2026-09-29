// AML screening lookup: given an AML Check ID, returns the screening result.
//
// While the screens are being built this answers from MOCK data locally. To use the Launchpad
// mock API instead, set AML_DATA_PAGE to the data page that backs it (e.g. 'D_AMLScreening'),
// check its parameter name in AML_DATA_PAGE_PARAM, and adjust mapPegaResult to its property names.
import { pickValue } from './caseData';

export const AML_DATA_PAGE = '';
const AML_DATA_PAGE_PARAM = 'AMLCheckID';

export interface AmlResult {
  checkId: string;
  screeningDate: string;
  status: string;
  riskRating: string;
  riskLevel: 'Low' | 'Medium' | 'High' | string;
  riskScore: number | string;
  matchFound: boolean;
  customerName: string;
  screeningType: string;
  sanctionScreeningId: string;
  sanctionScreeningDate: string;
  sanctionListName: string;
  sanctionMatchFound: boolean;
  screeningStatus: string;
  pepStatus: string;
}

// Case property each result field is written to on Eligible / Ineligible, so the Launchpad case
// holds the same values its own "Correct & Save" view would. Rename to match your data model.
export const AML_CASE_PROPERTIES: Record<keyof Omit<AmlResult, 'customerName' | 'screeningType'>, string> = {
  checkId: 'AMLCheckID',
  screeningDate: 'AMLScreeningDate',
  status: 'AMLStatus',
  riskRating: 'AMLRiskRating',
  riskLevel: 'AMLRiskLevel',
  riskScore: 'AMLRiskScore',
  matchFound: 'AMLMatchFound',
  sanctionScreeningId: 'SanctionScreeningID',
  sanctionScreeningDate: 'SanctionScreeningDate',
  sanctionListName: 'SanctionListName',
  sanctionMatchFound: 'SanctionMatchFound',
  screeningStatus: 'ScreeningStatus',
  pepStatus: 'PEPStatus'
};

export function toCaseFields(result: AmlResult): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(AML_CASE_PROPERTIES).map(([key, prop]) => [prop, result[key as keyof AmlResult]])
  );
}

export interface AmlLookupContext {
  customerName?: string;
  borrowerKind?: 'individual' | 'business';
}

export const SAMPLE_AML_CHECK_ID = 'AML-1001';

const asBool = (v: unknown) => v === true || String(v).toLowerCase() === 'true';

function mapPegaResult(checkId: string, data: Record<string, any>): AmlResult {
  const get = (keys: string[]) => pickValue(data, keys) ?? '';
  return {
    checkId,
    screeningDate: get(['AMLScreeningDate', 'ScreeningDate']),
    status: get(['AMLStatus', 'Status']),
    riskRating: get(['AMLRiskRating', 'RiskRating']),
    riskLevel: get(['AMLRiskLevel', 'RiskLevel']),
    riskScore: get(['AMLRiskScore', 'RiskScore']),
    matchFound: asBool(pickValue(data, ['AMLMatchFound', 'MatchFound'])),
    customerName: get(['AMLCustomerName', 'CustomerName']),
    screeningType: get(['AMLScreeningType', 'ScreeningType']),
    sanctionScreeningId: get(['SanctionScreeningID', 'SanctionScreeningId']),
    sanctionScreeningDate: get(['SanctionScreeningDate']),
    sanctionListName: get(['SanctionListName']),
    sanctionMatchFound: asBool(pickValue(data, ['SanctionMatchFound'])),
    screeningStatus: get(['ScreeningStatus']),
    pepStatus: get(['PEPStatus', 'PepStatus'])
  };
}

type MockPreset = Omit<AmlResult, 'checkId' | 'customerName' | 'screeningType' | 'screeningDate' | 'sanctionScreeningDate' | 'sanctionScreeningId'>;

// Fixed IDs to demo each outcome; any other ID gets a stable result derived from the ID
const MOCK_PRESETS: Record<string, MockPreset> = {
  'AML-1001': {
    status: 'Completed',
    riskRating: 'Low',
    riskLevel: 'Low',
    riskScore: 12,
    matchFound: false,
    sanctionListName: 'OFAC SDN',
    sanctionMatchFound: false,
    screeningStatus: 'Clear',
    pepStatus: 'Not a PEP'
  },
  'AML-2002': {
    status: 'Completed',
    riskRating: 'Medium',
    riskLevel: 'Medium',
    riskScore: 48,
    matchFound: false,
    sanctionListName: 'EU Consolidated List',
    sanctionMatchFound: false,
    screeningStatus: 'Review Required',
    pepStatus: 'Related to PEP'
  },
  'AML-3003': {
    status: 'Completed',
    riskRating: 'High',
    riskLevel: 'High',
    riskScore: 96,
    matchFound: true,
    sanctionListName: 'UN Security Council List',
    sanctionMatchFound: true,
    screeningStatus: 'Hit',
    pepStatus: 'PEP'
  }
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function mockLookup(checkId: string, ctx: AmlLookupContext): Promise<AmlResult> {
  const preset = MOCK_PRESETS[checkId.toUpperCase()] ?? MOCK_PRESETS[Object.keys(MOCK_PRESETS)[hash(checkId) % 3]];
  const now = new Date().toISOString();
  const result: AmlResult = {
    checkId,
    ...preset,
    screeningDate: now,
    sanctionScreeningId: `SAN-${(hash(checkId) % 90000) + 10000}`,
    sanctionScreeningDate: now,
    customerName: ctx.customerName || 'Unknown customer',
    screeningType: ctx.borrowerKind === 'individual' ? 'Individual screening' : 'Entity screening'
  };
  // Simulated network latency so the loading state is visible
  return new Promise((resolve) => setTimeout(() => resolve(result), 700));
}

export async function lookupAmlCheck(checkId: string, ctx: AmlLookupContext): Promise<AmlResult> {
  const id = checkId.trim();
  if (!id) throw new Error('Enter an AML Check ID');

  if (AML_DATA_PAGE && typeof PCore !== 'undefined') {
    const data = (await PCore.getDataPageUtils().getPageDataAsync(AML_DATA_PAGE, 'app/primary', {
      [AML_DATA_PAGE_PARAM]: id
    })) as Record<string, any>;
    if (!data || Object.keys(data).length === 0) throw new Error(`No AML record found for ${id}`);
    return mapPegaResult(id, data);
  }

  return mockLookup(id, ctx);
}
