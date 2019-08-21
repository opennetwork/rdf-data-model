import { Term, isTerm } from "./term";

export function isNamedNode(value: unknown): value is NamedNode {
  if (!isTerm(value)) {
    return false;
  }
  return value.termType === "NamedNode";
}

export class NamedNode extends Term<"NamedNode"> {

  constructor(value: string) {
    super("NamedNode", value);
  }

  equals(other: Term): boolean {
    return !!(
      isNamedNode(other) &&
      other.value === this.value
    );
  }

}
