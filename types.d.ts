declare module "*.har" {
  const fileName: () => Promise<string>;
  export const release: () => Promise<void>;
  export default fileName;
}

declare module "*.json" {
  const fileName: () => Promise<string>;
  export const release: () => Promise<void>;
  export default fileName;
}
