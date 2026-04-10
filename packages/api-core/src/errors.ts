export interface ErrorEnvelope {
  error: {
    code: string;
    details?: unknown;
    message: string;
    requestId: string;
  };
}

export const toErrorEnvelope = (
  code: string,
  message: string,
  requestId: string,
  details?: unknown,
): ErrorEnvelope => {
  return {
    error: {
      code,
      ...(details === undefined ? {} : { details }),
      message,
      requestId,
    },
  };
};
