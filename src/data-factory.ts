import {
  assertNamedNodeLike,
  isNamedNode,
  isNamedNodeLike,
  NamedNode,
  NamedNodeLike
} from "./named-node";
import {
  isBlankNodeLike,
  BlankNode,
  BlankNodeLike,
  isBlankNode,
  assertBlankNodeLike
} from "./blank-node";
import { assertLiteralLike, isLiteral, isLiteralLike, Literal, LiteralLike } from "./literal";
import { assertVariableLike, isVariable, isVariableLike, Variable, VariableLike } from "./variable";
import {
  isDefaultGraphLike,
  DefaultGraph,
  DefaultGraphLike,
  isDefaultGraph,
  assertDefaultGraphLike
} from "./default-graph";
import {
  isQuadLike,
  Quad,
  QuadGraph,
  QuadGraphLike,
  QuadLike,
  QuadObject,
  QuadPredicate,
  QuadSubject,
  QuadObjectLike,
  QuadPredicateLike,
  QuadSubjectLike,
  assertQuadLike
} from "./quad";
import { isTermLike } from "./term";
import UUID from "pure-uuid";
import { isQuad } from "./quad";

export interface DataFactory {
  namedNode<Value extends string>(value: Value): NamedNode<Value>;
  blankNode(value?: string): BlankNode;
  literal<V extends string, L extends string>(value: V, language: L): Literal<V, L>;
  literal<V extends string, N extends NamedNode>(value: V, dataType: N): Literal<V, "", N>;
  literal<V extends string>(value: V, languageOrDataType?: string | NamedNodeLike): Literal<V>;
  literal(value: string, languageOrDataType?: string | NamedNodeLike): Literal;
  variable(value: string): Variable;
  defaultGraph(): DefaultGraph;
  quad(subject: QuadSubjectLike, predicate: QuadPredicateLike, object: QuadObjectLike): Quad<QuadSubject, QuadPredicate, QuadObject, DefaultGraph>;
  quad(subject: QuadSubjectLike, predicate: QuadPredicateLike, object: QuadObjectLike, graph?: QuadGraphLike): Quad;
  fromTerm<T extends NamedNodeLike>(term: T): NamedNode;
  fromTerm<T extends BlankNodeLike>(term: T): BlankNode;
  fromTerm<T extends LiteralLike>(term: T): Literal;
  fromTerm<T extends VariableLike>(term: T): Variable;
  fromTerm<T extends DefaultGraphLike>(term: T): DefaultGraph;
  fromTerm<T extends QuadLike>(term: T): Quad;
  fromTerm<T extends QuadPredicateLike>(term: T): QuadPredicate;
  fromTerm<T extends QuadSubjectLike>(term: T): QuadSubject;
  fromTerm<T extends QuadObjectLike>(term: T): QuadObject;
  fromTerm<T extends QuadGraphLike>(term: T): QuadGraph;
  fromTerm(term: unknown): NamedNode | BlankNode | Literal | Variable | DefaultGraph | Quad;
  fromQuad(quad: unknown): Quad;
}

export class DataFactory {

  constructor() {
    this.fromTerm = this.fromTerm.bind(this);
    this.namedNode = this.namedNode.bind(this);
    this.quad = this.quad.bind(this);
    this.literal = this.literal.bind(this);
  }

  namedNode<Value extends string>(value: Value): NamedNode<Value> {
    return new NamedNode(value);
  }

  blankNode = (value?: string): BlankNode => {
    return new BlankNode((value || `blank-${new UUID(4).format()}`).replace(/^_:/, ""));
  };

  literal<V extends string, L extends string>(value: V, language: L): Literal<V, L>;
  literal<V extends string, N extends NamedNode>(value: V, dataType: N): Literal<V, "", N>;
  literal<V extends string>(value: V, languageOrDataType?: string | NamedNodeLike): Literal<V>;
  literal(value: string, languageOrDataType?: string | NamedNodeLike): Literal;
  literal(value: string, languageOrDataType?: string | NamedNodeLike): Literal {
    const getLiteral = (value: string, languageOrDataType?: string | NamedNodeLike): Literal => {
      if (typeof languageOrDataType === "string") {
        return new Literal(value, languageOrDataType, this.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"));
      } else if (isNamedNodeLike(languageOrDataType)) {
        return new Literal(value, "", this.fromTerm(languageOrDataType));
      } else {
        return new Literal(value, "", this.namedNode("http://www.w3.org/2001/XMLSchema#string"));
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
  }

  variable = (value: string): Variable => {
    return new Variable(value.replace(/^\?/, ""));
  };

  defaultGraph = (): DefaultGraph => {
    return new DefaultGraph();
  };

  quad(subject: QuadSubjectLike, predicate: QuadPredicateLike, object: QuadObjectLike): Quad<QuadSubject, QuadPredicate, QuadObject, DefaultGraph>;
  quad(subject: QuadSubjectLike, predicate: QuadPredicateLike, object: QuadObjectLike, graph?: QuadGraphLike): Quad;
  quad(subject: QuadSubjectLike, predicate: QuadPredicateLike, object: QuadObjectLike, graph?: QuadGraphLike): Quad {
    return new Quad(
      this.fromTerm(subject),
      this.fromTerm(predicate),
      this.fromTerm(object),
      this.fromTerm(graph ?? this.defaultGraph())
    );
  }

  fromTerm<T extends NamedNodeLike>(term: T): NamedNode;
  fromTerm<T extends BlankNodeLike>(term: T): BlankNode;
  fromTerm<T extends LiteralLike>(term: T): Literal;
  fromTerm<T extends VariableLike>(term: T): Variable;
  fromTerm<T extends DefaultGraphLike>(term: T): DefaultGraph;
  fromTerm<T extends QuadLike>(term: T): Quad;
  fromTerm<T extends QuadPredicateLike>(term: T): QuadPredicate;
  fromTerm<T extends QuadSubjectLike>(term: T): QuadSubject;
  fromTerm<T extends QuadObjectLike>(term: T): QuadObject;
  fromTerm<T extends QuadGraphLike>(term: T): QuadGraph;
  fromTerm(term: unknown): NamedNode | BlankNode | Literal | Variable | DefaultGraph | Quad;
  fromTerm(term: unknown): NamedNode | BlankNode | Literal | Variable | DefaultGraph | Quad {
    if (!isTermLike(term)) {
      throw new Error("Provided value is not a Term");
    }
    if (isNamedNode(term)) {
      return term;
    } else if (isNamedNodeLike(term)) {
      return this.namedNode(term.value);
    } else if (isBlankNode(term)) {
      return term;
    } else if (isBlankNodeLike(term)) {
      return this.blankNode(term.value);
    } else if (isLiteral(term)) {
      return term;
    } else if (isLiteralLike(term)) {
      // Use direct map as the way `literal` is defined it may drop language or datatype
      // This allows _both_ language and datatype
      return new Literal(
        term.value,
        term.language,
        this.namedNode(term.datatype.value)
      );
    } else if (isVariable(term)) {
      return term;
    } else if (isVariableLike(term)) {
      return this.variable(term.value);
    } else if (isDefaultGraph(term)) {
      return term;
    } else if (isDefaultGraphLike(term)) {
      return this.defaultGraph();
    } if (isQuad(term)) {
      return term;
    } else if (isQuadLike(term)) {
      return this.quad(term.subject, term.predicate, term.object, term.graph);
    }
    // Unknown
    throw new Error("Invalid term type, expected one of NamedNode | BlankNode | Literal | Variable | DefaultGraph | Quad");
  }

  fromQuad = (quad: unknown): Quad => {
    if (!isQuadLike(quad)) {
      throw new Error("Provided value is not a Quad");
    }
    return this.quad(quad.subject, quad.predicate, quad.object, quad.graph);
  };

}

export const DefaultDataFactory = new DataFactory();

export function isDataFactory(factory: unknown): factory is DataFactory {
  function isDataFactoryIshMaybe(factory: unknown): factory is Partial<DataFactory> {
    return !!factory;
  }
  function isDataFactoryIsh(factory: unknown): factory is DataFactory {
    if (!isDataFactoryIshMaybe(factory)) {
      return false;
    }
    return (
      typeof factory.namedNode === "function" &&
      typeof factory.blankNode === "function" &&
      typeof factory.literal === "function" &&
      typeof factory.variable === "function" &&
      typeof factory.defaultGraph === "function" &&
      typeof factory.quad === "function" &&
      typeof factory.fromTerm === "function" &&
      typeof factory.fromQuad === "function"
    );
  }
  if (!isDataFactoryIsh(factory)) {
    throw new Error("Factory does not have all required methods");
  }
  try {
    assertDataFactory(factory);
    return true;
  } catch {
    return false;
  }
}

export function assertDataFactory(factory: DataFactory = DefaultDataFactory): asserts factory is DataFactory {
  const namedNode = factory.namedNode("");
  assertNamedNodeLike(namedNode, "");
  const blankNode = factory.blankNode();
  assertBlankNodeLike(blankNode);
  const blankNodeValue = factory.blankNode("some value");
  assertBlankNodeLike(blankNodeValue, "some value");
  const literal = factory.literal("");
  assertLiteralLike(literal, "");
  const literalLanguage = factory.literal("", "en");
  assertLiteralLike(literalLanguage, "", "en");
  const literalDataType = factory.literal("", {
    value: "number maybe?",
    termType: "NamedNode"
  });
  assertLiteralLike(literalDataType, "", {
    value: "number maybe?",
    termType: "NamedNode"
  });
  const variable = factory.variable("variable");
  assertVariableLike(variable, "variable");
  const defaultGraph = factory.defaultGraph();
  assertDefaultGraphLike(defaultGraph);
  const quad = factory.quad(
    namedNode,
    namedNode,
    blankNode,
    defaultGraph
  );
  assertQuadLike(quad);
  const quadDefaultGraph = factory.quad(
    namedNode,
    namedNode,
    blankNode
  );
  assertQuadLike(quadDefaultGraph, namedNode, namedNode, blankNode, defaultGraph);

  ok(factory.fromTerm(namedNode).equals(namedNode));
  ok(factory.fromTerm(blankNode).equals(blankNode));
  ok(factory.fromTerm(blankNodeValue).equals(blankNodeValue));
  ok(factory.fromTerm(defaultGraph).equals(defaultGraph));
  ok(factory.fromTerm(variable).equals(variable));
  ok(factory.fromTerm(literal).equals(literal));
  ok(factory.fromTerm(literalLanguage).equals(literalLanguage));
  ok(factory.fromTerm(literalDataType).equals(literalDataType));
  ok(factory.fromQuad(quad).equals(quad));
  ok(factory.fromQuad(quadDefaultGraph).equals(quadDefaultGraph));

  function ok(value: unknown, message?: string): asserts value {
    if (!value) {
      throw new Error(message ?? "Expected truthy");
    }
  }
}
