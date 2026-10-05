import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, Icon, Status, Text, useTheme, withConfiguration } from '@pega/cosmos-react-core';

import type { PConnProps } from './PConnProps';
import './create-nonce';
import { DEFAULT_ICONS, ICON_NAMES } from './icons';
import { fontStack } from './fonts';
import { FieldValue, isEmptyValue, labelIn, readFields, splitLabels } from './fields';
import type { CardField } from './fields';
import StyledSectionCardsWrapper from './styles';
import LaunchpadFields from './LaunchpadFields';
import SectionHeader from './SectionHeader';

const REGION_NAMES = ['A', 'B', 'C', 'D', 'E'] as const;
type RegionName = (typeof REGION_NAMES)[number];

// Per-card display. DEFAULT follows the view-level "Field display" setting.
//  TEXT      read-only label / value pairs
//  TILES     read-only KPI tiles (large values), e.g. calculated ratios
//  INPUTS    Launchpad's own editable fields, laid out in columns
//  LAUNCHPAD Launchpad's own layout for the card, untouched (tables, uploads, connectors)
type CardDisplay = 'DEFAULT' | 'TEXT' | 'TILES' | 'INPUTS' | 'LAUNCHPAD';

interface SectionCardsProps extends PConnProps {
  NumCols?: string;
  cardLayout?: 'GRID' | 'STACKED';
  cardFont?: string;
  fieldDisplay?: 'READONLY_TEXT' | 'STANDARD';
  highlightFirst?: boolean;
  showCompleteness?: boolean;
  wideText?: boolean;
  badgeLabels?: string;
  headerStyle?: 'NONE' | 'STRIP';
  headerTitle?: string;
  headerDescription?: string;
  headerIcon?: string;
  headerFacts?: string;
  headerToneFacts?: string;
  headerProgress?: boolean;
  labelA?: string;
  labelB?: string;
  labelC?: string;
  labelD?: string;
  labelE?: string;
  iconA?: string;
  iconB?: string;
  iconC?: string;
  iconD?: string;
  iconE?: string;
  displayA?: CardDisplay;
  displayB?: CardDisplay;
  displayC?: CardDisplay;
  displayD?: CardDisplay;
  displayE?: CardDisplay;
  readOnly?: boolean;
  displayMode?: string;
  children?: ReactElement<any> | ReactElement<any>[];
}

const columnsFor = (numCols: string) => {
  const n = parseInt(numCols, 10);
  return n >= 1 && n <= 4 ? `repeat(${n}, minmax(0, 1fr))` : 'repeat(auto-fill, minmax(12rem, 1fr))';
};

function FieldGrid({ fields, columns, badges }: { fields: CardField[]; columns: string; badges: Set<string> }) {
  return (
    <dl className='sc-fields' style={{ gridTemplateColumns: columns }}>
      {fields.map(field =>
        field.isView ? (
          <div key={field.key} className='sc-view'>
            {field.pConnect.getComponent()}
          </div>
        ) : (
          <div key={field.key} className='sc-field'>
            <dt>{field.label}</dt>
            <dd>
              <FieldValue field={field} asBadge={labelIn(badges, field.label)} />
            </dd>
          </div>
        )
      )}
    </dl>
  );
}

// Read-only KPI tiles: one tile per field with a large value
function TileGrid({ fields, badges }: { fields: CardField[]; badges: Set<string> }) {
  return (
    <dl className='sc-tiles'>
      {fields.map(field =>
        field.isView ? (
          <div key={field.key} className='sc-view'>
            {field.pConnect.getComponent()}
          </div>
        ) : (
          <div key={field.key} className='sc-tile'>
            <dt>{field.label}</dt>
            <dd>
              <FieldValue field={field} asBadge={labelIn(badges, field.label)} />
            </dd>
          </div>
        )
      )}
    </dl>
  );
}

// Launchpad's own field components (editable, validated, calculated as usual), laid out in columns
function InputGrid({ fields, columns, wideText }: { fields: CardField[]; columns: string; wideText: boolean }) {
  return (
    <div className='sc-inputs' style={{ gridTemplateColumns: columns }}>
      {fields.map(field => (
        <div key={field.key} className={field.isView || (wideText && field.isWide) ? 'sc-view' : 'sc-input'}>
          {field.pConnect.getComponent()}
        </div>
      ))}
    </div>
  );
}

// First card as a summary band: the first field (e.g. application number) large, the rest as a row of stats
function SummaryBody({ fields, badges }: { fields: CardField[]; badges: Set<string> }) {
  const [lead, ...rest] = fields.filter(f => !f.isView);
  if (!lead) return null;
  return (
    <div className='sc-summary-body'>
      <div className='sc-lead'>
        <span className='sc-lead-label'>{lead.label}</span>
        <span className='sc-lead-value'>
          <FieldValue field={lead} asBadge={labelIn(badges, lead.label)} />
        </span>
      </div>
      {rest.length > 0 && (
        <dl className='sc-stats'>
          {rest.map(field => (
            <div key={field.key} className='sc-stat'>
              <dt>{field.label}</dt>
              <dd>
                <FieldValue field={field} asBadge={labelIn(badges, field.label)} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

// FORM template: each region (A–E) becomes a titled card. Titles, icons and fields are chosen in App Studio.
function AidenAICreditDecisionSectionCards(props: SectionCardsProps) {
  const {
    NumCols = 'AUTO',
    cardLayout = 'GRID',
    cardFont = 'MODERN',
    fieldDisplay = 'READONLY_TEXT',
    highlightFirst = false,
    showCompleteness = true,
    wideText = true,
    badgeLabels = 'Priority, Application Status, Status',
    headerStyle = 'NONE',
    headerTitle,
    headerDescription,
    headerIcon = 'document',
    headerFacts = 'Case ID, Status, Priority',
    headerToneFacts = 'Status, Priority, Application Status',
    headerProgress = true,
    getPConnect,
    readOnly,
    displayMode
  } = props;
  const theme = useTheme();

  const children = ([] as ReactElement<any>[]).concat(props.children ?? []);
  const regionMeta: Array<{ name?: string }> = getPConnect().getRawMetadata()?.children ?? [];
  const titles: Record<RegionName, string | undefined> = {
    A: props.labelA,
    B: props.labelB,
    C: props.labelC,
    D: props.labelD,
    E: props.labelE
  };
  const icons: Record<RegionName, string | undefined> = {
    A: props.iconA,
    B: props.iconB,
    C: props.iconC,
    D: props.iconD,
    E: props.iconE
  };

  const asText = fieldDisplay !== 'STANDARD' || readOnly === true || displayMode === 'DISPLAY_ONLY';
  const columns = columnsFor(NumCols);
  // Columns for cards rendered through Launchpad's own layout ("Automatic" = two)
  const launchpadColumns = Math.min(Math.max(parseInt(NumCols, 10) || 2, 1), 4);
  const displays: Record<RegionName, CardDisplay | undefined> = {
    A: props.displayA,
    B: props.displayB,
    C: props.displayC,
    D: props.displayD,
    E: props.displayE
  };
  // Resolves a card's display: its own setting, else the view-level "Field display" setting.
  // "Editable fields" renders the card through Launchpad's own layout (which keeps every input
  // editable) and applies the template style on top with CSS (font, labels, columns).
  const displayFor = (name: RegionName): Exclude<CardDisplay, 'DEFAULT'> => {
    const own = displays[name];
    if (own && own !== 'DEFAULT') return own;
    return asText ? 'TEXT' : 'LAUNCHPAD';
  };
  const badges = splitLabels(badgeLabels);

  const cards = children
    .map((child, i) => {
      const name = (regionMeta[i]?.name ?? REGION_NAMES[i]) as RegionName;
      return { child, name, fields: readFields(child) };
    })
    .filter(card => card.fields.length > 0);

  return (
    <StyledSectionCardsWrapper theme={theme} $font={fontStack(cardFont)}>
      {headerStyle === 'STRIP' && (
        <SectionHeader
          title={headerTitle}
          description={headerDescription}
          iconName={ICON_NAMES.includes(headerIcon) ? headerIcon : 'document'}
          factFields={headerFacts}
          toneFields={headerToneFacts}
          showProgress={headerProgress}
          fields={cards.flatMap(card => card.fields)}
          getPConnect={getPConnect}
        />
      )}
      <div className={cardLayout === 'STACKED' ? 'sc-cards' : 'sc-cards sc-cards-grid'}>
        {cards.map(({ child, name, fields }, i) => {
          const hasView = fields.some(f => f.isView);
          // Cards holding only tables / lists / views are always rendered exactly as Launchpad renders them
          const display = fields.every(f => f.isView) ? 'LAUNCHPAD' : displayFor(name);
          const isSummary = highlightFirst && i === 0 && display === 'TEXT';
          const valueFields = fields.filter(f => !f.isView);
          const filled = valueFields.filter(f => !isEmptyValue(f.value)).length;
          const iconName = ICON_NAMES.includes(icons[name] ?? '') ? icons[name] : DEFAULT_ICONS[name];
          const classes = ['sc-card', isSummary && 'sc-summary', (isSummary || hasView || display === 'TILES') && 'sc-full']
            .filter(Boolean)
            .join(' ');

          return (
            <Card key={name} className={classes}>
              {titles[name] && (
                <CardHeader>
                  <div className='sc-head'>
                    <span className='sc-icon' aria-hidden>
                      <Icon name={iconName ?? 'document'} />
                    </span>
                    <Text variant='h3'>{titles[name]}</Text>
                    {showCompleteness && valueFields.length > 0 && (
                      <span className='sc-progress'>
                        {filled === valueFields.length ? (
                          <Status variant='success'>Complete</Status>
                        ) : (
                          <Text variant='secondary'>{`${filled} of ${valueFields.length} provided`}</Text>
                        )}
                      </span>
                    )}
                  </div>
                </CardHeader>
              )}
              <CardContent>
                {display === 'LAUNCHPAD' && (
                  <LaunchpadFields child={child} columns={hasView ? 1 : launchpadColumns} wideText={wideText} />
                )}
                {display === 'INPUTS' && <InputGrid fields={fields} columns={columns} wideText={wideText} />}
                {display === 'TILES' && <TileGrid fields={fields} badges={badges} />}
                {display === 'TEXT' && isSummary && <SummaryBody fields={fields} badges={badges} />}
                {display === 'TEXT' && !isSummary && <FieldGrid fields={fields} columns={columns} badges={badges} />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </StyledSectionCardsWrapper>
  );
}

export default withConfiguration(AidenAICreditDecisionSectionCards);
