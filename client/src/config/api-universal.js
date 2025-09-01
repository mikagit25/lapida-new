const API_BASE_URL = `${window.location.origin}/api`;

export async function findWorkingApiUrl() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        if (response.ok) {
            const json = await response.json();
            if (json && json.app === 'lapida') {
                return API_BASE_URL;
            }
        }
    } catch (error) {}
    return API_BASE_URL;
}

export { API_BASE_URL };
