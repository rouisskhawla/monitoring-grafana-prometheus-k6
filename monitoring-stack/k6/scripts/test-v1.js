/**
 * k6 Load Test
 * Version: 1
 * Date: 2026-04-01
 * Purpose: Baseline load test, 20 VUs, 2 minutes
 */

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 20,
  duration: '2m',
};

export default function () {
  http.get('http://192.168.1.14:8082');
  sleep(1);
}