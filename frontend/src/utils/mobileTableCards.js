/**
 * Adds data-label attributes and classes so admin tables render as stacked cards on mobile.
 */
export function enhanceAdminTables(root) {
  const center =
    root?.classList?.contains('admin-page-center')
      ? root
      : root?.querySelector?.('.admin-page-center') || document.querySelector('.admin-page-center');

  if (!center) return;

  center.querySelectorAll('.admin-table-panel table, table.admin-data-table, table.w-full').forEach((table) => {
    table.classList.add('admin-mobile-cards');

    const panel = table.closest('.admin-table-panel');
    if (panel) panel.classList.add('admin-table-card');

    const scrollWrap = table.closest('.admin-table-responsive');
    if (scrollWrap) scrollWrap.classList.add('admin-table-scroll');

    const headers = [...table.querySelectorAll('thead th')].map((th) =>
      th.textContent.replace(/\s+/g, ' ').trim()
    );

    if (!headers.length) return;

    table.querySelectorAll('tbody tr').forEach((tr) => {
      const cells = [...tr.children].filter((el) => el.tagName === 'TD');
      const isEmptyRow = cells.some((td) => td.colSpan && Number(td.colSpan) > 1);

      if (!isEmptyRow) {
        tr.classList.add('admin-mobile-row-card');
      } else {
        tr.classList.remove('admin-mobile-row-card');
      }

      cells.forEach((td, i) => {
        if (td.colSpan && Number(td.colSpan) > 1) {
          td.removeAttribute('data-label');
          td.classList.add('admin-mobile-cards-empty');
          return;
        }

        td.classList.remove('admin-mobile-cards-empty');
        const label = headers[i] || '';
        if (label) td.setAttribute('data-label', label);
        else td.removeAttribute('data-label');
      });
    });
  });
}
