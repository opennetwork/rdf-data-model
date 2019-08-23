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
        isNamedNodeLike(given)
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
        isNamedNode(given)
      )
    )
  );
}

export class Literal<Value extends string = string> extends Term<"Literal", Value> {

  readonly language: string;
  readonly datatype?: NamedNode;

  constructor(value: Value, language: string, datatype: NamedNode) {
    super("Literal", value);
    this.language = language || "";
    this.datatype = datatype;
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
