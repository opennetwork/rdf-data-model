import { hasKey } from "./has-key";

export function isTermLike<TermType extends string = string, Value extends string = string>(given: unknown, termType?: TermType, value?: Value): given is TermLike<TermType, Value> {
  if (!(
    hasKey(given, "termType") &&
    hasKey(given, "value") &&
    typeof given.termType === "string" &&
    typeof given.value === "string"
  )) {
    return false;
  }
  if (typeof termType === "string" && given.termType !== termType) {
    return false;
  }
  if (typeof value === "string" && given.value === value) {
    return false;
  }
  return true;
}

export function isTerm<TermType extends string = string, Value extends string = string>(given: unknown, termType?: TermType, value?: Value): given is Term<TermType, Value> {
  if (!isTermLike(given, termType, value)) {
    return false;
  }
  function hasEquals(value: any): value is Record<"equals", () => {}> {
    return !!(value && value.equals instanceof Function);
  }
  return hasEquals(value);
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
  equals(other: unknown): other is TermLike<TermType, Value> {
    return isTermLike(other, this.termType, this.value);
  }

  toJSON(): object {
    return {
      termType: this.termType,
      value: this.value
    };
  }

}

export type TermLike<TermType extends string = string, Value extends string = string> = Pick<Term<TermType, Value>, "termType" | "value">;
