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