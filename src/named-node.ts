import { Term, isTerm, isTermLike } from "./term";

export function isNamedNodeLike<Value extends string = string>(given: unknown, value?: Value): given is NamedNodeLike<Value> {
  return isTermLike(given, "NamedNode", value);
}

export function isNamedNode<Value extends string = string>(given: unknown, value?: Value): given is NamedNode {
  return isTerm(given, "NamedNode", value);
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

