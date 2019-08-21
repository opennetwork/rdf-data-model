import { Term } from "./term";
import { BlankNode } from "./blank-node";
import { NamedNode } from "./named-node";
import { Variable } from "./variable";
import { Literal } from "./literal";
import { DefaultGraph } from "./default-graph";

export type QuadSubject = NamedNode | BlankNode | Variable;
export type QuadPredicate = NamedNode | Variable;
export type QuadObject = NamedNode | Literal | BlankNode | Variable;
export type QuadGraph = DefaultGraph | NamedNode | BlankNode | Variable;

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

  equals(other: Quad): boolean {
    return !!(
      Quad.is(other) &&
      this.subject.equals(other.subject) &&
      this.predicate.equals(other.predicate) &&
      this.object.equals(other.object) &&
      this.graph.equals(other.graph)
    );
  }

  static is(other?: Quad): other is Quad {
    return !!other;
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
