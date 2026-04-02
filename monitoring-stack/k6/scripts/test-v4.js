/**
 * k6 Load Test
 * Version: 4
 * Date: 2026-04-02
 * Purpose: Ramp-Up Test, Gradual Load
 */

import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 20 },
    { duration: '3m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://192.168.1.14:8082');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}