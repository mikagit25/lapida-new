
const ContactProfileCRM = ({ contactData }) => {
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateContact = async () => {
    setLoading(true);
    setError(null);
    try {
      setCreated(true);
    } catch (e) {
      setError('Ошибка при создании пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Можно автоматически создавать контакт при первом рендере
    // handleCreateContact();
  }, []);

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <pre>{JSON.stringify(contactData, null, 2)}</pre>
      <button onClick={handleCreateContact} disabled={loading || created} style={{ padding: '8px 16px' }}>
        {loading ? 'Создание...' : created ? 'Пользователь создан!' : 'Создать пользователя в CRM'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

// CRM integration removed
