export function hasKey<V, K extends (string | symbol | number)>(value: V, key: K): value is V & object & Record<K, unknown> {
  return (
    (
      typeof value === "object" ||
      typeof value === "function"
    ) &&
    Object.prototype.hasOwnProperty.call(value, key)
  );
}
