import { isTerm, isTermLike, Term } from "./term";

export function isVariableLike<Value extends string = string>(given: unknown, value?: Value): given is VariableLike<Value> {
  return isTermLike(given, "Variable", value);
}

export function isVariable<Value extends string = string>(given: unknown, value?: Value): given is Variable {
  return isTerm(given, "Variable", value);
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
