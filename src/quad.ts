import { BlankNode, BlankNodeLike, isBlankNode, isBlankNodeLike } from "./blank-node";
import { NamedNode, isNamedNode, NamedNodeLike, isNamedNodeLike } from "./named-node";
import { Variable, isVariable, VariableLike, isVariableLike } from "./variable";
import { Literal, isLiteral, LiteralLike, isLiteralLike } from "./literal";
import { DefaultGraph, DefaultGraphLike, isDefaultGraph, isDefaultGraphLike } from "./default-graph";
import { hasKey } from "./has-key";
import { Term, TermLike } from "./term";
import { DefaultDataFactory } from "./data-factory";

export function isQuadLike(given: unknown): given is QuadLike {
  return (
    hasKey(given, "termType") &&
    hasKey(given, "subject") &&
    hasKey(given, "predicate") &&
    hasKey(given, "object") &&
    hasKey(given, "graph") &&
    given.termType === "Quad" &&
    isQuadSubjectLike(given.subject) &&
    isQuadPredicateLike(given.predicate) &&
    isQuadObjectLike(given.object) &&
    isQuadGraphLike(given.graph)
  );
}

export function isQuad(given?: unknown): given is Quad {
  function isQuadInstance(given: unknown): given is Partial<Record<keyof Quad, unknown>> {
    return !!given;
  }
  if (!isQuadInstance(given)) {
    return false;
  }
  function hasEqualsLike(given: unknown): given is { equals: unknown } {
    return !!given;
  }
  function hasEquals(given: unknown): given is { equals(): unknown } {
    return hasEqualsLike(given) && typeof given.equals === "function";
  }
  return (
    given.termType === "Quad" &&
    isQuadSubject(given.subject) &&
    isQuadPredicate(given.predicate) &&
    isQuadObject(given.object) &&
    isQuadGraph(given.graph) &&
    hasEquals(given)
  );
}

export function assertQuadMatch(given: QuadLike, subject?: QuadSubjectLike, predicate?: QuadPredicateLike, object?: QuadObjectLike, graph?: QuadGraphLike): asserts given is QuadLike {
  if (subject && !DefaultDataFactory.fromTerm(subject).equals(given.subject)) {
    const error: Error & { value?: unknown, given?: unknown, subject?: unknown } = new Error("Expected subject to match");
    error.given = given;
    error.subject = subject;
    throw error;
  }
  if (predicate && !DefaultDataFactory.fromTerm(predicate).equals(given.predicate)) {
    const error: Error & { value?: unknown, given?: unknown, subject?: unknown, predicate?: unknown } = new Error("Expected predicate to match");
    error.given = given;
    error.subject = subject;
    error.predicate = predicate;
    throw error;
  }
  if (object && !DefaultDataFactory.fromTerm(object).equals(given.object)) {
    const error: Error & { value?: unknown, given?: unknown, subject?: unknown, predicate?: unknown, object?: unknown } = new Error("Expected object to match");
    error.given = given;
    error.subject = subject;
    error.predicate = predicate;
    error.object = object;
    throw error;
  }
  if (graph && !DefaultDataFactory.fromTerm(graph).equals(given.graph)) {
    const error: Error & { value?: unknown, given?: unknown, subject?: unknown, predicate?: unknown, object?: unknown, graph?: unknown } = new Error("Expected graph to match");
    error.given = given;
    error.subject = subject;
    error.predicate = predicate;
    error.object = object;
    error.graph = graph;
    throw error;
  }
}

export function assertQuadLike(given: unknown, subject?: QuadSubjectLike, predicate?: QuadPredicateLike, object?: QuadObjectLike, graph?: QuadGraphLike): asserts given is QuadLike {
  if (!isQuadLike(given)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected Quad");
    error.given = given;
    throw error;
  }
  assertQuadMatch(given, subject, predicate, object, graph);
}

export function assertQuad(given: unknown, subject?: QuadSubjectLike, predicate?: QuadPredicateLike, object?: QuadObjectLike, graph?: QuadGraphLike): asserts given is Quad {
  if (!isQuad(given)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected Quad");
    error.given = given;
    throw error;
  }
  assertQuadMatch(given, subject, predicate, object, graph);
}

export type QuadSubject = NamedNode | BlankNode | Variable | Quad;
export type QuadPredicate = NamedNode | Variable;
export type QuadObject = NamedNode | Literal | BlankNode | Variable;
export type QuadGraph = DefaultGraph | NamedNode | BlankNode | Variable;
export type QuadSubjectLike = NamedNodeLike | BlankNodeLike | VariableLike | QuadLike;
export type QuadPredicateLike = NamedNodeLike | VariableLike;
export type QuadObjectLike = NamedNodeLike | LiteralLike | BlankNodeLike | VariableLike;
export type QuadGraphLike = DefaultGraphLike | NamedNodeLike | BlankNodeLike | VariableLike;

export function isQuadSubject(value?: unknown): value is QuadSubject {
  return isNamedNode(value) || isBlankNode(value) || isVariable(value) || isQuad(value);
}

export function isQuadPredicate(value?: unknown): value is QuadPredicate {
  return isNamedNode(value) || isVariable(value);
}

export function isQuadObject(value?: unknown): value is QuadObject {
  return isNamedNode(value) || isLiteral(value) || isBlankNode(value) || isVariable(value);
}

export function isQuadGraph(value?: unknown): value is QuadGraph {
  return isDefaultGraph(value) || isNamedNode(value) || isBlankNode(value) || isVariable(value);
}

export function isQuadSubjectLike(value?: unknown): value is QuadSubjectLike {
  return isNamedNodeLike(value) || isBlankNodeLike(value) || isVariableLike(value) || isQuadLike(value);
}

export function isQuadPredicateLike(value?: unknown): value is QuadPredicateLike {
  return isNamedNodeLike(value) || isVariableLike(value);
}

export function isQuadObjectLike(value?: unknown): value is QuadObjectLike {
  return isNamedNodeLike(value) || isLiteralLike(value) || isBlankNodeLike(value) || isVariableLike(value);
}

export function isQuadGraphLike(value?: unknown): value is QuadGraphLike {
  return isDefaultGraphLike(value) || isNamedNodeLike(value) || isBlankNodeLike(value) || isVariableLike(value);
}

export interface Quad<S extends QuadSubject = QuadSubject, P extends QuadPredicate = QuadPredicate, O extends QuadObject = QuadObject, G extends QuadGraph = QuadGraph> extends Term<"Quad", ""> {
  readonly subject: S;
  readonly predicate: P;
  readonly object: O;
  readonly graph: G;

  equals(other: Quad): other is Quad<S, P, O, G>;
  equals(other: unknown): other is TermLike<"Quad", ""> & QuadLike;
  equals(other?: unknown): other is QuadLike;
}

export class Quad<S extends QuadSubject = QuadSubject, P extends QuadPredicate = QuadPredicate, O extends QuadObject = QuadObject, G extends QuadGraph = QuadGraph> extends Term<"Quad", ""> implements Quad<S, P, O, G> {

  readonly termType = "Quad";
  readonly value = "";

  constructor(readonly subject: S, readonly predicate: P, readonly object: O, readonly graph: G) {
    super("Quad", "");
  }

  equals(other: Quad): other is Quad<S, P, O, G>;
  equals(other: unknown): other is TermLike<"Quad", ""> & QuadLike;
  equals(other: unknown): other is QuadLike;
  equals(other: unknown): other is QuadLike {
    return !!(
      isQuadLike(other) &&
      this.subject.equals(other.subject) &&
      this.predicate.equals(other.predicate) &&
      this.object.equals(other.object) &&
      this.graph.equals(other.graph)
    );
  }

  toJSON() {
    return {
      termType: this.termType,
      value: this.value,
      subject: this.subject,
      predicate: this.predicate,
      object: this.object,
      graph: this.graph
    };
  }

}

export type QuadLike = Pick<Quad, "termType" | "subject" | "predicate" | "object" | "graph" | "value">;
