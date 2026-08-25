const fs = require('fs');
const lines = fs.readFileSync('src/pages/MinhaAgenda.tsx', 'utf8').split('\n');

for (let i = 401; i <= 445; i++) {
  console.log((i + 1) + ': ' + JSON.stringify(lines[i]));
}
