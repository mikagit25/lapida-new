import React from 'react';
import BulkProductRow from './BulkProductRow';

const BulkProductTable = ({ products, setProducts, selectedProducts, setSelectedProducts }) => {
  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleRemove = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
    setSelectedProducts(selectedProducts.filter(i => i !== index));
  };

  const handleSelect = (index) => {
    if (selectedProducts.includes(index)) {
      setSelectedProducts(selectedProducts.filter(i => i !== index));
    } else {
      setSelectedProducts([...selectedProducts, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((_, idx) => idx));
    }
  };

  return (
    <table className="min-w-full border mt-6">
      <thead>
        <tr>
          <th className="border px-2 py-1">
            <input type="checkbox" checked={selectedProducts.length === products.length && products.length > 0} onChange={handleSelectAll} />
          </th>
          <th className="border px-2 py-1">Название</th>
          <th className="border px-2 py-1">Описание</th>
          <th className="border px-2 py-1">Цена</th>
          <th className="border px-2 py-1">Категория</th>
          <th className="border px-2 py-1">Артикул</th>
          <th className="border px-2 py-1">Остаток</th>
          <th className="border px-2 py-1">Ед. изм.</th>
          <th className="border px-2 py-1">Статус</th>
          <th className="border px-2 py-1">Фото</th>
          <th className="border px-2 py-1">Действия</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, idx) => (
          <BulkProductRow
            key={idx}
            product={product}
            onChange={(field, value) => handleChange(idx, field, value)}
            onRemove={() => handleRemove(idx)}
            selected={selectedProducts.includes(idx)}
            onSelect={() => handleSelect(idx)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default BulkProductTable;
