/* eslint-disable react/prop-types */

/**
 * The table view every chart on this page falls back to. It's the accessible
 * equivalent of the visual encoding — and the relief for the light-mode
 * contrast warning on the lighter palette steps.
 */
const DataTable = ({ caption, columns, rows, rowKey }) => (
  <details className="data-table-wrap">
    <summary>View {caption} as a table</summary>
    <div className="data-table-scroll">
      <table className="data-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={column.numeric ? "numeric" : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} className={column.numeric ? "numeric" : undefined}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
);

export default DataTable;
