import type { ReactElement } from 'react';
import { FieldValueList } from '@pega/cosmos-react-core';

export interface RegionField {
  label: string;
  value: unknown;
}

const regionKids = (child: ReactElement<any>): any[] => {
  try {
    return Object.values(child?.props?.getPConnect?.().getChildren?.() ?? []);
  } catch {
    return [];
  }
};

// Embedded views, groups and embedded data lists / tables are rendered by Launchpad itself
const CONTAINER_TYPES = new Set(['reference', 'group', 'view', 'region', 'simpletable', 'simpletablemanual', 'listview', 'table', 'fieldgrouptemplate', 'embeddeddata']);

function isContainer(meta: any, value: unknown): boolean {
  const type = String(meta?.type ?? '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  return (
    CONTAINER_TYPES.has(type) ||
    type.includes('table') ||
    type.includes('list') ||
    Boolean(meta?.config?.referenceList) ||
    Array.isArray(value)
  );
}

export const regionHasFields =(child: ReactElement<any>) => regionKids(child).length > 0;

// Resolved label + value of every field placed in a region, used to drive the risk summary
export function readRegionFields(child: ReactElement<any>): RegionField[] {
  return regionKids(child).flatMap((kid: any) => {
    try {
      const pConnect = kid.getPConnect();
      const { label, caption, value } = pConnect.resolveConfigProps(pConnect.getConfigProps());
      return [{ label: String(label ?? caption ?? ''), value }];
    } catch {
      return [];
    }
  });
}

// Same approach as the Section Cards template: ask each field to render in display mode so it
// reads as text; fall back to Launchpad's own rendering if that isn't possible
function displayOnly(pConnect: any): ReactElement {
  try {
    const meta = pConnect.getRawMetadata();
    const created = pConnect.createComponent({
      ...meta,
      config: { ...meta.config, displayMode: 'DISPLAY_ONLY', readOnly: true, hideLabel: true }
    });
    if (created) return created;
  } catch {
    // fall through to the field's normal rendering
  }
  return pConnect.getComponent();
}

export function ReadOnlyFields({ child }: { child: ReactElement<any> }) {
  return (
    <>
      {regionKids(child).map((kid: any, i: number) => {
        const pConnect = kid.getPConnect();
        const meta = pConnect.getRawMetadata();
        const { hideLabel, label, caption, testId, value } = pConnect.resolveConfigProps(pConnect.getConfigProps());
        const name = label ?? caption ?? '';
        const key = `${meta?.type}-${name}-${i}`;

        if (isContainer(meta, value)) {
          return (
            <div key={key} style={{ gridColumn: '1 / -1', minWidth: 0 }}>
              {pConnect.getComponent()}
            </div>
          );
        }

        return (
          <FieldValueList
            key={key}
            className='screening-field'
            variant='stacked'
            data-testid={testId}
            fields={[{ id: key, name: hideLabel ? '' : name, value: displayOnly(pConnect) }]}
          />
        );
      })}
    </>
  );
}
