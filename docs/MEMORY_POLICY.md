# Adventure OS — Memory Policy

## Purpose

Adventure OS must preserve useful organisational context without creating an uncontrolled archive of personal data, guesses and outdated summaries.

This policy governs what the system may index, derive, retain and present as memory.

## Memory categories

### Source memory
Original records that remain in source systems: Drive files, emails, Plane tasks, Notion rows, Docmost pages, Adventure Hub records, Apple Notes and Reminders.

Adventure OS stores a reference and only the minimum approved indexed content needed for retrieval.

### Structured memory
Curated entities, relationships, events, decisions and facts stored in the Adventure OS database.

### Working memory
Temporary context used by an agent during one task or session. Working memory expires and is not automatically promoted to durable knowledge.

### Personal preference memory
Stable user preferences that improve interaction, such as concise communication or preferred operational terminology. This is separate from business records.

## What may become durable knowledge

A record may be promoted into structured memory when it is:

- explicitly confirmed by a human;
- directly supported by an authoritative system;
- a documented decision;
- a stable identifier or relationship;
- a maintained procedure or policy;
- a recurring preference useful across tasks.

## What must not become durable knowledge automatically

- unverified AI inference;
- private speculation about a person;
- transient moods or informal comments;
- secrets, access tokens, passwords or API keys;
- card, identity or sensitive health data beyond an approved operational need;
- full copies of source content when metadata and links are sufficient;
- obsolete facts without lifecycle status;
- hidden conclusions derived from unrelated personal data.

## Fact states

Durable statements use one of:

- `fact`: directly supported and current;
- `decision`: intentionally chosen by an authorised person;
- `preference`: a user or organisation preference;
- `inference`: a conclusion requiring confirmation;
- `question`: unresolved;
- `superseded`: once valid, replaced by newer information;
- `archived`: retained for history but not current.

## Confidence and provenance

Every stored fact or inference must include:

- source reference;
- observed date;
- confidence;
- responsible owner where known;
- last verification date;
- lifecycle status.

Summaries must link to supporting records. A summary without sources is navigation help, not authority.

## Retention

Retention is source- and data-class-specific.

Initial rules:

- source references remain while the source exists or the business record must be retained;
- semantic chunks are deleted when their source is removed or access is revoked;
- temporary agent working memory expires after task completion unless explicitly promoted;
- audit records follow a documented retention period;
- secrets are never retained in graph or vector storage;
- Apple Notes and Reminders are opt-in by folder/list and may use metadata-only indexing.

## Deletion and correction

The system must support:

- removing an indexed source and derived embeddings;
- correcting a fact without deleting the historical audit trail;
- marking information superseded;
- revoking a connector and stopping refresh;
- explaining which derived records depended on a deleted source.

## Personal and business separation

Personal information and business information can be connected only when operationally necessary and permitted.

The UI must support visibility domains such as:

- personal/private;
- Durmitor Adventure internal;
- project team;
- organisation-wide;
- public.

An agent cannot use a private source to answer an organisation-wide request unless the user explicitly authorises that use.

## Agent rules

Agents may:

- use working memory to complete a task;
- propose candidate entities and relations;
- create source-grounded summaries;
- ask for confirmation when ambiguity matters.

Agents may not:

- silently promote suggestions to facts;
- retain secrets;
- infer sensitive personal traits;
- use inaccessible sources as hidden evidence;
- continue indexing after access is revoked;
- present outdated information as current without warning.

## Review cadence

- connector scopes: review at setup and after permission changes;
- critical domain facts: verify when used for consequential actions;
- procedures and policies: review at least annually or on process change;
- inferred relationships: remain pending until accepted or rejected;
- stale records: surface visibly rather than silently discard.

## Practical rule

Adventure OS should remember **where trustworthy information is and how it relates**, not create a second uncontrolled copy of everything Boris has ever written.
