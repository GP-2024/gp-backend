import http from 'k6/http';

export let options = {
  vus: 50,
  duration: '2s',
};

export default function () {
  http.get('http://localhost:3000/health', {
    headers: {
      'Content-Type': 'application/json',
      //Authorization: 'Bearer your_token_here',
    },
  });
}
