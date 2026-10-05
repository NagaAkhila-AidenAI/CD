import styled, { css } from 'styled-components';

// Compact enough for a table cell; colors from the Launchpad theme palette
export default styled.span(({ theme }: { theme: any }) => {
  const palette = theme?.base?.palette ?? {};
  const border = palette['border-line'] ?? 'rgba(0, 0, 0, 0.12)';
  const brand = palette['brand-primary'] ?? '#1976d2';
  const success = palette.success ?? '#2e7d32';
  const urgent = palette.urgent ?? '#d32f2f';

  return css`
    display: inline-flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 9rem;
    max-width: 14rem;
    vertical-align: middle;

    .sp-top {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      white-space: nowrap;
    }

    .sp-count {
      font-size: 0.72rem;
      opacity: 0.7;
      font-variant-numeric: tabular-nums;
    }

    .sp-track {
      display: flex;
      gap: 0.15rem;
    }

    .sp-seg {
      flex: 1;
      height: 0.3rem;
      border-radius: 999px;
      background: ${border};
    }

    .sp-progress .sp-seg-done,
    .sp-new .sp-seg-done {
      background: ${brand};
    }

    .sp-progress .sp-seg-current,
    .sp-new .sp-seg-current {
      background: color-mix(in srgb, ${brand} 45%, transparent);
      box-shadow: inset 0 0 0 0.0625rem ${brand};
    }

    .sp-done .sp-seg-done {
      background: ${success};
    }

    .sp-stopped .sp-seg-done {
      background: ${urgent};
    }
  `;
});
