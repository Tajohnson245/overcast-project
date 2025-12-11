<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: N/A → 1.0.0 (Initial Release)

Modified Principles: N/A (Initial constitution)

Added Sections:
  - Core Principles (5 principles)
  - Coding Standards
  - Development Workflow
  - Governance

Removed Sections: N/A

Templates Requiring Updates:
  ✅ plan-template.md - No changes required (compatible with principles)
  ✅ spec-template.md - No changes required (compatible with principles)
  ✅ tasks-template.md - No changes required (compatible with principles)

Follow-up TODOs: None
================================================================================
-->

# Overcast Project Constitution

## Core Principles

### I. Simplicity First

All code MUST prioritize simplicity over cleverness or optimization.

- Write code that does ONE thing well
- Avoid premature optimization - make it work first, then make it fast if needed
- When choosing between two solutions, pick the simpler one
- Complex patterns (factories, abstract classes, decorators) MUST be justified

**Rationale**: Simple code is easier to debug, maintain, and understand. Newcomers
can contribute faster when the codebase stays simple.

### II. Readability Over Cleverness

Code MUST be written for humans to read, not just for machines to execute.

- Use descriptive variable and function names (e.g., `getUserEmail()` not `gue()`)
- Keep functions short (aim for under 30 lines)
- One concept per function - if you need "and" to describe it, split it
- Avoid nested ternaries, complex one-liners, or "clever" tricks

**Rationale**: Code is read far more often than it is written. Clear code reduces
bugs and speeds up development.

### III. Comprehensive Comments

All code MUST include comments that explain the "why", not just the "what".

- Every file MUST have a brief header comment explaining its purpose
- Complex logic MUST be preceded by a comment explaining the approach
- Non-obvious decisions MUST be documented (e.g., "Using setTimeout here because...")
- TODO comments are acceptable but MUST include context and owner

**Rationale**: Comments help newcomers understand decisions and context that the
code alone cannot convey.

### IV. Beginner Accessibility

Code MUST be accessible to developers who are relatively new to full-stack development.

- Avoid advanced patterns unless necessary (e.g., generics, metaprogramming)
- When using frameworks or libraries, link to relevant documentation
- Prefer explicit code over "magic" (implicit behavior)
- Error messages MUST be helpful and actionable

**Rationale**: An accessible codebase grows a stronger team. If a newcomer can't
understand it, the code is probably too complex.

### V. File Minimization

Consolidate code into fewer files wherever possible.

- Avoid creating a new file for every small utility or type
- Group related functionality together in single files
- Only split files when they exceed ~300 lines or serve genuinely different purposes
- Prefer colocating components with their styles and tests when practical

**Rationale**: Fewer files means less context-switching and easier navigation.
A sprawling file structure often signals over-engineering.

## Coding Standards

These standards apply to the Overcast Project tech stack (Next.js / TypeScript):

- **TypeScript**: Use strict mode. Prefer `interface` over `type` for objects.
  Use meaningful type names, not abbreviations.
- **React Components**: Use functional components with hooks. Keep state minimal.
  Extract repeated JSX into components only when used 3+ times.
- **Styling**: Use Tailwind CSS classes inline. Avoid creating custom CSS files
  unless absolutely necessary.
- **File Structure**: Keep related code together. A component's logic, types,
  and tests can live in the same file until it grows unwieldy.
- **Imports**: Use absolute imports with `@/` prefix. Group imports logically
  (React, external libs, internal modules).
- **Naming**: Files use kebab-case. Components use PascalCase. Functions and
  variables use camelCase.

## Development Workflow

- **Start Small**: Implement the simplest version first. Add complexity only
  when requirements demand it.
- **Test Manually First**: For newcomer-friendly projects, manual testing is
  acceptable. Automated tests are welcome but not required for every feature.
- **Commit Often**: Small, focused commits with clear messages. One logical
  change per commit.
- **Ask Questions**: If something is unclear, ask before implementing. It's
  better to clarify than to build the wrong thing.
- **Review for Readability**: When reviewing code, the primary question is:
  "Would a newcomer understand this?"

## Governance

This constitution establishes the core development philosophy for the Overcast
Project. All contributors MUST follow these principles.

**Amendment Procedure**:
1. Propose changes via documentation update request
2. Discuss rationale and impact with team
3. Update version number and last amended date
4. Update any affected templates if principles change

**Versioning Policy**:
- MAJOR: Removing or fundamentally changing a principle
- MINOR: Adding new principles or sections
- PATCH: Clarifications, wording improvements, typo fixes

**Compliance**:
- All code contributions SHOULD be reviewed against these principles
- Violations MUST be justified in code comments or PR description
- When in doubt, simplicity wins

**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
