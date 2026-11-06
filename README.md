# @lp-labs/server-timing-header

Server-Timing header parser and formatter for metric names, durations and descriptions.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/server-timing-header
```

## Working example

```js
import { parseServerTiming } from '@lp-labs/server-timing-header';
const metrics = parseServerTiming('db;dur=12.4;desc="primary, read"');
if (metrics[0]?.duration !== 12.4) throw new Error('Duration mismatch');
```

CommonJS: `const api = require('@lp-labs/server-timing-header')`.

## Behavior, customization and limits

Supports comma-separated metrics with optional dur and desc parameters; quoted descriptions handle commas and backslash escapes. Durations are nonnegative milliseconds. It does not measure requests or apply browser performance semantics.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface Metric {
  readonly name: string;
  readonly duration?: number;
  readonly description?: string;
}
export declare function parseServerTiming(text: string): Metric[];
export declare function formatServerTiming(metrics: readonly Metric[]): string;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
