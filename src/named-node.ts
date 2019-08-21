import { Term } from "./term";

export class NamedNode extends Term<"NamedNode"> {

  constructor(value: string) {
    super("NamedNode", value);
  }

  equals(other: Term): boolean {
    return !!(
      NamedNode.is(other) &&
      other.value === this.value
    );
  }

  static is(other?: unknown): other is NamedNode {
    return Term.is(other) && other.termType === "NamedNode";
  }

}
