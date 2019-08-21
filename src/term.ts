export class Term<TermType extends string = string, Value extends string = string> {

  readonly termType: TermType;
  readonly value: Value;

  protected constructor(termType: TermType, value: Value) {
    this.termType = termType;
    this.value = value;
  }

  equals(other?: unknown): boolean {
    return (
      Term.is(other) &&
      this.termType === other.termType &&
      this.value == other.value
    );
  }

  static is(other?: unknown): other is Term {
    if (typeof other !== "object") {
      return false;
    }
    const asAny: any = other;
    return typeof asAny["termType"] === "string" && typeof asAny["value"] === "string";
  }

  toJSON(): object {
    return {
      termType: this.termType,
      value: this.value
    };
  }

}
