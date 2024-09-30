const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = './requests.json';

// Helper function to read requests from JSON
const readRequestsFromFile = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write requests to JSON
const writeRequestsToFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// POST /requests - Add a new service request
app.post('/requests', (req, res) => {
  const { guestName, roomNumber, requestDetails, priority } = req.body;
  if (!guestName || !roomNumber || !requestDetails || priority === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newRequest = {
    id: uuidv4(),
    guestName,
    roomNumber,
    requestDetails,
    priority,
    status: 'received',
  };

  const requests = readRequestsFromFile();
  requests.push(newRequest);
  writeRequestsToFile(requests);

  res.status(201).json(newRequest);
});

// GET /requests - Retrieve all requests sorted by priority and status
app.get('/requests', (req, res) => {
  const requests = readRequestsFromFile();

  // Sorting by priority first (lower numbers = higher priority), then by status
  const sortedRequests = requests.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.status.localeCompare(b.status);
  });

  res.json(sortedRequests);
});

// GET /requests/:id - Retrieve a specific request by its ID
app.get('/requests/:id', (req, res) => {
  const { id } = req.params;
  const requests = readRequestsFromFile();

  const request = requests.find((req) => req.id === id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  res.json(request);
});

// PUT /requests/:id - Update the details or priority of an existing request
app.put('/requests/:id', (req, res) => {
  const { id } = req.params;
  const { guestName, roomNumber, requestDetails, priority, status } = req.body;
  const requests = readRequestsFromFile();

  const requestIndex = requests.findIndex((req) => req.id === id);
  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Request not found' });
  }

  // Update the request details
  if (guestName) requests[requestIndex].guestName = guestName;
  if (roomNumber) requests[requestIndex].roomNumber = roomNumber;
  if (requestDetails) requests[requestIndex].requestDetails = requestDetails;
  if (priority !== undefined) requests[requestIndex].priority = priority;
  if (status) requests[requestIndex].status = status;

  writeRequestsToFile(requests);

  res.json(requests[requestIndex]);
});

// DELETE /requests/:id - Remove a completed or canceled request
app.delete('/requests/:id', (req, res) => {
  const { id } = req.params;
  const requests = readRequestsFromFile();

  const requestIndex = requests.findIndex((req) => req.id === id);
  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const [deletedRequest] = requests.splice(requestIndex, 1);
  writeRequestsToFile(requests);

  res.json({ message: 'Request deleted', request: deletedRequest });
});

// POST /requests/:id/complete - Mark a request as completed
app.post('/requests/:id/complete', (req, res) => {
  const { id } = req.params;
  const requests = readRequestsFromFile();

  const requestIndex = requests.findIndex((req) => req.id === id);
  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Request not found' });
  }

  requests[requestIndex].status = 'completed';
  writeRequestsToFile(requests);

  res.json(requests[requestIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
