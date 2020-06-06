import { isTerm, isTermLike, Term } from "./term";

export function isDefaultGraphLike(given: unknown): given is DefaultGraphLike {
  return isTermLike(given, "DefaultGraph", "");
}

export function isDefaultGraph(given: unknown): given is DefaultGraph {
  return isTerm(given, "DefaultGraph", "");
}

export interface DefaultGraph extends Term<"DefaultGraph", ""> {
  equals(other: unknown): other is DefaultGraphLike;
}

export class DefaultGraph extends Term<"DefaultGraph", ""> implements DefaultGraph {
  private static defaultGraph?: DefaultGraph;

  constructor() {
    super("DefaultGraph", "");
    // Singleton constructor
    if (!DefaultGraph.defaultGraph) {
      DefaultGraph.defaultGraph = this;
    }
    return DefaultGraph.defaultGraph;
  }

  equals(other: unknown): other is DefaultGraphLike {
    return isDefaultGraphLike(other);
  }
}

export type DefaultGraphLike = Pick<DefaultGraph, "termType" | "value">;
