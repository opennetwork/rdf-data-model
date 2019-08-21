import { isTerm, Term } from "./term";
import { NamedNode } from "./named-node";

export function isLiteral(value?: unknown): value is Literal {
  if (!isTerm(value)) {
    return false;
  }
  return value.termType === "Literal";
}

export class Literal extends Term<"Literal"> {

  readonly language: string;
  readonly datatype?: NamedNode;

  constructor(value: string, language: string, datatype: NamedNode) {
    super("Literal", value);
    this.language = language || "";
    this.datatype = datatype;
  }

  equals(other: Term): boolean {
    return !!(
      isLiteral(other) &&
      other.value === this.value &&
      other.language === this.language &&
      other.datatype.equals(this.datatype)
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
