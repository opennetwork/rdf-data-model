export function isTerm(value?: unknown): value is Term {
  function isTermInstance(value: unknown): value is Term {
    return typeof value === "object";
  }
  if (!isTermInstance(value)) {
    return false;
  }
  return typeof value.termType === "string" && typeof value.value === "string";
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
