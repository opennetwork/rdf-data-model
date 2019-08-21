import { Term } from "./term";

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
      DefaultGraph.is(other) &&
      other.value === this.value
    );
  }

  static is(other?: Term): other is DefaultGraph {
    return Term.is(other) && other.termType === "DefaultGraph";
  }

}
