import styled, { css } from 'styled-components';

// Same visual language as the Section Cards template: brand outline, tinted tiles, Segoe UI
export default styled.div(({ theme }: { theme: any }) => {
  const palette = theme?.base?.palette ?? {};
  const border = palette['border-line'] ?? 'rgba(0, 0, 0, 0.12)';
  const brand = palette['brand-primary'] ?? '#1976d2';
  const urgent = palette.urgent ?? '#d32f2f';
  const warn = palette.warn ?? '#ed6c02';

  return css`
    &,
    & * {
      font-family: 'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif;
    }

    .po-card {
      border: 0.0625rem solid color-mix(in srgb, ${brand} 35%, ${border});
      border-inline-start: 0.25rem solid ${brand};
      border-radius: 0.75rem;
    }

    .po-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .po-section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.75rem;
      font-size: 0.95rem;
      font-weight: 700;
    }

    .po-count {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.05rem 0.5rem;
      border-radius: 999px;
      color: ${urgent};
      background: color-mix(in srgb, ${urgent} 12%, transparent);
    }

    /* KPI strip */
    .po-kpis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
      gap: 0.75rem;
      margin: 0;
    }

    .po-kpi {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      padding: 0.75rem 1rem;
      border: 0.0625rem solid color-mix(in srgb, ${brand} 25%, ${border});
      border-inline-start: 0.25rem solid ${brand};
      border-radius: 0.625rem;
      background: color-mix(in srgb, ${brand} 5%, transparent);
    }

    .po-kpi dt {
      font-size: 0.8rem;
      font-weight: 600;
      color: ${brand};
    }

    .po-kpi dd {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }

    .po-kpi-note {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .po-kpi-alert {
      border-inline-start-color: ${urgent};
      background: color-mix(in srgb, ${urgent} 6%, transparent);
    }

    .po-kpi-alert dt {
      color: ${urgent};
    }

    /* Stage pipeline: chevrons, same shape as the case stage bar */
    .po-pipeline {
      display: flex;
      margin: 0;
      padding: 0 0 0.25rem;
      list-style: none;
      overflow-x: auto;
    }

    .po-stage {
      flex: 1 0 8.5rem;
      min-width: 8.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      margin-inline-start: -0.5rem;
      padding: 0.7rem 1.4rem 0.7rem 1.6rem;
      background: color-mix(in srgb, ${brand} 10%, transparent);
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%);
    }

    .po-stage:first-child {
      margin-inline-start: 0;
      padding-inline-start: 1rem;
      border-radius: 0.6rem 0 0 0.6rem;
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%);
    }

    .po-stage-count {
      font-size: 1.35rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    .po-stage-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: ${brand};
      white-space: nowrap;
    }

    .po-stage-age {
      font-size: 0.72rem;
      opacity: 0.7;
      white-space: nowrap;
    }

    .po-stage-busiest {
      background: color-mix(in srgb, ${warn} 18%, transparent);
    }

    .po-stage-busiest .po-stage-name {
      color: ${warn};
    }

    /* Needs attention */
    .po-attention {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .po-attention-row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 0.0625rem solid ${border};
      border-radius: 0.6rem;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }

    .po-attention-row:hover:not(:disabled),
    .po-attention-row:focus-visible {
      border-color: ${brand};
      background: color-mix(in srgb, ${brand} 5%, transparent);
      outline: none;
    }

    .po-attention-row:disabled {
      cursor: default;
    }

    .po-case-id {
      font-weight: 700;
      color: ${brand};
      font-variant-numeric: tabular-nums;
    }

    .po-case-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .po-borrower {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .po-reasons {
      font-size: 0.82rem;
      opacity: 0.75;
    }

    .po-diagnostics {
      font-size: 0.8rem;
      padding: 0.75rem;
      border: 0.0625rem dashed ${border};
      border-radius: 0.6rem;
    }

    .po-diagnostics code {
      display: block;
      margin-top: 0.5rem;
      overflow-wrap: anywhere;
    }
  `;
});
