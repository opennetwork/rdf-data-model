import { BlankNode, BlankNodeLike, isBlankNode, isBlankNodeLike } from "./blank-node";
import { NamedNode, isNamedNode, NamedNodeLike, isNamedNodeLike } from "./named-node";
import { Variable, isVariable, VariableLike, isVariableLike } from "./variable";
import { Literal, isLiteral, LiteralLike, isLiteralLike } from "./literal";
import { DefaultGraph, DefaultGraphLike, isDefaultGraph, isDefaultGraphLike } from "./default-graph";
import { hasKey } from "./has-key";

export function isQuadLike(given: unknown): given is QuadLike {
  return (
    hasKey(given, "subject") &&
    hasKey(given, "predicate") &&
    hasKey(given, "object") &&
    hasKey(given, "graph") &&
    isQuadSubjectLike(given.subject) &&
    isQuadPredicateLike(given.predicate) &&
    isQuadObjectLike(given.object) &&
    isQuadGraphLike(given.graph)
  );
}

export function isQuad(given?: unknown): given is Quad {
  function isQuadInstance(given: unknown): given is Partial<Record<keyof Quad, unknown>> {
    return typeof given === "object";
  }
  if (!isQuadInstance(given)) {
    return false;
  }
  return (
    isQuadSubject(given.subject) &&
    isQuadPredicate(given.predicate) &&
    isQuadObject(given.object) &&
    isQuadGraph(given.graph)
  );
}

export type QuadSubject = NamedNode | BlankNode | Variable;
export type QuadPredicate = NamedNode | Variable;
export type QuadObject = NamedNode | Literal | BlankNode | Variable;
export type QuadGraph = DefaultGraph | NamedNode | BlankNode | Variable;
export type QuadSubjectLike = NamedNodeLike | BlankNodeLike | VariableLike;
export type QuadPredicateLike = NamedNodeLike | VariableLike;
export type QuadObjectLike = NamedNodeLike | LiteralLike | BlankNodeLike | VariableLike;
export type QuadGraphLike = DefaultGraphLike | NamedNodeLike | BlankNodeLike | VariableLike;

export function isQuadSubject(value?: unknown): value is QuadSubject {
  return isNamedNode(value) || isBlankNode(value) || isVariable(value);
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
  return isNamedNodeLike(value) || isBlankNodeLike(value) || isVariableLike(value);
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

export interface Quad<S extends QuadSubject = QuadSubject, P extends QuadPredicate = QuadPredicate, O extends QuadObject = QuadObject, G extends QuadGraph = QuadGraph> {
  readonly subject: S;
  readonly predicate: P;
  readonly object: O;
  readonly graph: G;

  equals(other?: unknown): other is QuadLike;
}

export class Quad<S extends QuadSubject = QuadSubject, P extends QuadPredicate = QuadPredicate, O extends QuadObject = QuadObject, G extends QuadGraph = QuadGraph> implements Quad<S, P, O, G> {

  constructor(readonly subject: S, readonly predicate: P, readonly object: O, readonly graph: G) {
    
  }

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
      subject: this.subject,
      predicate: this.predicate,
      object: this.object,
      graph: this.graph
    };
  }

}

export type QuadLike = {
  subject: QuadSubjectLike;
  predicate: QuadPredicateLike;
  object: QuadObjectLike;
  graph: QuadGraphLike;
};
