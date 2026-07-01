export default function TaskCard({ task, onEdit, onDelete }) {
  const statusBadge = {
    'pending': 'badge badge-pending',
    'in-progress': 'badge badge-progress',
    'completed': 'badge badge-completed',
  };

  const priorityBadge = {
    low: 'badge-priority badge-priority-low',
    medium: 'badge-priority badge-priority-medium',
    high: 'badge-priority badge-priority-high',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`card animate-fade-in ${isOverdue ? 'card-overdue' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {task.priority && <span className={priorityBadge[task.priority]}>{task.priority}</span>}
          <span className={statusBadge[task.status] || 'badge'}>{task.status}</span>
        </div>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-meta">
        {task.dueDate && (
          <span className={`task-due ${isOverdue ? 'task-due-overdue' : ''}`}>
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>
      <div className="task-footer">
        <button onClick={() => onEdit(task)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          Edit
        </button>
        <button onClick={() => onDelete(task)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          Delete
        </button>
      </div>
    </div>
  );
}
