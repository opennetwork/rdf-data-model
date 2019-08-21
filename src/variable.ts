import { isTerm, Term } from "./term";

export function isVariable(value?: unknown): value is Variable {
  if (!isTerm(value)) {
    return false;
  }
  return value.termType === "Variable";
}

export class Variable extends Term<"Variable"> {

  constructor(value: string) {
    super("Variable", value);
  }

  equals(other: Term): boolean {
    return !!(
      isVariable(other) &&
      other.value === this.value
    );
  }

}
