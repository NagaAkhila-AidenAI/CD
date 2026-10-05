// Minimal PConnect typing for this template. Constellation injects getPConnect at runtime.
export interface PConnect {
  getRawMetadata: () => any;
  getChildren: () => any[];
  getConfigProps: () => any;
  resolveConfigProps: (props: any) => any;
  getComponent: () => any;
  createComponent: (meta: any, dataSource?: string, index?: number, additionalProps?: Record<string, unknown>) => any;
  getInheritedProps: () => Record<string, any>;
}

export interface PConnProps {
  getPConnect: () => PConnect;
}
