import React from 'react';

const ProductForm = ({ form, onChange, onSubmit, loading, editIndex, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="product-form">
      <input name="name" value={form.name} onChange={onChange} placeholder={t('religiousOrgProducts.name')} required />
      <textarea name="description" value={form.description} onChange={onChange} placeholder={t('religiousOrgProducts.description')} />
      <input name="price" value={form.price} onChange={onChange} placeholder={t('religiousOrgProducts.price')} type="number" min="0" />
      <input name="image" value={form.image} onChange={onChange} placeholder={t('religiousOrgProducts.image')} />
      <label>
        <input name="available" type="checkbox" checked={form.available} onChange={onChange} /> {t('religiousOrgProducts.available')}
      </label>
      <button type="submit" disabled={loading}>{editIndex !== null ? t('common.save') : t('common.add')}</button>
      {editIndex !== null && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default ProductForm;
