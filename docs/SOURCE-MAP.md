# Source Map

This is the working inventory for systems that may feed Adventure OS. No source is connected by default unless its status explicitly says otherwise.

Source systems do not define the canonical domain. They expose, store or execute parts of the model defined by Adventure OS.

| Source | Typical content | Initial mode | Authority status | Notes |
|---|---|---:|---|---|
| Adventure Hub | daily operations, bookings, adventure catalogue, guests, guides, pricing | Read-only | Operational authority within confirmed API scope | Do not infer unsupported booking, capacity, payment or reporting endpoints |
| Plane | operational tasks | Read/write through approved integration | Task authority | Live integration; whether Plane should also own Projects and Ideas remains open |
| Notion | multiday groups, participants, payments, expenses, allocations | Read-only | Transitional authority | Audit duplicate relations before integration or migration |
| Google Drive | documents, spreadsheets, Excel/Numbers exports, offers, contracts, media references, PDFs and legacy files | Search/read | Mixed | File-level source and freshness must be shown |
| Gmail | client and partner communication, attachments | Search/read | Communication record | Never send without approval |
| Google Calendar | meetings, tours, deadlines | Read-only | Calendar authority | Respect calendar-level permissions |
| Payload CMS | new website content, media metadata and SEO | Read-only | Public-content authority | Separate each brand/application |
| Docmost | maintained internal wiki and documentation | Read-only | Intended knowledge authority | Confirm adoption, ownership and maintained spaces during source audit |
| Documenso | waivers, agreements, signing state and signed outputs | Read-only | Signature authority | Sensitive access |
| Mattermost | internal team communication | Search/read | Intended internal communication record | Index only approved channels |
| Chatwoot | proposed unified guest communication: email, WhatsApp, Viber, website chat, Messenger and Instagram DM | Discovery/proposed | Not authoritative | Important candidate for the guest communication layer; implementation not yet confirmed |
| Wandero | current guest-facing AI/chat experience | Current external tool | Replaceable adapter | Expensive for the present value; not part of the canonical domain |
| n8n | automation runs and integration events | Read-only | Execution log | Write automation added only after stable workflows |
| Local files | Numbers, Excel, PDFs, screenshots, notes | Manual/import | Mixed | Preserve originals and checksums |
| ChatGPT history | decisions, drafts and project context | Curated import | Context only | Convert confirmed decisions into durable records |
| WhatsApp / Viber | operational and guest conversations | Manual/approved import until channel integration exists | Communication record | Privacy and consent review required |
| WSPay / Monri and banking | payment processor and bank records | Discovery/read-only | Financial source, scope to confirm | Canonical finance ownership and fiscalisation boundaries remain open |
| Outdooractive | routes, activity content and maps | Discovery/read-only | External route/content source | Map into canonical Experience and Resource entities |

## Inventory fields

Every discovered source or collection should record:

- owner;
- location;
- data types;
- covered period;
- freshness;
- personal-data classification;
- authoritative status;
- related entities;
- duplicates and known problems;
- proposed future role.
