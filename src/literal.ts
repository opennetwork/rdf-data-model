import { isTerm, isTermLike, Term } from "./term";
import { isNamedNode, NamedNode } from "./named-node";
import { NamedNodeLike, isNamedNodeLike } from "./named-node";
import { hasKey } from "./has-key";
import { DefaultDataFactory } from "./data-factory";

export function isLiteralLike<Value extends string = string>(given: unknown, value?: Value): given is LiteralLike<Value> {
  return (
    isTermLike(given, "Literal", value) &&
    hasKey(given, "language") &&
    typeof given.language === "string" &&
    (
      !hasKey(given, "datatype") ||
      (
        hasKey(given, "datatype") &&
        !given.datatype
      ) ||
      (
        hasKey(given, "datatype") &&
        isNamedNodeLike(given.datatype)
      )
    )
  );
}

export function isLiteral<Value extends string = string>(given: unknown, value?: Value): given is Literal<Value> {
  return (
    isTerm(given, "Literal", value) &&
    hasKey(given, "language") &&
    typeof given.language === "string" &&
    (
      !hasKey(given, "datatype") ||
      (
        hasKey(given, "datatype") &&
        !given.datatype
      ) ||
      (
        hasKey(given, "datatype") &&
        isNamedNode(given.datatype)
      )
    )
  );
}

export function assertLiteralLike<V extends string>(given: unknown, value: V, languageOrDataType?: string | NamedNodeLike): asserts given is LiteralLike<V> {
  if (!isLiteralLike(given, value)) {
    const error: Error & { value?: unknown, given?: unknown, languageOrDataType?: unknown } = new Error("Expected Literal");
    error.value = value;
    error.given = given;
    error.languageOrDataType = languageOrDataType;
    throw error;
  }
  if (typeof languageOrDataType === "string") {
    if (languageOrDataType !== given.language) {
      const error: Error & { value?: unknown, given?: unknown, language?: unknown } = new Error("Expected Literal language to match");
      error.value = value;
      error.given = given;
      error.language = languageOrDataType;
      throw error;
    }
  } else if (isNamedNodeLike(languageOrDataType)) {
    if (!DefaultDataFactory.fromTerm(languageOrDataType).equals(given.datatype)) {
      const error: Error & { value?: unknown, given?: unknown, datatype?: unknown } = new Error("Expected Literal datatype to match");
      error.value = value;
      error.given = given;
      error.datatype = languageOrDataType;
      throw error;
    }
  }
}

export function assertLiteral<V extends string, L extends string>(given: unknown, value: V, language: L): asserts given is Literal<V, L>;
export function assertLiteral<V extends string, N extends NamedNode>(given: unknown, value: V, dataType: N): asserts given is Literal<V, "", N>;
export function assertLiteral<V extends string>(given: unknown, value: V, languageOrDataType?: string | NamedNodeLike): asserts given is Literal<V>;
export function assertLiteral(given: unknown, value: string, languageOrDataType?: string | NamedNodeLike): asserts given is Literal;
export function assertLiteral<Value extends string = string>(given: unknown, value?: Value, languageOrDataType?: string | NamedNodeLike): asserts given is Literal<Value> {
  if (!isLiteral(given, value)) {
    const error: Error & { value?: unknown, given?: unknown, languageOrDataType?: unknown } = new Error("Expected Literal");
    error.value = value;
    error.given = given;
    error.languageOrDataType = languageOrDataType;
    throw error;
  }
  assertLiteralLike(given, value);
}

export interface Literal<Value extends string = string, Language extends string = string, DataType extends NamedNode = NamedNode> extends Term<"Literal", Value> {
  readonly language: Language;
  readonly datatype: DataType;

  equals(other: Literal): other is Literal<Value>;
  equals(other: unknown): other is LiteralLike<Value>;
}

export class Literal<Value extends string = string, Language extends string = string, DataType extends NamedNode = NamedNode> extends Term<"Literal", Value> implements Literal<Value, Language, DataType> {

  constructor(value: Value, readonly language: Language, readonly datatype: DataType) {
    super("Literal", value);
  }

  equals(other: Literal): other is Literal<Value>;
  equals(other: unknown): other is LiteralLike<Value>;
  equals(other: unknown): other is LiteralLike<Value> {
    return (
      isLiteralLike(other, this.value) &&
      this.language === this.language &&
      (
        (!this.datatype && !other.datatype) ||
        (this.datatype && this.datatype.equals(other.datatype))
      )
    );
  }

  toJSON() {
    return {
      termType: this.termType,
      value: this.value,
      language: this.language,
      datatype: this.datatype
    };
  }

}

export type LiteralLike<Value extends string = string> = Pick<Literal<Value>, "termType" | "value" | "language"> & {
  datatype?: NamedNodeLike;
};
