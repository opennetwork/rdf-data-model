import { Term } from "./term";

export class Variable extends Term<"Variable"> {

  constructor(value: string) {
    super("Variable", value);
  }

  equals(other: Term): boolean {
    return !!(
      Variable.is(other) &&
      other.value === this.value
    );
  }

  static is(other?: unknown): other is Variable {
    return Term.is(other) && other.termType === "Variable";
  }

}
