// PCore is injected globally by Launchpad (Constellation) at runtime.
// Same purpose as src/pcore-globals.d.ts in Pega's DXCB project template, typed loosely
// because this project doesn't install @pega/pcore-pconnect-typedefs.
declare global {
  const PCore: any;

  interface Window {
    PCore: any;
  }
}

export {};
