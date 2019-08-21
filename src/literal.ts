import { Term } from "./term";
import { NamedNode } from "./named-node";

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
      Literal.is(other) &&
      other.value === this.value &&
      other.language === this.language &&
      other.datatype.equals(this.datatype)
    );
  }

  static is(other?: Term): other is Literal {
    return Term.is(other) && other.termType === "Literal";
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
