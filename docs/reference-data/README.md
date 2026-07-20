# Adventure OS Reference Data

Reference datasets are verified real business cases used to validate Adventure OS implementations, including the MCP Cleanup Notion reference implementation, PostgreSQL, APIs, adapters, and future runtime applications.

Reference datasets contain normalized business facts. They do not define architecture, ontology, business rules, implementation decisions, schemas, statuses, formulas, or workflows.

Reference datasets must:

- preserve payer and participant distinctions;
- preserve source-provenance notes for major facts;
- avoid inferring unknown information;
- keep unresolved or unsupported facts visible for validation;
- remain independent from any single implementation runtime.

When an implementation cannot represent a reference-data fact, the fact stays in the reference dataset and the implementation validation report records the limitation as a friction point, missing representation, or Architecture Question.

