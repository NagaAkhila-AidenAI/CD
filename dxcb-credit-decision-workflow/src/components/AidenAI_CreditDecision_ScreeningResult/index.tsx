import type { ReactElement } from 'react';
import {
  Banner,
  Card,
  CardContent,
  CardHeader,
  Flex,
  Grid,
  Status,
  Text,
  useTheme,
  withConfiguration
} from '@pega/cosmos-react-core';

import type { PConnProps } from './PConnProps';
import './create-nonce';
import { ReadOnlyFields, readRegionFields, regionHasFields } from './fields';
import { buildRiskSummary } from './risk';
import { fontStack } from './fonts';
import type { RiskSummary } from './risk';
import StyledScreeningResultWrapper from './styles';

const REGION_NAMES = ['A', 'B', 'C', 'D'] as const;
type RegionName = (typeof REGION_NAMES)[number];

interface ScreeningResultProps extends PConnProps {
  NumCols?: string;
  cardFont?: string;
  editableCard?: 'A' | 'NONE';
  showRiskSummary?: boolean;
  riskScoreLabel?: string;
  riskLevelLabel?: string;
  maxScore?: string;
  matchLabels?: string;
  chipLabels?: string;
  labelA?: string;
  labelB?: string;
  labelC?: string;
  labelD?: string;
  children?: ReactElement<any> | ReactElement<any>[];
}

function RiskStrip({ summary, maxScore }: { summary: RiskSummary; maxScore: number }) {
  const pct = summary.score === undefined ? 0 : Math.max(0, Math.min(100, (summary.score / maxScore) * 100));
  const matchText = summary.matches.map(m => m.replace(/\s*found$/i, '')).join(' and ');

  return (
    <Flex container={{ direction: 'column', gap: 1.5 }}>
      <div className={`risk-strip tone-${summary.tone}`}>
        <div className='risk-score'>
          <Text variant='secondary'>Risk score</Text>
          <div className='risk-score-value'>
            {summary.scoreText ?? '—'}
            {summary.score !== undefined && <span className='risk-score-max'> / {maxScore}</span>}
          </div>
        </div>
        <div className='risk-detail'>
          {summary.score !== undefined && (
            <div
              className='risk-bar'
              role='meter'
              aria-label='Risk score'
              aria-valuemin={0}
              aria-valuemax={maxScore}
              aria-valuenow={summary.score}
            >
              <div className='risk-bar-fill' style={{ width: `${pct}%` }} />
            </div>
          )}
          <Flex container={{ gap: 1, wrap: 'wrap' }}>
            {summary.level && <Status variant={summary.tone}>{`Risk level ${summary.level}`}</Status>}
            {summary.chips.map(chip => (
              <Status key={chip.label} variant='info'>
                {chip.value}
              </Status>
            ))}
          </Flex>
        </div>
      </div>
      {summary.matches.length > 0 && (
        <Banner variant='urgent' messages={[`Potential match found: ${matchText}. Review before deciding eligibility.`]} />
      )}
    </Flex>
  );
}

// FORM template for screening steps: Card A keeps its inputs editable (the AML Check ID), the other
// cards show the looked-up results as read-only text, and a risk summary is drawn from the result fields.
function AidenAICreditDecisionScreeningResult(props: ScreeningResultProps) {
  const {
    NumCols = '3',
    cardFont = 'MODERN',
    editableCard = 'A',
    showRiskSummary = true,
    riskScoreLabel = 'AML Risk Score',
    riskLevelLabel = 'AML Risk Level',
    maxScore = '100',
    matchLabels = 'AML Match Found, Sanction Match Found',
    chipLabels = 'AML Status, Screening Status, PEP Status',
    getPConnect
  } = props;
  const theme = useTheme();

  const children = ([] as ReactElement<any>[]).concat(props.children ?? []);
  const regionMeta: Array<{ name?: string }> = getPConnect().getRawMetadata()?.children ?? [];
  const titles: Record<RegionName, string | undefined> = {
    A: props.labelA,
    B: props.labelB,
    C: props.labelC,
    D: props.labelD
  };

  const nCols = Math.min(Math.max(parseInt(NumCols, 10) || 3, 1), 3);
  const max = parseFloat(maxScore) > 0 ? parseFloat(maxScore) : 100;
  const regions = children.map((child, i) => ({
    child,
    name: (regionMeta[i]?.name ?? REGION_NAMES[i]) as RegionName
  }));

  const summary = showRiskSummary
    ? buildRiskSummary(
        regions.flatMap(r => readRegionFields(r.child)),
        { riskScoreLabel, riskLevelLabel, matchLabels, chipLabels, maxScore: max }
      )
    : null;

  const renderCard = ({ child, name }: { child: ReactElement<any>; name: RegionName }) => {
    const editable = editableCard === name;
    return (
      <Card key={name} className={editable ? 'screening-card editable' : 'screening-card'}>
        {titles[name] && (
          <CardHeader>
            <Text variant='h3'>{titles[name]}</Text>
          </CardHeader>
        )}
        <CardContent>
          {editable ? (
            child
          ) : (
            <Grid className='screening-grid' container={{ cols: `repeat(${nCols}, minmax(0, 1fr))`, colGap: 3, rowGap: 2 }}>
              <ReadOnlyFields child={child} />
            </Grid>
          )}
        </CardContent>
      </Card>
    );
  };

  const visible = regions.filter(r => regionHasFields(r.child));
  const inputCards = visible.filter(r => r.name === editableCard);
  const resultCards = visible.filter(r => r.name !== editableCard);

  return (
    <StyledScreeningResultWrapper theme={theme} $font={fontStack(cardFont)}>
      {inputCards.map(renderCard)}
      {summary && <RiskStrip summary={summary} maxScore={max} />}
      {resultCards.map(renderCard)}
    </StyledScreeningResultWrapper>
  );
}

export default withConfiguration(AidenAICreditDecisionScreeningResult);
