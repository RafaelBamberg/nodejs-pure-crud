const fs = require('fs');

const DATA_FILE = 'data.json';

// Sample data to be written to data.json
const sampleData = [
  { id: '1', name: 'Item One', description: 'Description for Item One' },
  { id: '2', name: 'Item Two', description: 'Description for Item Two' },
  { id: '3', name: 'Item Three', description: 'Description for Item Three' },
  { id: '4', name: 'Item Four', description: 'Description for Item Four' },
];

// Write the sample data to the data.json file
fs.writeFileSync(DATA_FILE, JSON.stringify(sampleData, null, 2));
console.log(`Data has been generated and written to ${DATA_FILE}`);
