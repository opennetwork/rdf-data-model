import { Term, isTerm } from "./term";
import { BlankNode, BlankNodeLike, isBlankNode, isBlankNodeLike } from "./blank-node";
import { NamedNode, isNamedNode, NamedNodeLike, isNamedNodeLike } from "./named-node";
import { Variable, isVariable, VariableLike, isVariableLike } from "./variable";
import { Literal, isLiteral } from "./literal";
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

export function isQuad(value?: unknown): value is Quad {
  function isQuadInstance(value: unknown): value is Quad {
    return typeof value === "object";
  }
  if (!isQuadInstance(value)) {
    return false;
  }
  return (
    isQuadSubject(value.subject) &&
    isQuadPredicate(value.predicate) &&
    isQuadObject(value.object) &&
    isQuadGraph(value.graph)
  );
}

export type QuadSubject = NamedNode | BlankNode | Variable;
export type QuadPredicate = NamedNode | Variable;
export type QuadObject = NamedNode | Literal | BlankNode | Variable;
export type QuadGraph = DefaultGraph | NamedNode | BlankNode | Variable;
export type QuadSubjectLike = NamedNodeLike | BlankNodeLike | VariableLike;
export type QuadPredicateLike = NamedNodeLike | VariableLike;
export type QuadObjectLike = NamedNodeLike | Literal | BlankNodeLike | VariableLike;
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
  return isNamedNodeLike(value) || isLiteral(value) || isBlankNodeLike(value) || isVariableLike(value);
}

export function isQuadGraphLike(value?: unknown): value is QuadGraphLike {
  return isDefaultGraphLike(value) || isNamedNodeLike(value) || isBlankNodeLike(value) || isVariableLike(value);
}

export class Quad {

  readonly subject: QuadSubject;
  readonly predicate: QuadPredicate;
  readonly object: QuadObject;
  readonly graph: QuadGraph;

  constructor(subject: QuadSubject, predicate: QuadPredicate, object: QuadObject, graph: QuadGraph) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.graph = graph;
  }

  equals(other?: unknown): boolean {
    return !!(
      isQuad(other) &&
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
