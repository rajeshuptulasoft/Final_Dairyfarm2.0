/**
 * Standard wrapper for admin list tables.
 * Desktop: horizontal scroll when needed.
 * Mobile: CSS stacks rows as cards (see .admin-data-table in style.css).
 */
export default function AdminTablePanel({ children, className = '', noPadding = false, toolbar = null }) {
  return (
    <div
      className={[
        'admin-table-panel',
        'card',
        'admin-table-card',
        noPadding ? 'p-0' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {toolbar}
      <div className="admin-table-responsive">{children}</div>
    </div>
  );
}
