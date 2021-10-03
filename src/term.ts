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
  if (typeof value === "string" && given.value !== value) {
    return false;
  }
  return true;
}

export function isTerm<TermType extends string = string, Value extends string = string>(given: unknown, termType?: TermType, value?: Value): given is Term<TermType, Value> {
  if (!isTermLike(given, termType, value)) {
    return false;
  }
  function hasEqualsLike(given: unknown): given is { equals: unknown } {
    return !!given;
  }
  function hasEquals(given: unknown): given is { equals(): unknown } {
    return hasEqualsLike(given) && typeof given.equals === "function";
  }
  return hasEquals(given);
}

export function assertTermLike<TermType extends string = string, Value extends string = string>(given: unknown, termType?: TermType, value?: Value): asserts given is TermLike<TermType, Value> {
  if (!isTermLike(given, termType, value)) {
    const error: Error & { termType?: unknown, value?: unknown, given?: unknown } = new Error("Expected Term");
    error.termType = termType;
    error.value = value;
    error.given = given;
    throw error;
  }
}

export function assertTerm<TermType extends string = string, Value extends string = string>(given: unknown, termType?: TermType, value?: Value): asserts given is Term<TermType, Value> {
  if (!isTerm(given, termType, value)) {
    const error: Error & { termType?: unknown, value?: unknown, given?: unknown } = new Error("Expected Term");
    error.termType = termType;
    error.value = value;
    error.given = given;
    throw error;
  }
}

export interface Term<TermType extends string = string, Value extends string = string> {
  readonly termType: TermType;
  readonly value: Value;

  equals(other: Term): other is Term<TermType, Value>;
  equals(other: unknown): other is TermLike<TermType, Value>;
}

export class Term<TermType extends string = string, Value extends string = string> implements Term<TermType, Value> {

  protected constructor(readonly termType: TermType, readonly value: Value) {
  }

  equals(other: Term): other is Term<TermType, Value>;
  equals(other: unknown): other is TermLike<TermType, Value>;
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
