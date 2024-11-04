const http = require('http');
const fs = require('fs');

const PORT = 3000;
const DATA_FILE = 'data.json';

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const readData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};


const handleGetItems = (res) => {
  const data = readData();
  res.end(JSON.stringify(data));
};

const handlePostItem = (res, body) => {
    if (!body) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: 'Request body is required' }));
    }
  
    console.log('Received body:', body);
  
    try {
      const newItem = JSON.parse(body);
      newItem.id = Date.now().toString();
  
      const data = readData();
      data.push(newItem);
      writeData(data);
  
      res.statusCode = 201;
      res.end(JSON.stringify(newItem));
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.statusCode = 400; // Bad Request
      res.end(JSON.stringify({ message: 'Invalid JSON' }));
    }
  };

const handlePutItem = (res, url, body) => {
  const id = url.split('/')[2];
  const data = readData();
  const index = data.findIndex((item) => item.id === id);

  if (index !== -1) {
    const updatedItem = { ...data[index], ...JSON.parse(body) };
    data[index] = updatedItem;
    writeData(data);
    res.end(JSON.stringify(updatedItem));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Item not found' }));
  }
};

const handleDeleteItem = (res, url) => {
  const id = url.split('/')[2];
  const data = readData();
  const filteredData = data.filter((item) => item.id !== id);

  if (filteredData.length !== data.length) {
    writeData(filteredData);
    res.statusCode = 204;
    res.end();
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Item not found' }));
  }
};

const routes = {
    GET: {
      '/items': handleGetItems,
    },
    POST: {
      '/items': handlePostItem,
    },
    PUT: {
      '/items': handlePutItem,
    },
    DELETE: {
      '/items': handleDeleteItem,
    },
  };

  const requestHandler = (req, res) => {
    let body = '';
  
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
  
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      console.log('Received body:', body);
      const methodHandlers = routes[req.method] || {};
      const handlerPath = Object.keys(methodHandlers).find((path) => req.url === path);
  
      if (handlerPath) {
        methodHandlers[handlerPath](res, body);
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Route not found' }));
      }
    });
  };  
  
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
