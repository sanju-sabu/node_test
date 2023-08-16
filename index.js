const express = require('express');
const app = express();
const port = 3000;

// Middleware 
app.use(express.json());

const customers = require('./customers.json');

app.get('/api/customers', (req, res) => {
  const { first_name, last_name, city, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let filteredCustomers = customers;

  if (first_name) {
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.first_name.toLowerCase().includes(first_name.toLowerCase())
    );
  }

  if (last_name) {
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.last_name.toLowerCase().includes(last_name.toLowerCase())
    );
  }

  if (city) {
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  const paginatedCustomers = filteredCustomers.slice(offset, offset + limit);

  res.json(paginatedCustomers);
});

app.get('/api/customers/:id', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers.find(customer => customer.id === customerId);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  res.json(customer);
});

app.get('/api/cities', (req, res) => {
  const cityCounts = {};

  customers.forEach(customer => {
    if (cityCounts[customer.city]) {
      cityCounts[customer.city]++;
    } else {
      cityCounts[customer.city] = 1;
    }
  });

  res.json(cityCounts);
});

app.post('/api/customers', (req, res) => {
  const { id, first_name, last_name, city, company } = req.body;

  if (!id || !first_name || !last_name || !city || !company) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const existingCustomer = customers.find(customer => customer.id === id);

  if (!existingCustomer) {
    return res.status(400).json({ error: 'Customer does not exist.' });
  }

  const newCustomer = {
    id,
    first_name,
    last_name,
    city,
    company
  };

  customers.push(newCustomer);

  res.json({ message: 'Customer added successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
