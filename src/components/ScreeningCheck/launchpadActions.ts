// Sends Screening Check decisions to the Launchpad case.
//
// In preview (no Launchpad case loaded) these resolve immediately and the screens only navigate
// locally. With a Launchpad case they write the fields onto the case and finish the current
// assignment with the matching outcome, the same as clicking the button in Launchpad itself.
//
// Before publishing, check in App Studio (the flow behind "Correct & Save"):
//   - the outcome IDs of the Eligible / Ineligible buttons -> SCREENING_OUTCOMES
//   - the case property names -> AML_CASE_PROPERTIES in amlService.ts
import type { CaseSnapshot } from './caseData';

export type ScreeningDecision = 'eligible' | 'ineligible';

export const SCREENING_OUTCOMES: Record<ScreeningDecision, string> = {
  eligible: 'Eligible',
  ineligible: 'Ineligible'
};

function getCasePConnect(caseData: CaseSnapshot) {
  const { getPConnect } = PCore.createPConnect({
    meta: { type: 'View', config: {} },
    options: { context: caseData.contextName, pageReference: 'caseInfo.content' }
  });
  return getPConnect();
}

export async function submitScreeningDecision(
  caseData: CaseSnapshot,
  decision: ScreeningDecision,
  fields: Record<string, unknown>
): Promise<void> {
  if (caseData.source !== 'pega' || !caseData.contextName) return;

  const pConnect = getCasePConnect(caseData);
  Object.entries(fields).forEach(([prop, value]) => pConnect.setValue(`.${prop}`, value));
  await pConnect.getActionsApi().finishAssignment(caseData.contextName, { outcomeID: SCREENING_OUTCOMES[decision] });
}

// "Save for later": keeps the entered values on the case without completing the assignment
export async function saveScreeningForLater(caseData: CaseSnapshot, fields: Record<string, unknown>): Promise<void> {
  if (caseData.source !== 'pega' || !caseData.contextName) return;

  const pConnect = getCasePConnect(caseData);
  Object.entries(fields).forEach(([prop, value]) => pConnect.setValue(`.${prop}`, value));
  await pConnect.getActionsApi().saveAssignment(caseData.contextName);
}
