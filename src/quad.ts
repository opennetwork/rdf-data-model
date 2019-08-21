import { Term, isTerm } from "./term";
import { BlankNode, isBlankNode } from "./blank-node";
import { NamedNode, isNamedNode } from "./named-node";
import { Variable, isVariable } from "./variable";
import { Literal, isLiteral } from "./literal";
import { DefaultGraph, isDefaultGraph } from "./default-graph";

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

export class Quad {

  readonly subject: QuadSubject;
  readonly predicate: QuadPredicate;
  readonly object: QuadObject;
  readonly graph: QuadGraph;

  constructor(subject: Term, predicate: Term, object: Term, graph: Term) {
    if (!isQuadSubject(subject)) {
      throw new Error("Invalid subject, expected NamedNode | BlankNode | Variable");
    }
    if (!isQuadPredicate(predicate)) {
      throw new Error("Invalid predicate, expected NamedNode | Variable");
    }
    if (!isQuadObject(object)) {
      throw new Error("Invalid object, expected NamedNode | Literal | BlankNode | Variable");
    }
    if (!isQuadGraph(graph)) {
      throw new Error("Invalid graph, expected DefaultGraph | NamedNode | BlankNode | Variable");
    }
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
