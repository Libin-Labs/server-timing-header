import * as api from '@lp-labs/server-timing-header';
import { parseServerTiming } from '@lp-labs/server-timing-header';
const metrics = parseServerTiming('db;dur=12.4;desc="primary, read"');
if (metrics[0]?.duration !== 12.4) throw new Error('Duration mismatch');
// @ts-expect-error invalid argument must be rejected by declarations
api.parseServerTiming(4);
