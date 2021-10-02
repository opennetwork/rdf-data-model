import { Term, isTerm, isTermLike, TermImplementation } from "./term";

export function isNamedNodeLike<Value extends string = string>(given: unknown, value?: Value): given is NamedNodeLike<Value> {
  return isTermLike(given, "NamedNode", value);
}

export function isNamedNode<Value extends string = string>(given: unknown, value?: Value): given is NamedNode {
  return isTerm(given, "NamedNode", value);
}

export interface NamedNode<Value extends string = string> extends Term<"NamedNode", Value> {
  equals(other: unknown): other is NamedNodeLike<Value>;
}

export type NamedNodeLike<Value extends string = string> = Pick<NamedNode<Value>, "termType" | "value">;

export class NamedNodeImplementation<Value extends string = string> extends TermImplementation<"NamedNode", Value> implements NamedNode<Value> {

  constructor(value: Value) {
    super("NamedNode", value);
  }

  equals(other: unknown): other is NamedNodeLike<Value> {
    return isNamedNodeLike(other, this.value);
  }

}

