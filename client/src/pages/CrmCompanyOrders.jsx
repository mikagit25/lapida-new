
const CrmCompanyOrders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [crmId, setCrmId] = useState('');

  useEffect(() => {
    // Получаем crmId компании по id сайта
    fetch(`/api/companies/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log('Ответ API компании:', data);
        if (data.company && data.company.crmId) {
          setCrmId(data.company.crmId);
          return getCompanyOrders(data.company.crmId);
        } else {
          console.error('CRM-ID компании не найден! company:', data.company);
          throw new Error('CRM-ID компании не найден');
        }
      })
      .then(res => {
        setOrders(res.data.list || res.data || []);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || 'Ошибка загрузки заказов');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">CRM: Заказы компании</h1>
        <p>Страница заказов компании в CRM. ID компании: <span className="font-mono">{id}</span></p>
        {loading ? (
          <div>Загрузка заказов...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">Список заказов</h2>
            {orders.length === 0 ? (
              <div>Заказы не найдены.</div>
            ) : (
              <ul className="space-y-2">
                {orders.map(order => (
                  <li key={order.id || order._id} className="border rounded p-3">
                    <div><b>ID заказа:</b> {order.id || order._id}</div>
                    <div><b>Статус:</b> {order.status || order.stageName}</div>
                    <div><b>Дата:</b> {order.createdAt || order.dateCreated}</div>
                    {/* Добавьте другие поля заказа по необходимости */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// CRM integration removed
