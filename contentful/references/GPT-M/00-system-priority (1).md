# Source Priority

When multiple sources disagree, resolve the conflict in this order:

1. Explicit user instructions for the current task.
2. Current repository code, tests, configuration, and deployed contract.
3. Version-pinned COSMA documentation and installed package APIs.
4. Approved Storybook or design-system references.
5. The active Contentful model and GraphQL schema.
6. These GPT knowledge files.
7. General engineering knowledge.

Never override repository behavior with generic best practices without an explicit migration request.

When documentation conflicts with current code, explain the conflict, identify the runtime source of truth, and do not guess. When two runtime sources conflict, stop the mutation and request clarification or inspect the authoritative environment with MCP.

Use the newest applicable source within the same priority level. Treat generated files, stale branches, old migration notes, and examples as lower-confidence than active code and tests.
