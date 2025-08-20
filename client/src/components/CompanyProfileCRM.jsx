
const CompanyProfileCRM = ({ companyData }) => {
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      setCreated(true);
    } catch (e) {
      setError('Ошибка при создании компании');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Можно автоматически создавать компанию при первом рендере
    // handleCreateCompany();
  }, []);

  return (
    <div>
      <h2>Профиль компании</h2>
      <pre>{JSON.stringify(companyData, null, 2)}</pre>
      <button onClick={handleCreateCompany} disabled={loading || created} style={{ padding: '8px 16px' }}>
        {loading ? 'Создание...' : created ? 'Компания создана!' : 'Создать компанию в CRM'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

// CRM integration removed
