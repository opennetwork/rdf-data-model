import { isTerm, isTermLike, Term } from "./term";
import { BlankNode } from "./blank-node";

export function isVariableLike<Value extends string = string>(given: unknown, value?: Value): given is VariableLike<Value> {
  return isTermLike(given, "Variable", value);
}

export function isVariable<Value extends string = string>(given: unknown, value?: Value): given is Variable<Value> {
  return isTerm(given, "Variable", value);
}

export function assertVariableLike<Value extends string = string>(given: unknown, value?: Value): asserts given is VariableLike<Value> {
  if (!isVariableLike(given, value)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected Variable");
    error.value = value;
    error.given = given;
    throw error;
  }
}

export function assertVariable<Value extends string = string>(given: unknown, value?: Value): asserts given is Variable<Value> {
  if (!isVariable(given, value)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected Variable");
    error.value = value;
    error.given = given;
    throw error;
  }
}

export interface Variable<Value extends string = string> extends Term<"Variable", Value> {
  equals(other: Variable): other is Variable<Value>;
  equals(other: unknown): other is VariableLike<Value>;
}

export class Variable<Value extends string = string> extends Term<"Variable", Value> implements Variable<Value> {

  constructor(value: Value) {
    super("Variable", value);
  }

  equals(other: Variable): other is Variable<Value>;
  equals(other: unknown): other is VariableLike<Value>;
  equals(other: unknown): other is VariableLike<Value> {
    return isVariableLike(other, this.value);
  }

}

export type VariableLike<Value extends string = string> = Pick<Variable<Value>, "termType" | "value">;
