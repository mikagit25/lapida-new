// productFields.js — единая схема для товара, используется для формы, импорта, шаблона

const productFields = [
  {
    key: 'name',
    label: { ru: 'Название', en: 'Name' },
    type: 'string',
    required: true,
  },
  {
    key: 'description',
    label: { ru: 'Описание', en: 'Description' },
    type: 'string',
    required: false,
  },
  {
    key: 'price',
    label: { ru: 'Цена', en: 'Price' },
    type: 'number',
    required: true,
  },
  {
    key: 'category',
    label: { ru: 'Категория', en: 'Category' },
    type: 'string',
    required: false,
  },
  {
    key: 'sku',
    label: { ru: 'Артикул', en: 'SKU' },
    type: 'string',
    required: false,
  },
  {
    key: 'quantity',
    label: { ru: 'Остаток', en: 'Quantity' },
    type: 'number',
    required: false,
  },
  {
    key: 'unit',
    label: { ru: 'Ед. изм.', en: 'Unit' },
    type: 'string',
    required: false,
  },
  {
    key: 'status',
    label: { ru: 'Статус', en: 'Status' },
    type: 'string',
    required: false,
    options: ['active', 'hidden'],
  },
  {
    key: 'tags',
    label: { ru: 'Теги', en: 'Tags' },
    type: 'string',
    required: false,
    description: 'Теги через запятую',
  },
  {
    key: 'rating',
    label: { ru: 'Рейтинг', en: 'Rating' },
    type: 'number',
    required: false,
  },
  {
    key: 'photos',
    label: { ru: 'Фото', en: 'Photo' },
    type: 'string',
    required: false,
    description: 'Список файлов через запятую или ссылки',
  },
];

export default productFields;
