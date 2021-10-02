import { isTerm, isTermLike, Term } from "./term";

export function isDefaultGraphLike(given: unknown): given is DefaultGraphLike {
  return isTermLike(given, "DefaultGraph", "");
}

export function isDefaultGraph(given: unknown): given is DefaultGraph {
  return isTerm(given, "DefaultGraph", "");
}

export function assertDefaultGraphLike(given: unknown): asserts given is DefaultGraphLike {
  if (!isDefaultGraphLike(given)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected DefaultGraph");
    error.given = given;
    throw error;
  }
}

export function assertDefaultGraph(given: unknown): asserts given is DefaultGraph {
  if (!isDefaultGraph(given)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected DefaultGraph");
    error.given = given;
    throw error;
  }
}

export interface DefaultGraph extends Term<"DefaultGraph", ""> {
  equals(other: DefaultGraph): other is DefaultGraph;
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

  equals(other: DefaultGraph): other is DefaultGraph;
  equals(other: unknown): other is DefaultGraphLike;
  equals(other: unknown): other is DefaultGraphLike {
    return isDefaultGraphLike(other);
  }
}

export type DefaultGraphLike = Pick<DefaultGraph, "termType" | "value">;
