import { Term, isTerm, isTermLike } from "./term";

export function isBlankNodeLike<Value extends string = string>(given: unknown, value?: Value): given is BlankNodeLike<Value> {
  return isTermLike(given, "BlankNode", value);
}

export function isBlankNode<Value extends string = string>(given: unknown, value?: Value): given is BlankNode<Value> {
  return isTerm(given, "BlankNode", value);
}

export function assertBlankNodeLike<Value extends string = string>(given: unknown, value?: Value): asserts given is BlankNodeLike<Value> {
  if (!isBlankNodeLike(given, value)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected BlankNode");
    error.value = value;
    error.given = given;
    throw error;
  }
}

export function assertBlankNode<Value extends string = string>(given: unknown, value?: Value): asserts given is BlankNode<Value> {
  if (!isBlankNode(given, value)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected BlankNode");
    error.value = value;
    error.given = given;
    throw error;
  }
}

export interface BlankNode<Value extends string = string> extends Term<"BlankNode", Value> {
  equals(other: BlankNode): other is BlankNode<Value>;
  equals(other: unknown): other is BlankNodeLike<Value>;
}

export class BlankNode<Value extends string = string> extends Term<"BlankNode", Value> implements BlankNode<Value> {

  constructor(value: Value) {
    super("BlankNode", value);
  }

  equals(other: BlankNode): other is BlankNode<Value>;
  equals(other: unknown): other is BlankNodeLike<Value>;
  equals(other: unknown): other is BlankNodeLike<Value> {
    return isBlankNodeLike(other, this.value);
  }

}


export type BlankNodeLike<Value extends string = string> = Pick<BlankNode<Value>, "termType" | "value">;
