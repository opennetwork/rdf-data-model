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

  constructor(subject: Term, predicate: Term, object: Term, graph: Term) {
    if (!(NamedNode.is(subject) || BlankNode.is(subject) || Variable.is(subject))) {
      throw new Error("Invalid subject, expected NamedNode | BlankNode | Variable");
    }
    if (!(NamedNode.is(predicate) || Variable.is(predicate))) {
      throw new Error("Invalid predicate, expected NamedNode | Variable");
    }
    if (!(NamedNode.is(object) || Literal.is(object) || BlankNode.is(object) || Variable.is(object))) {
      throw new Error("Invalid object, expected NamedNode | Literal | BlankNode | Variable");
    }
    if (!(DefaultGraph.is(graph) || NamedNode.is(graph) || BlankNode.is(graph) || Variable.is(graph))) {
      throw new Error("Invalid object, expected DefaultGraph | NamedNode | BlankNode | Variable");
    }
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

  static is(other?: unknown): other is Quad {
    if (typeof other !== "object") {
      return false;
    }
    const asAny: any = other;
    return !!(
      Term.is(asAny["subject"]) &&
      Term.is(asAny["predicate"]) &&
      Term.is(asAny["object"]) &&
      Term.is(asAny["graph"])
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
