export function hasKey<V = unknown, K extends (string | symbol | number) = any>(value: V, key: K): value is V & object & Record<K, unknown> {
  return (
    (
      typeof value === "object" ||
      typeof value === "function"
    ) &&
    Object.prototype.hasOwnProperty.call(value, key)
  );
}
