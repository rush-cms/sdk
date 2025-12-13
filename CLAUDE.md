# RushCMS SDK - Developer Guidelines

## MANDATORY CODING STANDARDS - NEVER VIOLATE THESE:
1. ALWAYS use single quotes ('), NEVER double quotes. **Exception**: JSON strings, chadcn/ui files
2. NEVER add semicolons at the end of `ts` and `tsx` lines
3. ALL files must be kebab-case (rush-cms-client.ts, not RushCMSClient.ts)
4. **NEVER** inline comments `// this is an inline comment`
5. Use tab for indentation with size 4 (tab size = 4)
6. No trailing commas in objects/arrays
7. Use `pnpm` for package management
8. This is a **MONO REPO**, all packages are in `packages/` directory

### Examples
```typescript
// ✅ CORRECT
const message = 'Hello World'
const config = {
	name: 'RushCMS',
	version: '1.0.0'
}

// ❌ WRONG
const message = "Hello World";  // Never use double quotes or semicolons
const config = {
    name: "RushCMS",  // Wrong: spaces instead of tabs
    version: "1.0.0", // No trailing comma
};
```

## CORE STACK
- **Monorepo Manager**: Turbo + Lerna
- **Package Manager**: pnpm
- **Languages**: TypeScript, React
- **Bundler**: tsup (for libraries)
- **Packages**:
  - `@rushcms/client`: The core JS/TS client
  - `@rushcms/react`: React hooks and components
  - `@rushcms/types`: Shared type definitions

## COMMANDS

### Root (Run from `/`)
- `pnpm build`: Build all packages (uses turbo)
- `pnpm dev`: Run all packages in watch mode
- `pnpm lint`: Lint all packages
- `pnpm test`: Run tests across packages
- `pnpm clean`: Clean `dist` and `node_modules`

## ORGANIZATION & STRUCTURE
Use `.ai/` directory (gitignored):

```bash
.ai/
    ├── current-sprint.md    # Active sprint only
    ├── backlog.md           # Future tasks and ideas
    ├── context.md           # State between sessions
    ├── features/            # Implemented features, by name
    ├── reports/             # Reports and Analysis by date
    ├── completed/           # Archived sprints by date
    ├── notes/               # Quick thoughts, blockers, ideas by date
    └── decisions/           # Architectural decisions by 
    
# date and file format: (YYYY-MM-DD-{title}.md)
```

## SPRINT MANAGEMENT

### RULES
- Work in `current-sprint.md` for active tasks
- Move completed sprints to `completed/YYYY-MM-DD.md`
- Use checkboxes `[ ]` for task tracking
- Record estimated vs actual time
- Future ideas go in `backlog.md`

### SPRINT FORMAT
```markdown
## Sprint #3 - Feature Name

**Started**: 2025-01-15 09:00
**Estimated**: 4 hours
**Status**: IN_PROGRESS / COMPLETED
**Priority**: High / Medium / Low

### Tasks
- [x] Task description [P1]
- [ ] Another task [P2]

### Dependencies
- Task B depends on: Task A

**Ended**: 2025-01-15 14:30
**Actual**: 5.5 hours

### Sprint Metrics
- **Velocity**: 2/4 tasks (50%)
- **Time Accuracy**: 5.5h / 4h = 137%
- **Blockers**: 0

**Notes**: Any important learnings
```

### Priority Levels
- **[P1]** Critical - Must complete this sprint
- **[P2]** High - Should complete this sprint
- **[P3]** Medium - Nice to have
- **[P4]** Low - Can move to backlog

---

## Definition of Done

Task complete when ALL checked:

### Code Quality
- [ ] TypeScript: No `any` types, use strict mode
- [ ] No commented-out code
- [ ] No debug statements (console.log, debugger)
- [ ] Code follows all mandatory coding standards
- [ ] Public API is properly typed and exported

### Functionality
- [ ] Works as specified in the implementation plan
- [ ] Edge cases handled gracefully
- [ ] Error handling is robust (RushCMSError, etc.)

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests passing (where applicable)
- [ ] No regressions in other packages

### Performance
- [ ] Bundle size optimized (check with `tsup` output)
- [ ] No unnecessary dependencies added

### Documentation
- [ ] Types are well-documented (JSDoc)
- [ ] README updated for the specific package if API changed
- [ ] Sprint file updated with progress

### Git
- Attomic commit per feature
- Commit message follows conventional commits

---

## CONTEXT MANAGEMENT

### Before Clearing Context
**ALWAYS update these files**:

1. **`.ai/current-sprint.md`**
- Mark completed tasks `[x]`
- Add new tasks discovered
- Update time spent

2. **`.ai/context.md`**
```markdown
## Last Updated: [timestamp]

## Current State
- Working on: [specific feature/file]
- Last completed: [what finished]
- Next task: [where to continue]
- Current file: [path/to/file.ts]

## Important Context
- [Decisions made]
- [Blockers encountered]
- [Dependencies to remember]

## Code in Progress
- [Exact function/component being edited]
- [Uncommitted logic or approach]
```

3. **Save work state**
- Ensure all files are saved
- Note uncommitted changes in context.md

### After Clearing Context
Start a new session with: "Continue from last session following CLAUDE.md guidelines"

