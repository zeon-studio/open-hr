const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Partial<T> => {
  const picked: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwn(obj, key)) {
      picked[key] = obj[key];
    }
  }

  return picked;
};

export default pick;
