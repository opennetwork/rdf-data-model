import { isTerm, isTermLike, Term, TermImplementation } from "./term";

export function isDefaultGraphLike(given: unknown): given is DefaultGraphLike {
  return isTermLike(given, "DefaultGraph", "");
}

export function isDefaultGraph(given: unknown): given is DefaultGraph {
  return isTerm(given, "DefaultGraph", "");
}

export interface DefaultGraph extends Term<"DefaultGraph", ""> {
  equals(other: unknown): other is DefaultGraphLike;
}

export class DefaultGraphImplementation extends TermImplementation<"DefaultGraph", ""> implements DefaultGraph {
  private static defaultGraph?: DefaultGraphImplementation;

  constructor() {
    super("DefaultGraph", "");
    // Singleton constructor
    if (!DefaultGraphImplementation.defaultGraph) {
      DefaultGraphImplementation.defaultGraph = this;
    }
    return DefaultGraphImplementation.defaultGraph;
  }

  equals(other: unknown): other is DefaultGraphLike {
    return isDefaultGraphLike(other);
  }
}

export type DefaultGraphLike = Pick<DefaultGraph, "termType" | "value">;
