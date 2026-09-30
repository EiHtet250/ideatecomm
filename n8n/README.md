# MINT Adventure Guide: n8n backend

The Help, Feedback and Chatbot features call six n8n webhooks. All browser calls go through `src/services/n8nClient.ts`.

| Workflow (file) | Method and path | Purpose |
| --- | --- | --- |
| MINT - Chat (`workflows/mint-chat.json`) | `POST /webhook/mint/chat` | Visitor chatbot (AI Agent + DeepSeek + window memory) |
| MINT - Help Create (`workflows/mint-help-create.json`) | `POST /webhook/mint/help` | Visitor sends a help request |
| MINT - Help List (`workflows/mint-help-list.json`) | `GET /webhook/mint/help` | Staff list of requests |
| MINT - Help Update Status (`workflows/mint-help-update-status.json`) | `POST /webhook/mint/help/status` | Staff change a request's status |
| MINT - Feedback Create (`workflows/mint-feedback-create.json`) | `POST /webhook/mint/feedback` | Optional visitor feedback from the Help page |
| MINT - Feedback List (`workflows/mint-feedback-list.json`) | `GET /webhook/mint/feedback` | Staff view of feedback (Staff Home card and Visitor Feedback tab) |

Production URLs use `/webhook/`. The `/webhook-test/` URLs only work while a workflow is open in the editor and listening. Workflows must be **active** for the production URLs to work.

## Required header

Every request must send:

```
x-mint-key: <shared key>
```

The key is stored in an n8n **Header Auth** credential named `MINT - x-mint-key` (header name `x-mint-key`). The front end reads the same value from `VITE_N8N_API_KEY` in `.env.local`.

> `VITE_` variables are bundled into the built JavaScript, so anyone can read this key. It is only a prototype deterrent, not real security. Staff routes still need real authentication.

A missing or wrong key is rejected by n8n before the workflow runs: **HTTP 403** with the plain-text body `Authorization data is wrong!` (n8n's built-in Header Auth cannot return a custom body). `n8nClient.ts` turns 401 and 403 into an `AUTH` error.

## Response envelope

Every workflow path ends in a Respond to Webhook node, so the browser never hangs.

```json
{ "ok": true, "data": { } }
{ "ok": false, "error": { "code": "VALIDATION" | "AUTH" | "SERVER", "message": "Plain-language message" } }
```

| Status | When |
| --- | --- |
| 200 | Success |
| 400 | `VALIDATION`: missing, empty, too long or not-allowed values |
| 403 | Missing or wrong `x-mint-key` (plain text, from n8n) |
| 404 | `VALIDATION`: help request id not found (status update only) |
| 500 | `SERVER`: a node failed (for example the chat model) |

## Endpoints

### POST /mint/chat

Request: `{ "sessionId": "uuid", "message": "What time do you open?", "language": "en" }`

- `message`: required, 1 to 500 characters after trimming.
- `sessionId`: required, up to 64 characters (letters, numbers, `-`, `_`). Used as the memory key.
- `language`: `en`, `zh`, `ms` or `ta`. Defaults to `en`. This is only the **fallback**: the assistant replies in the language the visitor writes in (including romanised pinyin such as "ni hao"), and uses `language` only when it cannot tell.

Response: `{ "ok": true, "data": { "reply": "...", "suggestStaff": false } }`

The assistant only answers from the **Approved Information** Set node, which holds the team's knowledge base.

- Source file: [`knowledge/MINT_Chatbot_Knowledge_Base.md`](knowledge/MINT_Chatbot_Knowledge_Base.md). The node contains a compacted copy (table padding removed, about 34,000 characters).
- To update: edit the source file, then paste its text into the node's `approvedInfo` value (or ask Member 3 to redeploy), save, and keep the workflow active.
- The assistant follows the reliability levels in Section 14 of the document: official facts are stated plainly, reported facts are labelled as reported, and unconfirmed topics are referred to staff or the contact details.
- Write the document in English. The assistant translates it and keeps phone numbers, email, address and times exactly as written.

`suggestStaff` is set by the model and also forced to `true` when the visitor message contains emergency words in English, Chinese, Malay or Tamil (see the **Format Reply** node). This is the hook for a future human-in-the-loop handover.

### POST /mint/help

Request: `{ "area": "Level 3", "areaSource": "manual", "description": "I need help with the lift." }`

- `area`: 1 to 100 characters. `areaSource`: `manual` or `lastScanned`. `description`: 1 to 500 characters.
- Control characters are stripped. No name, email or other personal data is collected.

Response: `{ "ok": true, "data": { "id": 1, "area": "...", "areaSource": "manual", "description": "...", "status": "new", "createdAt": "ISO date" } }`

### GET /mint/help?status=new

`status` is optional (`new`, `in_progress`, `resolved`). Returns newest first, at most 100.

Response: `{ "ok": true, "data": { "items": [ { "id", "area", "areaSource", "description", "status", "createdAt", "updatedAt" } ] } }`

### POST /mint/help/status

Request: `{ "id": 1, "status": "in_progress" }`

Response: `{ "ok": true, "data": { ...updated row } }`, or 404 `VALIDATION` if the id does not exist.

### POST /mint/feedback

Request: `{ "rating": 4, "comment": "The map was easy to use." }`

- `rating`: required whole number from 1 (very hard) to 5 (very easy).
- `comment`: optional, up to 500 characters. Control characters are stripped. No personal data is asked for.

Response: `{ "ok": true, "data": { "id": 1, "rating": 4, "comment": "...", "createdAt": "ISO date" } }`

### GET /mint/feedback

Staff only (Staff Home card and the Visitor Feedback tab at `/staff/feedback`, both refresh every 10 seconds). Returns newest first, at most 100.

Response: `{ "ok": true, "data": { "items": [ { "id", "rating", "comment", "createdAt" } ] } }`

## Data Table: `feedback`

| Column | Type | Values |
| --- | --- | --- |
| `rating` | number | 1 to 5 |
| `comment` | string | Optional visitor comment (may be empty) |

## Data Table: `help_requests`

| Column | Type | Values |
| --- | --- | --- |
| `area` | string | Area given by the visitor |
| `areaSource` | string | `manual` or `lastScanned` |
| `description` | string | Visitor's message |
| `status` | string | `new`, `in_progress`, `resolved` |

`id`, `createdAt` and `updatedAt` are built in. Do not add them as columns. The app shows `in_progress` as "In progress".

## Importing into another n8n instance

The exported files contain **no credentials**. After importing you must reconnect them.

1. Create the Data Tables `help_requests` (four string columns) and `feedback` (`rating` number, `comment` string) as described above.
2. Create credentials:
   - **Header Auth** named `MINT - x-mint-key`: Name `x-mint-key`, Value a long random string (put the same value in `.env.local`).
   - **DeepSeek** API credential for the chat model.
3. In n8n, **Workflows → Add workflow → ⋯ → Import from File**, once per JSON file.
4. In each workflow:
   - Open the **Webhook** node, set Authentication → Header Auth → `MINT - x-mint-key`.
   - Check **Options → Allowed Origins (CORS)**. Replace `https://REPLACE-WITH-DEPLOYED-ORIGIN` with the deployed site's origin, keep `http://localhost:5173` for development.
   - In **MINT - Chat**, open **DeepSeek Chat Model** and pick the DeepSeek credential.
   - In the Help workflows, check each **Data table** node points at `help_requests`; in **MINT - Feedback Create** and **MINT - Feedback List**, at `feedback`.
5. Save, then toggle each workflow to **Active** (top right).
6. Copy the production base URL (`https://<your-n8n>/webhook/mint`) into `VITE_N8N_BASE_URL` in `.env.local`, then restart `npm run dev`.

## Quick test

```bash
curl -X POST "https://<your-n8n>/webhook/mint/help" \
  -H "Content-Type: application/json" -H "x-mint-key: <key>" \
  -d '{"area":"Level 1","areaSource":"manual","description":"Test request"}'
```
