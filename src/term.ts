export abstract class Term<TermType extends string = string, Value extends string = string> {

  readonly termType: TermType;
  readonly value: Value;

  protected constructor(termType: TermType, value: Value) {
    this.termType = termType;
    this.value = value;
  }

  abstract equals(other?: Term): boolean;

  static is(other?: Term): other is Term {
    return other && typeof other.termType === "string";
  }

  toJSON(): object {
    return {
      termType: this.termType,
      value: this.value
    };
  }

}
