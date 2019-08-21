import { Term, isTerm } from "./term";

export function isBlankNode(value: unknown): value is BlankNode {
  if (!isTerm(value)) {
    return false;
  }
  return value.termType === "BlankNode";
}

export class BlankNode extends Term<"BlankNode"> {

  constructor(value: string) {
    super("BlankNode", value);
  }

  equals(other: Term): boolean {
    return !!(
      isBlankNode(other) &&
      other.value === this.value
    );
  }

}
