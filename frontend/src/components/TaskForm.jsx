import { useState, useEffect } from 'react';

export default function TaskForm({ initial, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description);
      setStatus(initial.status);
      setPriority(initial.priority || 'medium');
      setDueDate(initial.dueDate ? initial.dueDate.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority, dueDate: dueDate || undefined });
    if (!initial) {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.25rem' }}>{initial ? 'Edit Task' : 'Create Task'}</h3>
      <div className="form-group">
        <label>Task Title</label>
        <input 
          placeholder="e.g. Build API endpoints" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea 
          placeholder="Describe your task details..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="textarea-field"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="select-field">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="select-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
        {initial ? 'Update' : 'Add Task'}
      </button>
    </form>
  );
}
