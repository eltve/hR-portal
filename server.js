const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json()); // Essential for reading JSON from frontend forms
app.use(express.static(path.join(__dirname, 'public')));

const SUPABASE_URL = 'https://pcopzbmkvctdlsbsbshf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AzmrbDrC6P2_FX_MU2iCKg_Yr2g3DK1';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// GET: Fetch all employees
app.get('/api/employees', async (req, res) => {
  const { data, error } = await supabase
    .from('employees')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST: Add a new employee with all enhanced columns
app.post('/api/employees', async (req, res) => {
  const { 
    first_name, 
    last_name, 
    email, 
    department, 
    date_hired, 
    business_location, 
    job_title, 
    phone_number, 
    emergency_contact, 
    status 
  } = req.body;

  const { data, error } = await supabase
    .from('employees')
    .insert([{ 
      first_name, 
      last_name, 
      email, 
      department, 
      date_hired, 
      business_location, 
      job_title, 
      phone_number, 
      emergency_contact, 
      status: status || 'Active' // Default to Active if not specified
    }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Employee added successfully!', data });
});

// DELETE: Remove an employee by ID
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Employee deleted successfully!' });
});

// PUT: Update an existing employee by ID
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    first_name, 
    last_name, 
    email, 
    department, 
    date_hired, 
    business_location, 
    job_title, 
    phone_number, 
    emergency_contact, 
    status 
  } = req.body;

  const { data, error } = await supabase
    .from('employees')
    .update({ 
      first_name, 
      last_name, 
      email, 
      department, 
      date_hired, 
      business_location, 
      job_title, 
      phone_number, 
      emergency_contact, 
      status 
    })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Employee updated successfully!', data });
});

// Add these routes to server.js

// ==========================================
// HR TASKS API ROUTES
// ==========================================

// GET: Fetch all HR tasks
app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST: Add a new HR task
app.post('/api/tasks', async (req, res) => {
  const { 
    business_location, 
    start_date, 
    deadline, 
    assigned_to, 
    task_category, 
    task_details, 
    status 
  } = req.body;

  // Validate required fields
  if (!business_location || !task_category || !task_details) {
    return res.status(400).json({ error: 'Missing required task information' });
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ 
      business_location, 
      start_date, 
      deadline, 
      assigned_to, 
      task_category, 
      task_details, 
      status: status || 'Pending' // Default status
    }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Task added successfully!', data });
});

// PUT: Update an existing HR task by ID
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    business_location, 
    start_date, 
    deadline, 
    assigned_to, 
    task_category, 
    task_details, 
    status 
  } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      business_location, 
      start_date, 
      deadline, 
      assigned_to, 
      task_category, 
      task_details, 
      status 
    })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Task updated successfully!', data });
});

// DELETE: Remove a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Task deleted successfully!' });
});


// GET all IT tasks
app.get('/api/it-tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('it_tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST create a new IT task
app.post('/api/it-tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('it_tasks')
    .insert([req.body])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PUT update an existing IT task
app.put('/api/it-tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('it_tasks')
    .update(req.body)
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// DELETE an IT task
app.delete('/api/it-tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('it_tasks')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});