import clsx from 'clsx'

export default function Table({ columns, data, onRowClick, isLoading }) {
  if (isLoading) {
    return <SkeletonTable rows={5} cols={columns.length} />
  }
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data?.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={clsx(onRowClick && 'cursor-pointer hover:bg-slate-50 transition-colors')}
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-3 text-sm text-slate-700">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {(!data || data.length === 0) && (
        <div className="p-6 text-center text-sm text-slate-500">No data</div>
      )}
    </div>
  )
}

function SkeletonTable({ rows, cols }) {
  return (
    <div className="border border-slate-200 rounded-lg animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex p-4 border-b border-slate-100 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-slate-200 rounded flex-1 mr-4 last:mr-0" />
          ))}
        </div>
      ))}
    </div>
  )
}