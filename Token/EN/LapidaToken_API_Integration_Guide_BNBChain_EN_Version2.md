# Lapida Token — API Integration Guide (BNB Chain)

---

## 1. Introduction

Lapida Token provides public APIs for interacting with the platform:  
- Token balances & transfers  
- Memorial management (NFT)  
- DAO voting & proposals  
- Reserve info & analytics

APIs are designed for partners, developers, wallets, and third-party platforms.

---

## 2. API Specification & Access

- **REST API:** [lapida.one/api/docs](https://lapida.one/api/docs)
- **GraphQL:** [lapida.one/api/graphql](https://lapida.one/api/graphql)
- **Swagger/OpenAPI:** [lapida.one/api/swagger](https://lapida.one/api/swagger)

**Base URL:**  
`https://lapida.one/api/v1/`

---

## 3. Authentication

- **Public endpoints:** Most read-only data (prices, stats, proposals) is open.
- **Private endpoints:** Require API key (JWT) or wallet signature (Web3).
- **Register for API key:** [lapida.one/api/register](https://lapida.one/api/register)

**Header Example:**
```http
Authorization: Bearer <your_api_token>
```

---

## 4. Request & Response Format

- All requests use JSON.
- Standard HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.

**Example Request (curl):**
```bash
curl -X GET "https://lapida.one/api/v1/balance?address=0x123..." -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "address": "0x123...",
  "LPD": "100.00",
  "MLPD": "50.00",
  "GLPD": "10.00"
}
```

---

## 5. Key Endpoints

### 5.1. Balances

- **GET /balance?address=0x...**  
  Returns user token balances.

### 5.2. Transactions

- **GET /tx?address=0x...**  
  Lists token transactions for address.

### 5.3. Memorials (NFTs)

- **GET /memorials?owner=0x...**  
  List user's memorial NFTs.

- **POST /memorials**  
  Create a new memorial NFT (requires wallet signature).

### 5.4. DAO Governance

- **GET /dao/proposals**  
  List active proposals.

- **POST /dao/vote**  
  Submit vote (requires wallet signature, GLPD balance).

### 5.5. Reserve Info

- **GET /reserve**  
  Returns stablecoin reserve stats.

### 5.6. Tokenomics

- **GET /tokenomics**  
  Returns token supply, distribution, vesting info.

---

## 6. Web3 Integration

- Lapida API supports EVM wallet authentication (MetaMask, WalletConnect).
- Sign requests with wallet for sensitive actions (vote, NFT minting).
- Direct contract calls via [BNB Chain RPC](https://docs.bnbchain.org/docs/rpc).

**Example (Web3.js):**
```js
const signature = await web3.eth.personal.sign("Login Lapida", userAddress, password);
```

---

## 7. Error Handling

- HTTP status codes:  
  `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `429 Too Many Requests`, `500 Server Error`

- Error response example:
```json
{
  "error": "Unauthorized",
  "code": 401,
  "message": "API token missing or invalid"
}
```

---

## 8. Rate Limits & Security

- Rate limits: 100 requests/min per API key (stricter for write operations).
- CORS: Allowed for trusted domains, contact support for whitelisting.
- Sensitive actions require wallet signatures, anti-abuse monitoring.

---

## 9. Code Examples

**Python (requests):**
```python
import requests

response = requests.get(
    "https://lapida.one/api/v1/balance?address=0x123...",
    headers={"Authorization": "Bearer <token>"}
)
print(response.json())
```

**JavaScript (fetch):**
```js
fetch("https://lapida.one/api/v1/dao/proposals", {
  headers: { "Authorization": "Bearer <token>" }
}).then(res => res.json()).then(console.log);
```

---

## 10. FAQ & Support

- **API docs:** [lapida.one/api/docs](https://lapida.one/api/docs)
- **Support:** [lapida.one/support](https://lapida.one/support)
- **Telegram:** [t.me/lapida_one](https://t.me/lapida_one)
- **GitHub Issues:** [github.com/lapida-project/issues](https://github.com/lapida-project/issues)

---

*For advanced integrations, see the full developer portal and smart contract ABIs on GitHub.*
