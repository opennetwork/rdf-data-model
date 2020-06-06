import { isTerm, isTermLike, Term } from "./term";
import { isNamedNode, NamedNode } from "./named-node";
import { NamedNodeLike, isNamedNodeLike } from "./named-node";
import { hasKey } from "./has-key";

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

export interface Literal<Value extends string = string, Language extends string = string, DataType extends NamedNode = NamedNode> extends Term<"Literal", Value> {
  readonly language: Language;
  readonly datatype: DataType;

  equals(other: unknown): other is LiteralLike<Value>;
}

export class Literal<Value extends string = string, Language extends string = string, DataType extends NamedNode = NamedNode> extends Term<"Literal", Value> implements Literal<Value, Language, DataType> {

  constructor(value: Value, readonly language: Language, readonly datatype: DataType) {
    super("Literal", value);
  }

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
