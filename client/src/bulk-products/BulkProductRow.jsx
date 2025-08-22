import React from 'react';
import BulkProductPhotoUpload from './BulkProductPhotoUpload';

const BulkProductRow = ({ product, onChange, onRemove, selected, onSelect }) => {
  return (
    <tr>
      <td className="border px-2 py-1 text-center">
        <input type="checkbox" checked={selected} onChange={onSelect} />
      </td>
      <td className="border px-2 py-1">
        <input type="text" value={product.name} onChange={e => onChange('name', e.target.value)} className="w-full" />
      </td>
      <td className="border px-2 py-1">
        <input type="text" value={product.description} onChange={e => onChange('description', e.target.value)} className="w-full" />
      </td>
      <td className="border px-2 py-1">
        <input type="number" value={product.price} onChange={e => onChange('price', e.target.value)} className="w-full" />
      </td>
      <td className="border px-2 py-1">
        <input type="text" value={product.category} onChange={e => onChange('category', e.target.value)} className="w-full" />
      </td>
      <td className="border px-2 py-1">
        <input type="text" value={product.sku} onChange={e => onChange('sku', e.target.value)} className="w-full" />
      </td>
      <td className="border px-2 py-1">
        <input type="number" value={product.quantity} onChange={e => onChange('quantity', e.target.value)} className="w-full" />
      </td>
      <td className="border px-2 py-1">
        <input type="text" value={product.unit} onChange={e => onChange('unit', e.target.value)} className="w-full" />
      </td>
      <td className="border px-2 py-1">
        <select value={product.status} onChange={e => onChange('status', e.target.value)} className="w-full">
          <option value="active">Активен</option>
          <option value="hidden">Скрыт</option>
        </select>
      </td>
      <td className="border px-2 py-1">
        <BulkProductPhotoUpload photos={product.photos} onChange={photos => onChange('photos', photos)} />
      </td>
      <td className="border px-2 py-1">
        <button type="button" onClick={onRemove} className="text-red-600">Удалить</button>
      </td>
    </tr>
  );
};

export default BulkProductRow;
