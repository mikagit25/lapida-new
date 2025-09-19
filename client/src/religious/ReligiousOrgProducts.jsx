// Управление товарами религиозной организации
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import religiousProductService from '../services/religiousProductService';
import ProductForm from './ProductForm';
import ProductListItem from './ProductListItem';

const initialProduct = { name: '', description: '', price: '', image: '', available: true };


const ReligiousOrgProducts = ({ orgId, isOwner }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialProduct);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загрузка товаров при монтировании
  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    religiousProductService.getByOrganization(orgId)
      .then(setProducts)
  .catch(() => setError(t('religiousOrgProducts.loadError')))
      .finally(() => setLoading(false));
  }, [orgId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let newProduct;
      if (editId) {
        newProduct = await religiousProductService.update(editId, { ...form, organization: orgId });
        setProducts(products.map(p => (p._id === editId ? newProduct : p)));
        setEditId(null);
        setEditIndex(null);
      } else {
        newProduct = await religiousProductService.create({ ...form, organization: orgId });
        setProducts([...products, newProduct]);
      }
      setForm(initialProduct);
    } catch (err) {
  setError(t('religiousOrgProducts.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(products[idx]);
    setEditIndex(idx);
    setEditId(products[idx]._id);
  };

  const handleDelete = async (idx) => {
    const id = products[idx]._id;
    setLoading(true);
    setError('');
    try {
      await religiousProductService.remove(id);
      setProducts(products.filter((_, i) => i !== idx));
      if (editIndex === idx) {
        setEditIndex(null);
        setEditId(null);
      }
    } catch (err) {
  setError(t('religiousOrgProducts.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>{t('religiousOrgProducts.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ProductForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editIndex={editIndex}
        onCancel={() => { setForm(initialProduct); setEditIndex(null); setEditId(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul className="product-list">
        {products.map((p, idx) => (
          <ProductListItem
            key={p._id || idx}
            product={p}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
          />
        ))}
      </ul>
    </section>
  );
};

export default ReligiousOrgProducts;
