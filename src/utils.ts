export const DEVICE_ACCESS_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const EMOJIS: { [key: string]: string } = {
  thumbsup: '👍',
  thumbsdown: '👎',
  love: '😻',
};

export const now =
  Date.now ||
  function (): number {
    return new Date().getTime();
  };

export const throttle = (
  func: Function,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean },
): Function => {
  let timeout: NodeJS.Timeout | null;
  let context: any;
  let args: IArguments | null;
  let result: any;
  let previous = 0;

  if (!options) options = {};

  const later = (): void => {
    previous = options?.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args as any);

    if (!timeout) context = args = null;
  };

  const throttled = (): any => {
    const _now = now();

    if (!previous && options?.leading === false) previous = _now;

    const remaining = wait - (_now - previous);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this;
    args = null;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = _now;
      result = func.apply(context, args as any);

      if (!timeout) context = args = null;
    } else if (!timeout && options?.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  (throttled as any).cancel = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    }
  };

  return throttled;
};
