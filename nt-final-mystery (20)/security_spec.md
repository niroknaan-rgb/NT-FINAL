# Security Specification

## Data Invariants
1. A participant registration must contain first name, last name, email, phone, birth date, and creation timestamp.
2. Anyone (including unauthenticated guest players) can register or read the table inside the game, but with strict validation to prevent malicious payloads or format pollution.

## The "Dirty Dozen" Payloads (Examples)
1. Missing `firstName` field.
2. Injected "Ghost Fields" (e.g., `role: 'admin'`).
3. Extremely large strings in `firstName` (e.g., 1MB text).
4. Wrong data types (e.g., `phone` is a number instead of string).
5. Extra fields not defined in the schema.

## Firestore Rules Draft
We will write the rules to `/firestore.rules` and verify them.
