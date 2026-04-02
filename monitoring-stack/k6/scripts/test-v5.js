/**
 * k6 Load Test
 * Version: 5
 * Date: 2026-04-02
 * Purpose: Spike Test, Resilience check
 */

import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '10s', target: 200 },
    { duration: '1m', target: 20 },
  ],
};

export default function () {
  let res = http.get('http://192.168.1.14:8082');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}