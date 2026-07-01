import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 6, sort };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, statusFilter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => { setPage(1); }, [search, statusFilter, sort]);

  const handleCreate = async (formData) => {
    try {
      await api.post('/tasks', formData);
      showToast('Task created');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/tasks/${editing._id}`, formData);
      setEditing(null);
      showToast('Task updated');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/tasks/${deleteTarget._id}`);
      setDeleteTarget(null);
      showToast('Task deleted');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Tasks
        <span style={{ fontSize: '0.9rem', fontWeight: 400, backgroundColor: 'rgba(255, 230, 0, 0.1)', color: 'var(--primary-accent)', padding: '2px 8px', borderRadius: '4px' }}>
          {total} total
        </span>
      </h2>

      <TaskForm initial={editing} onSubmit={editing ? handleUpdate : handleCreate} />

      <div className="task-controls">
        <input
          className="input-field"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select className="select-field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select className="select-field" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 'auto' }}>
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="dueDate">Due Date (asc)</option>
          <option value="-dueDate">Due Date (desc)</option>
          <option value="-priority">Priority (high first)</option>
          <option value="priority">Priority (low first)</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size={36} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
          <p>No tasks found. Adjust filters or add a new task.</p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={setEditing} onDelete={setDeleteTarget} />
        ))
      )}

      {pages > 1 && (
        <div className="pagination">
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.4rem 0.8rem' }}>
            Prev
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {page} / {pages}
          </span>
          <button className="btn btn-outline" disabled={page >= pages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.4rem 0.8rem' }}>
            Next
          </button>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete task "${deleteTarget.title}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
