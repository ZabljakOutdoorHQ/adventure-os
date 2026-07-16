# Source Map

This is the working inventory for systems that may feed Adventure OS. No source is connected by default.

| Source | Typical content | Initial mode | Authority status | Notes |
|---|---|---:|---|---|
| Adventure Hub | bookings, activities, guests, guides | Read-only | To confirm per entity | Likely operational authority for daily activities |
| Notion | multiday groups, participants, payments, expenses, allocations | Read-only | Transitional | Audit duplicate relations before integration |
| Google Drive | documents, sheets, offers, contracts, media references | Search/read | Mixed | File-level source and freshness must be shown |
| Gmail | client and partner communication, attachments | Search/read | Communication record | Never send without approval |
| Google Calendar | meetings, tours, deadlines | Read-only | Calendar authority | Respect calendar-level permissions |
| Payload CMS | website content and media metadata | Read-only | Public content authority | Separate each brand/application |
| Docmost | internal documentation | Read-only | Knowledge candidate | Confirm adoption and ownership |
| Documenso | agreements and signatures | Read-only | Signature record | Sensitive access |
| Mattermost | team communication | Search/read | Communication record | Index only approved channels |
| n8n | automation runs and integration events | Read-only | Execution log | Write automation added only after stable workflows |
| Local files | Numbers, Excel, PDFs, screenshots, notes | Manual/import | Mixed | Preserve originals and checksums |
| ChatGPT history | decisions, drafts and project context | Curated import | Context only | Convert confirmed decisions into durable records |
| WhatsApp | operational conversations | Manual/approved import | Communication record | Privacy and consent review required |

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
