/**
 * k6 Load Test
 * Version: 2
 * Date: 2026-04-01
 * Purpose: Increased load test, 50 VUs, 5 minutes
 */

import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend } from 'k6/metrics';

let responseTime = new Trend('response_time');

export let options = {
  vus: 50,
  duration: '5m',
};

export default function () {
  let res = http.get('http://192.168.1.14:8082');

  responseTime.add(res.timings.duration);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}