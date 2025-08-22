import React from 'react';
import * as XLSX from 'xlsx';

const BulkProductImport = ({ onImport }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (json.length < 2) return;
        const header = json[0].map(h => h.trim());
        const products = json.slice(1).map(row => {
          const obj = {};
          header.forEach((h, idx) => {
            let val = row[idx] || '';
            if (h === 'Цена' || h === 'Остаток') val = val ? Number(val) : '';
            obj[h] = val;
          });
          return {
            name: obj['Название'] || '',
            description: obj['Описание'] || '',
            price: obj['Цена'] || '',
            category: obj['Категория'] || '',
            sku: obj['Артикул'] || '',
            quantity: obj['Остаток'] || '',
            unit: obj['Ед. изм.'] || '',
            status: obj['Статус'] || 'active',
            photos: obj['Фото'] ? String(obj['Фото']).split('|').map(f => f.trim()).filter(Boolean) : [],
          };
        });
        onImport(products);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) return;
        const header = lines[0].split(';').map(h => h.trim());
        const products = lines.slice(1).map(line => {
          const cols = line.split(';');
          const obj = {};
          header.forEach((h, idx) => {
            let val = cols[idx] || '';
            if (h === 'Цена' || h === 'Остаток') val = val ? Number(val) : '';
            obj[h] = val;
          });
          return {
            name: obj['Название'] || '',
            description: obj['Описание'] || '',
            price: obj['Цена'] || '',
            category: obj['Категория'] || '',
            sku: obj['Артикул'] || '',
            quantity: obj['Остаток'] || '',
            unit: obj['Ед. изм.'] || '',
            status: obj['Статус'] || 'active',
            photos: obj['Фото'] ? obj['Фото'].split('|').map(f => f.trim()).filter(Boolean) : [],
          };
        });
        onImport(products);
      };
      reader.readAsText(file, 'utf-8');
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">Импорт товаров из Excel/CSV:</label>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
    </div>
  );
};

export default BulkProductImport;
