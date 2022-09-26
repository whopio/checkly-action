import { Module, VariableDeclarator } from "@swc/core";

export const findExport = ({ body }: Module, name: string) => {
  for (const node of body) {
    if (node.type === "ExportDeclaration") {
      if (node.declaration.type === "VariableDeclaration") {
        const [declaration] = node.declaration.declarations;
        if (declaration.id.type === "Identifier") {
          if (name === declaration.id.value) return declaration;
        }
      }
    }
  }
};

export const stringArray = (
  declarator: VariableDeclarator,
  defaultValue: string[] = []
) => {
  if (!declarator) return defaultValue;
  const { init } = declarator;
  if (init) {
    const result: string[] = [];
    if (init.type === "ArrayExpression") {
      for (const element of init.elements) {
        if (element?.expression.type === "StringLiteral") {
          result.push(element.expression.value);
        } else
          throw new Error(
            `Expected StringLiteral, got ${element?.expression.type}`
          );
      }
    }
    return result;
  }
  throw new Error("could not parse strng array from variable declarator");
};

export const bool = (
  declarator: VariableDeclarator,
  defaultValue: boolean = false
) => {
  if (!declarator) return defaultValue;
  const { init } = declarator;
  if (init) {
    if (init.type === "BooleanLiteral") return init.value;
  }
  throw new Error("could not parse strng array from variable declarator");
};

export const stripExports = (
  ast: Module,
  whiteList: string[],
  defaultExport: boolean = false
): Module => {
  return {
    ...ast,
    body: ast.body.filter((node) => {
      if (!node.type.startsWith("Export")) return true;
      if (node.type === "ExportDefaultDeclaration") return defaultExport;
      if (node.type === "ExportDefaultExpression") return defaultExport;
      if (node.type === "ExportDeclaration") {
        if (node.declaration.type === "VariableDeclaration") {
          const [declaration] = node.declaration.declarations;
          if (declaration.id.type === "Identifier") {
            return whiteList.includes(declaration.id.value);
          }
        }
      }
      return false;
    }),
  };
};
