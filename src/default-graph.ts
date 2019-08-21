import { isTerm, Term } from "./term";

export function isDefaultGraph(value?: unknown): value is DefaultGraph {
  if (!isTerm(value)) {
    return false;
  }
  return value.termType === "DefaultGraph";
}

export class DefaultGraph extends Term<"DefaultGraph"> {

  private static defaultGraph?: DefaultGraph;

  constructor() {
    super("DefaultGraph", "");
    if (!DefaultGraph.defaultGraph) {
      DefaultGraph.defaultGraph = this;
    }
    return DefaultGraph.defaultGraph;
  }

  equals(other: Term): boolean {
    return !!(
      isDefaultGraph(other) &&
      other.value === this.value
    );
  }

}
