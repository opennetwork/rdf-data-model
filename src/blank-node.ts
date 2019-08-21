import { Term } from "./term";

export class BlankNode extends Term<"BlankNode"> {

  constructor(value: string) {
    super("BlankNode", value);
  }

  equals(other: Term): boolean {
    return !!(
      BlankNode.is(other) &&
      other.value === this.value
    );
  }

  static is(other?: unknown): other is BlankNode {
    if (!Term.is(other)) {
      return false;
    }
    return Term.is(other) && other.termType === "BlankNode";
  }

}
