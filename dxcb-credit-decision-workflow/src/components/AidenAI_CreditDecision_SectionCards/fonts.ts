// Card font choices. Only fonts already installed on Windows / macOS are used: Launchpad's content
// security policy blocks downloading web fonts, so each stack falls back to a safe system font.
export const FONT_STACKS: Record<string, string> = {
  THEME: 'inherit',
  MODERN: '"Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
  CLEAN: 'Calibri, Carlito, "Helvetica Neue", Arial, sans-serif',
  FRIENDLY: '"Trebuchet MS", "Lucida Grande", Verdana, sans-serif',
  CLASSIC: 'Georgia, Cambria, "Times New Roman", serif'
};

export const fontStack = (key?: string) => FONT_STACKS[key ?? 'MODERN'] ?? FONT_STACKS.MODERN;
