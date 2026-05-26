import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/pages');

const importLine = "import AdminTablePanel from '../components/layout/AdminTablePanel';";

const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('<table')) continue;

  if (!content.includes('AdminTablePanel')) {
    const lastImport = content.lastIndexOf('\nimport ');
    if (lastImport === -1) continue;
    const endOfImportLine = content.indexOf('\n', lastImport + 1);
    content =
      content.slice(0, endOfImportLine + 1) +
      importLine +
      '\n' +
      content.slice(endOfImportLine + 1);
  }

  // Standard: card + overflow-x-auto wrapper
  content = content.replace(
    /<div className="card overflow-hidden(?: p-0)?">\s*<div className="overflow-x-auto(?: admin-table-scroll)?">\s*/g,
    '<AdminTablePanel noPadding>\n          '
  );

  // motion.div + card (Animals)
  content = content.replace(
    /<motion\.div([^>]*?) className="card overflow-hidden p-0">\s*<div className="overflow-x-auto">\s*/g,
    '<motion.div$1>\n        <AdminTablePanel noPadding>\n          '
  );

  // Close table wrapper: </table> followed by two closing divs before next section
  content = content.replace(
    /(<\/table>)\s*<\/div>\s*<\/div>/g,
    '$1\n      </AdminTablePanel>'
  );

  // Expenses / Feed: table directly inside card without inner scroll div
  content = content.replace(
    /<div className="card overflow-hidden p-0">\s*<table className="w-full">/g,
    '<AdminTablePanel noPadding>\n        <table className="w-full admin-data-table">'
  );

  // Tables: add admin-data-table, remove minWidth inline styles
  content = content.replace(
    /<table className="w-full(?: admin-data-table)?"(?:\s+style=\{\{[^}]+\}\})?>/g,
    '<table className="w-full admin-data-table">'
  );

  content = content.replace(
    /<table className="w-full admin-data-table"(?:\s+style=\{\{[^}]+\}\})?>/g,
    '<table className="w-full admin-data-table">'
  );

  fs.writeFileSync(filePath, content);
  console.log('Updated', file);
}
