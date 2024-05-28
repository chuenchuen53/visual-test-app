export class HandledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HandledError";
  }
}

export function CatchError<T>(errHandling: (error: unknown) => T | void, rethrow: boolean | "handled" = true) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (e) {
        const valueWhenError = errHandling(e);
        if (rethrow === true) {
          throw e;
        } else if (rethrow === "handled") {
          const errorMsg = e instanceof Error ? e.message : "Non-Error type";
          throw new HandledError(errorMsg);
        } else if (!rethrow) {
          return valueWhenError;
        }
      }
    };

    return descriptor;
  };
}