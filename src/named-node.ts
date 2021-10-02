import { Term, isTerm, isTermLike } from "./term";

export function isNamedNodeLike<Value extends string = string>(given: unknown, value?: Value): given is NamedNodeLike<Value> {
  return isTermLike(given, "NamedNode", value);
}

export function isNamedNode<Value extends string = string>(given: unknown, value?: Value): given is NamedNode<Value> {
  return isTerm(given, "NamedNode", value);
}

export function assertNamedNodeLike<Value extends string = string>(given: unknown, value?: Value): asserts given is NamedNodeLike<Value> {
  if (!isNamedNodeLike(given, value)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected NamedNode");
    error.value = value;
    error.given = given;
    throw error;
  }
}

export function assertNamedNode<Value extends string = string>(given: unknown, value?: Value): asserts given is NamedNode<Value> {
  if (!isNamedNode(given, value)) {
    const error: Error & { value?: unknown, given?: unknown } = new Error("Expected NamedNode");
    error.value = value;
    error.given = given;
    throw error;
  }
}

export interface NamedNode<Value extends string = string> extends Term<"NamedNode", Value> {
  equals(other: NamedNode): other is NamedNode<Value>;
  equals(other: unknown): other is NamedNodeLike<Value>;
}

export type NamedNodeLike<Value extends string = string> = Pick<NamedNode<Value>, "termType" | "value">;

export class NamedNode<Value extends string = string> extends Term<"NamedNode", Value> implements NamedNode<Value> {

  constructor(value: Value) {
    super("NamedNode", value);
  }

  equals(other: NamedNode): other is NamedNode<Value>;
  equals(other: unknown): other is NamedNodeLike<Value>;
  equals(other: unknown): other is NamedNodeLike<Value> {
    return isNamedNodeLike(other, this.value);
  }

}

