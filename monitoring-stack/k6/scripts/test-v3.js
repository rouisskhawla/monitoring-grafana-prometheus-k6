/**
 * k6 Load Test
 * Version: 3
 * Date: 2026-04-01
 * Purpose: Stress test, 100 VUs, 10 minutes
 */

import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend } from 'k6/metrics';

let responseTime = new Trend('response_time');

export let options = {
  vus: 100,
  duration: '10m',
};

export default function () {
  let res = http.get('http://192.168.1.14:8082');

  responseTime.add(res.timings.duration);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}