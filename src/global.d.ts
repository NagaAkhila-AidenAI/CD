// PCore and PConnect are injected at runtime by the Constellation bootstrap script
// (loaded via a <script> tag, not an ES import), so they must be declared as ambient
// globals here rather than imported — @pega/pcore-pconnect-typedefs only exports them
// as module types, it does not declare them globally.
declare const PCore: any;
declare const PConnect: any;
