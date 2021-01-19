const axios = require('axios').default;

async function GET(url, headers) {
  return new Promise((resolve, _reject) => {
    axios.get(url, { headers })
    .then((value) => { resolve({ data: value.data, success: true }); })
    .catch(() => { resolve({ data: null, success: false }); });
  });
}

async function POST(url, data, headers) {
  return new Promise((resolve, _reject) => {
    axios.post(url, data, { headers })
    .then((value) => { resolve({ data: value.data.data, success: true }); })
    .catch(() => { resolve({ data: null, success: false }); });
  });
}

module.exports = {
  GET, 
  POST
};