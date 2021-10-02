import { Term, isTerm, isTermLike, TermImplementation } from "./term";

export function isBlankNodeLike<Value extends string = string>(given: unknown, value?: Value): given is BlankNodeLike<Value> {
  return isTermLike(given, "BlankNode", value);
}

export function isBlankNode<Value extends string = string>(given: unknown, value?: Value): given is BlankNode {
  return isTerm(given, "BlankNode", value);
}

export interface BlankNode<Value extends string = string> extends Term<"BlankNode", Value> {
  equals(other: unknown): other is BlankNodeLike<Value>;
}

export class BlankNodeImplementation<Value extends string = string> extends TermImplementation<"BlankNode", Value> implements BlankNode<Value> {

  constructor(value: Value) {
    super("BlankNode", value);
  }

  equals(other: unknown): other is BlankNodeLike<Value> {
    return isBlankNodeLike(other, this.value);
  }

}


export type BlankNodeLike<Value extends string = string> = Pick<BlankNode<Value>, "termType" | "value">;
