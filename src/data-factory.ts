import { NamedNode } from "./named-node";
import { BlankNode } from "./blank-node";
import { Literal } from "./literal";
import { Variable } from "./variable";
import { DefaultGraph } from "./default-graph";
import { Quad, QuadGraph, QuadObject, QuadPredicate, QuadSubject } from "./quad";
import { Term } from "./term";
import UUID from "pure-uuid";

export class DataFactory {

  namedNode(value: string): NamedNode {
    return new NamedNode(value);
  }

  blankNode(value?: string): BlankNode {
    return new BlankNode(value || `_:b-${new UUID(4).format()}`);
  }

  literal(value: string, languageOrDataType?: string | NamedNode): Literal {
    if (typeof languageOrDataType === "string") {
      return new Literal(value, languageOrDataType, this.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"));
    } else if (NamedNode.is(languageOrDataType)) {
      return new Literal(value, "", languageOrDataType);
    } else {
      return new Literal(value, "", this.namedNode("http://www.w3.org/2001/XMLSchema#string"));
    }
  }

  variable(value: string): Variable {
    return new Variable(value);
  }

  defaultGraph(): DefaultGraph {
    return new DefaultGraph();
  }

  quad(subject: QuadSubject, predicate: QuadPredicate, object: QuadObject, graph?: QuadGraph): Quad {
    return new Quad(subject, predicate, object, graph || this.defaultGraph());
  }

  fromTerm(term: Term): Term {
    if (NamedNode.is(term)) {
      return this.namedNode(term.value);
    } else if (BlankNode.is(term)) {
      return this.blankNode(term.value);
    } else if (Literal.is(term)) {
      return new Literal(term.value, term.language, term.datatype);
    } else if (Variable.is(term)) {
      return new Variable(term.value);
    } else if (DefaultGraph.is(term)) {
      return this.defaultGraph();
    }
    // Unknown
    return term;
  }

  fromQuad(quad: Quad): Quad {
    return this.quad(quad.subject, quad.predicate, quad.object, quad.graph);
  }

}

export const DefaultDataFactory = new DataFactory();
