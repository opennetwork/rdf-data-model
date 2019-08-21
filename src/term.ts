export function isTerm(value?: unknown): value is Term {
  if (typeof value !== "object") {
    return false;
  }
  const asAny: any = value;
  return typeof asAny["termType"] === "string" && typeof asAny["value"] === "string";
}

export class Term<TermType extends string = string, Value extends string = string> {

  readonly termType: TermType;
  readonly value: Value;

  protected constructor(termType: TermType, value: Value) {
    this.termType = termType;
    this.value = value;
  }

  // This is here as a default, if the class has more than these
  // two properties, it MUST follow its own path equality
  equals(other?: unknown): boolean {
    return (
      isTerm(other) &&
      this.termType === other.termType &&
      this.value == other.value
    );
  }

  toJSON(): object {
    return {
      termType: this.termType,
      value: this.value
    };
  }

}
