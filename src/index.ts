export interface Metric {
  readonly name: string;
  readonly duration?: number;
  readonly description?: string;
}
function split(text: string, delimiter: string): string[] {
  const out: string[] = [];
  let start = 0,
    q = false,
    esc = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (esc) {
      esc = false;
      continue;
    }
    if (q && c === '\\') {
      esc = true;
      continue;
    }
    if (c === '"') q = !q;
    else if (c === delimiter && !q) {
      out.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  if (q || esc) throw new TypeError('Unclosed quoted parameter');
  out.push(text.slice(start).trim());
  return out;
}
function value(s: string): string {
  if (s.startsWith('"')) {
    if (!s.endsWith('"')) throw new TypeError('Malformed quoted value');
    return s.slice(1, -1).replace(/\\(.)/g, '$1');
  }
  return s;
}
export function parseServerTiming(text: string): Metric[] {
  if (typeof text !== 'string' || text.length > 65536)
    throw new TypeError('Expected bounded header');
  if (!text.trim()) return [];
  return split(text, ',').map((item) => {
    const [name, ...params] = split(item, ';');
    if (!/^[a-zA-Z0-9_.-]+$/.test(name!)) throw new TypeError('Invalid metric name');
    let duration: number | undefined, description: string | undefined;
    for (const p of params) {
      const i = p.indexOf('=');
      if (i < 1) throw new TypeError('Malformed metric parameter');
      const k = p.slice(0, i).trim().toLowerCase(),
        v = value(p.slice(i + 1).trim());
      if (k === 'dur') {
        duration = Number(v);
        if (!Number.isFinite(duration) || duration < 0)
          throw new RangeError('Duration must be nonnegative');
      } else if (k === 'desc') description = v;
    }
    return {
      name: name!,
      ...(duration === undefined ? {} : { duration }),
      ...(description === undefined ? {} : { description }),
    };
  });
}
export function formatServerTiming(metrics: readonly Metric[]): string {
  if (!Array.isArray(metrics) || metrics.length > 2048)
    throw new RangeError('Metric count exceeds budget');
  return metrics
    .map((m) => {
      if (!/^[a-zA-Z0-9_.-]+$/.test(m.name)) throw new TypeError('Invalid metric name');
      const p = [m.name];
      if (m.duration !== undefined) {
        if (!Number.isFinite(m.duration) || m.duration < 0)
          throw new RangeError('Duration must be nonnegative');
        p.push('dur=' + m.duration);
      }
      if (m.description !== undefined)
        p.push('desc="' + m.description.replace(/([\\"])/g, '\\$1') + '"');
      return p.join(';');
    })
    .join(', ');
}
