import { isNamedNodeLike, NamedNode, NamedNodeImplementation, NamedNodeLike } from "./named-node";
import { isBlankNodeLike, BlankNode, BlankNodeLike, BlankNodeImplementation } from "./blank-node";
import { isLiteralLike, Literal, LiteralImplementation, LiteralLike } from "./literal";
import { isVariableLike, Variable, VariableImplementation, VariableLike } from "./variable";
import { isDefaultGraphLike, DefaultGraph, DefaultGraphLike, DefaultGraphImplementation } from "./default-graph";
import {
  isQuadLike,
  Quad,
  QuadGraphLike,
  QuadImplementation,
  QuadObjectLike,
  QuadPredicateLike,
  QuadSubjectLike
} from "./quad";
import { isTermLike } from "./term";
import UUID from "pure-uuid";

export type MappedTermLike<T = unknown> =
  T extends NamedNodeLike ? NamedNode :
  T extends BlankNodeLike ? BlankNode :
  T extends LiteralLike ? Literal :
  T extends VariableLike ? Variable :
  T extends DefaultGraphLike ? DefaultGraph :
  NamedNode | BlankNode | Literal | Variable | DefaultGraph;

export class DataFactory {

  namedNode = (value: string): NamedNode => {
    return new NamedNodeImplementation(value);
  };

  blankNode = (value?: string): BlankNode => {
    return new BlankNodeImplementation((value || `blank-${new UUID(4).format()}`).replace(/^_:/, ""));
  };

  literal = (value: string, languageOrDataType?: string | NamedNodeLike): Literal => {
    const getLiteral = (value: string, languageOrDataType?: string | NamedNodeLike): Literal => {
      if (typeof languageOrDataType === "string") {
        return new LiteralImplementation(value, languageOrDataType, this.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"));
      } else if (isNamedNodeLike(languageOrDataType)) {
        return new LiteralImplementation(value, "", this.fromTerm(languageOrDataType));
      } else {
        return new LiteralImplementation(value, "", this.namedNode("http://www.w3.org/2001/XMLSchema#string"));
      }
    };
    // "value"@en
    // "value"^^xsd:string
    // "value"@<language uri>
    const firstIndex = value.indexOf('"'),
      lastIndex = value.lastIndexOf('"');
    if (firstIndex === -1 || lastIndex === firstIndex) {
      return getLiteral(value, languageOrDataType);
    }
    const newValue = value.substr(firstIndex + 1, lastIndex - firstIndex - 1),
      rest = value.substr(lastIndex + 1);
    if (rest.startsWith("^^")) {
      return getLiteral(newValue, this.namedNode(rest.substr(2)));
    }
    if (rest.startsWith("@")) {
      const language = rest.substr(1);
      // If no language, its a normal string
      return getLiteral(newValue, language === "" ? undefined : language);
    }
    if (rest.startsWith("<") && rest.endsWith(">")) {
      return getLiteral(newValue, rest.substr(1, rest.length - 2));
    }
    return getLiteral(value, languageOrDataType);
  };

  variable = (value: string): Variable => {
    return new VariableImplementation(value.replace(/^\?/, ""));
  };

  defaultGraph = (): DefaultGraph => {
    return new DefaultGraphImplementation();
  };

  quad = (subject: QuadSubjectLike, predicate: QuadPredicateLike, object: QuadObjectLike, graph?: QuadGraphLike): Quad => {
    return new QuadImplementation(
      this.fromTerm(subject),
      this.fromTerm(predicate),
      this.fromTerm(object),
      this.fromTerm(graph)
    );
  };

  fromTerm = <T = unknown>(term: T): MappedTermLike<T> => {
    if (!isTermLike(term)) {
      throw new Error("Provided value is not a Term");
    }
    if (isNamedNodeLike(term)) {
      return this.namedNode(term.value) as MappedTermLike<T>;
    } else if (isBlankNodeLike(term)) {
      return this.blankNode(term.value) as MappedTermLike<T>;
    } else if (isLiteralLike(term)) {
      return this.literal(term.value, isNamedNodeLike(term.datatype) ? term.datatype : term.language) as MappedTermLike<T>;
    } else if (isVariableLike(term)) {
      return this.variable(term.value) as MappedTermLike<T>;
    } else if (isDefaultGraphLike(term)) {
      return this.defaultGraph() as MappedTermLike<T>;
    }
    // Unknown
    throw new Error("Invalid term type, expected one of NamedNode | BlankNode | Literal | Variable | DefaultGraph");
  };

  fromQuad = (quad: unknown): Quad => {
    if (!isQuadLike(quad)) {
      throw new Error("Provided value is not a Quad");
    }
    return this.quad(quad.subject, quad.predicate, quad.object, quad.graph);
  };

}

export const DefaultDataFactory = new DataFactory();
