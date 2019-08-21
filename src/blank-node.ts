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

  static is(other?: Term): other is BlankNode {
    return Term.is(other) && other.termType === "BlankNode";
  }

}
