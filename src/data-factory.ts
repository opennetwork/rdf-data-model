import { isNamedNode, NamedNode } from "./named-node";
import { BlankNode, isBlankNode } from "./blank-node";
import { isLiteral, Literal } from "./literal";
import { isVariable, Variable } from "./variable";
import { DefaultGraph, isDefaultGraph } from "./default-graph";
import { isQuad, Quad } from "./quad";
import { isTerm, Term } from "./term";
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
    } else if (isNamedNode(languageOrDataType)) {
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

  quad(subject: Term, predicate: Term, object: Term, graph?: Term): Quad {
    return new Quad(subject, predicate, object, graph || this.defaultGraph());
  }

  fromTerm(term: unknown): NamedNode | BlankNode | Literal | Variable | DefaultGraph {
    if (!isTerm(term)) {
      throw new Error("Provided value is not a Term");
    }
    if (isNamedNode(term)) {
      return this.namedNode(term.value);
    } else if (isBlankNode(term)) {
      return this.blankNode(term.value);
    } else if (isLiteral(term)) {
      return new Literal(term.value, term.language, term.datatype);
    } else if (isVariable(term)) {
      return new Variable(term.value);
    } else if (isDefaultGraph(term)) {
      return this.defaultGraph();
    }
    // Unknown
    throw new Error("Invalid term type, expected one of NamedNode | BlankNode | Literal | Variable | DefaultGraph");
  }

  fromQuad(quad: unknown): Quad {
    if (!isQuad(quad)) {
      throw new Error("Provided value is not a Quad");
    }
    return this.quad(
      this.fromTerm(quad.subject),
      this.fromTerm(quad.predicate),
      this.fromTerm(quad.object),
      this.fromTerm(quad.graph)
    );
  }

}

export const DefaultDataFactory = new DataFactory();
