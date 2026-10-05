import styled, { css } from 'styled-components';

// Colors come from the Launchpad theme palette so the strip follows the app's branding and dark mode
export default styled.div<{ $font: string }>(({ theme, $font }: { theme: any; $font: string }) => {
  const palette = theme?.base?.palette ?? {};
  const border = palette['border-line'] ?? 'rgba(0, 0, 0, 0.12)';
  const brand = palette['brand-primary'] ?? '#1976d2';
  const tones: Record<string, string> = {
    success: palette.success ?? '#2e7d32',
    warn: palette.warn ?? '#ed6c02',
    urgent: palette.urgent ?? '#d32f2f'
  };

  const toneRules = Object.entries(tones)
    .map(
      ([tone, color]) => `
        .risk-strip.tone-${tone} { border-color: ${color}; }
        .risk-strip.tone-${tone} .risk-bar-fill { background: ${color}; }
        .risk-strip.tone-${tone} .risk-score-value { color: ${color}; }
      `
    )
    .join('');

  return css`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .screening-card,
    .screening-card *,
    .risk-strip,
    .risk-strip * {
      font-family: ${$font};
    }

    /* Same card border as Section Cards: brand outline + accent edge */
    .screening-card {
      border: 0.0625rem solid color-mix(in srgb, ${brand} 45%, ${border});
      border-inline-start: 0.25rem solid ${brand};
      border-radius: 0.75rem;
      box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.04);
    }

    .screening-card.editable {
      background: color-mix(in srgb, ${brand} 5%, transparent);
    }

    .screening-grid {
      align-items: start;
    }

    /* Field names are highlighted in the brand color; values keep their normal style */
    .screening-field dt {
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: ${brand};
    }

    .screening-field dd {
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .risk-strip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 1.25rem;
      border: 0.0625rem solid ${border};
      border-inline-start-width: 0.25rem;
      border-radius: 0.75rem;
    }

    .risk-score {
      min-width: 8rem;
    }

    .risk-score-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.1;
    }

    .risk-score-max {
      font-size: 0.875rem;
      font-weight: 400;
      opacity: 0.7;
    }

    .risk-detail {
      flex: 1 1 16rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .risk-bar {
      height: 0.5rem;
      border-radius: 0.25rem;
      background: ${border};
      overflow: hidden;
    }

    .risk-bar-fill {
      height: 100%;
      border-radius: 0.25rem;
    }

    ${toneRules}

    @media (max-width: 40rem) {
      .screening-grid {
        grid-template-columns: minmax(0, 1fr) !important;
      }
    }
  `;
});
