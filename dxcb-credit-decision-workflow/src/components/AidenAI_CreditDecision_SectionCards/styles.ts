import styled, { css } from 'styled-components';

// Colors come from the Launchpad theme so the cards follow the app's branding and dark mode.
// color-mix() makes the light tints from the brand color instead of hard-coding them.
export default styled.div<{ $font: string }>(({ theme, $font }: { theme: any; $font: string }) => {
  const palette = theme?.base?.palette ?? {};
  const border = palette['border-line'] ?? 'rgba(0, 0, 0, 0.12)';
  const brand = palette['brand-primary'] ?? '#1976d2';

  return css`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .sc-card,
    .sc-card *,
    .sc-header,
    .sc-header * {
      font-family: ${$font};
    }

    /* Section header (compact strip): title, case facts as chips, overall progress */
    .sc-header {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem 1.25rem 0.875rem;
      border: 0.0625rem solid color-mix(in srgb, ${brand} 30%, ${border});
      border-inline-start: 0.3rem solid ${brand};
      border-radius: 0.75rem;
      background: color-mix(in srgb, ${brand} 4%, transparent);
    }

    .sc-header-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem 1rem;
    }

    .sc-header-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.4rem;
      height: 2.4rem;
      flex-shrink: 0;
      border-radius: 0.6rem;
      color: ${brand};
      background: color-mix(in srgb, ${brand} 12%, transparent);
    }

    .sc-header-title {
      flex: 1 1 auto;
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
    }

    .sc-header-facts {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-inline-start: auto;
    }

    .sc-fact {
      display: inline-flex;
      align-items: baseline;
      gap: 0.35rem;
      padding: 0.2rem 0.65rem;
      border: 0.0625rem solid ${border};
      border-radius: 999px;
      font-size: 0.8rem;
      white-space: nowrap;
    }

    .sc-fact-label {
      opacity: 0.7;
    }

    .sc-fact-value {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }

    .sc-header-sub {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem 1.5rem;
      font-size: 0.875rem;
    }

    .sc-header-desc {
      opacity: 0.8;
      min-width: 0;
    }

    .sc-header-progress {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      flex: 0 1 20rem;
      min-width: 12rem;
      margin-inline-start: auto;
    }

    .sc-header-count {
      white-space: nowrap;
      font-size: 0.8rem;
      font-variant-numeric: tabular-nums;
      opacity: 0.8;
    }

    .sc-header-bar {
      flex: 1;
      height: 0.375rem;
      border-radius: 999px;
      background: ${border};
      overflow: hidden;
    }

    .sc-header-bar > i {
      display: block;
      height: 100%;
      border-radius: 999px;
      background: ${brand};
    }

    .sc-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sc-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 30rem), 1fr));
      align-items: stretch;
    }

    /* Every card gets the brand outline + accent edge; the summary card adds a tinted background */
    .sc-card {
      border: 0.0625rem solid color-mix(in srgb, ${brand} 45%, ${border});
      border-inline-start: 0.25rem solid ${brand};
      border-radius: 0.75rem;
      box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.04);
      min-width: 0;
    }

    .sc-full {
      grid-column: 1 / -1;
    }

    /* Card header: icon tile, title, completeness */
    .sc-head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }

    .sc-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      flex-shrink: 0;
      border-radius: 0.5rem;
      color: ${brand};
      background: color-mix(in srgb, ${brand} 12%, transparent);
    }

    .sc-progress {
      margin-inline-start: auto;
      white-space: nowrap;
    }

    /* Field grid */
    .sc-fields {
      display: grid;
      column-gap: 1.5rem;
      row-gap: 1.25rem;
      margin: 0;
    }

    .sc-field {
      min-width: 0;
    }

    /* Field names are highlighted in the brand color; values keep their normal style */
    .sc-field dt,
    .sc-stat dt,
    .sc-lead-label {
      margin: 0 0 0.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: ${brand};
    }

    .sc-field dd,
    .sc-stat dd {
      margin: 0;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .sc-view {
      grid-column: 1 / -1;
      min-width: 0;
    }

    /* Editable Launchpad fields laid out in columns */
    .sc-inputs {
      display: grid;
      column-gap: 1.5rem;
      row-gap: 1rem;
      align-items: start;
    }

    .sc-input {
      min-width: 0;
    }

    /* Launchpad's own field labels follow the template style (brand color, semi-bold) in every
       editable card, including cards shown in Launchpad layout; the inputs themselves are untouched */
    .sc-input label,
    .sc-view label,
    .sc-card label,
    .sc-card legend {
      color: ${brand};
      font-weight: 600;
    }

    /* Launchpad-rendered fields laid out in columns (classes added by LaunchpadFields) */
    .sc-lp-grid {
      display: grid !important;
      grid-template-columns: repeat(var(--sc-cols, 2), minmax(0, 1fr));
      column-gap: 1.5rem;
      row-gap: 1rem;
      align-items: start;
    }

    .sc-lp-grid > * {
      min-width: 0;
    }

    .sc-lp-grid > .sc-lp-wide {
      grid-column: 1 / -1;
    }

    /* Read-only KPI tiles, e.g. calculated ratios */
    .sc-tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
      gap: 0.75rem;
      margin: 0;
    }

    .sc-tile {
      padding: 0.875rem 1rem;
      border: 0.0625rem solid color-mix(in srgb, ${brand} 25%, ${border});
      border-radius: 0.625rem;
      background: color-mix(in srgb, ${brand} 6%, transparent);
      min-width: 0;
    }

    .sc-tile dt {
      margin: 0 0 0.375rem;
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: ${brand};
    }

    .sc-tile dd {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .sc-empty {
      font-weight: 400;
      font-style: italic;
      opacity: 0.55;
    }

    /* Summary band */
    .sc-summary {
      background: linear-gradient(
        100deg,
        color-mix(in srgb, ${brand} 8%, transparent) 0%,
        transparent 70%
      );
    }

    .sc-summary-body {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem 2.5rem;
    }

    .sc-lead {
      display: flex;
      flex-direction: column;
      min-width: 12rem;
    }

    .sc-lead-value {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 0.01em;
      overflow-wrap: anywhere;
    }

    .sc-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem 0;
      margin: 0;
      flex: 1 1 24rem;
    }

    .sc-stat {
      padding-inline: 1.5rem;
      border-inline-start: 0.0625rem solid ${border};
      min-width: 9rem;
    }

    @media (max-width: 40rem) {
      .sc-fields,
      .sc-inputs,
      .sc-lp-grid {
        grid-template-columns: minmax(0, 1fr) !important;
      }

      .sc-stat {
        padding-inline: 0 1rem;
        border-inline-start: none;
      }
    }
  `;
});
