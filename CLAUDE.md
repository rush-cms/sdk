# Developer Guidelines & Best Practices

## MANDATORY CODING STANDARDS - NEVER VIOLATE THESE:
1. ALWAYS use single quotes ('), NEVER double quotes
2. NEVER add semicolons at the end of `ts` and `tsx` lines
3. ALL files must be kebab-case (tech-detector.tsx, not TechDetector.tsx)
4. **NEVER** inline comments `// this is an inline comment`
5. Use tab for indentation with size 4 (tab size = 4)
6. No trailing commas in objects/arrays
7. Tailwind classes only, no custom CSS unless absolutely necessary
8. This is a **MONO REPO**, so there'll be a lot of projects here in subfolders

### Examples
```typescript
// ✅ CORRECT
const message = 'Hello World'
const config = {
	name: 'TechRadar',
	version: '1.0.0'
}

// ❌ WRONG
const message = "Hello World";  // Never use double quotes or semicolons
const config = {
    name: "TechRadar",  // Wrong: spaces instead of tabs
    version: "1.0.0", // No trailing comma
};
```

## CORE STACK
Read `package.json` for complete information

## PROJECT MANAGEMENT

## ORGANIZATION & STRUCTURE
Use `.ia/` directory (gitignored):

```bash
.ia/
    ├── current-sprint.md    # Active sprint only
    ├── backlog.md           # Future tasks and ideas
    ├── completed/           # Archived sprints by date (YYYY-MM-DD.md)
    ├── notes.md             # Quick thoughts, blockers, ideas
    ├── context.md           # State between sessions
    └── decisions.md         # Architectural decisions
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

### Functionality
- [ ] Works as specified across all extension contexts
- [ ] Edge cases handled gracefully
- [ ] User-friendly error messages
- [ ] Loading states implemented
- [ ] Responsive design (popup works at different sizes)

### Chrome Extension Specific
- [ ] Works in all required contexts (popup, content, background)
- [ ] Message passing implemented correctly
- [ ] Permissions properly declared in manifest
- [ ] CSP compliant (no inline scripts)
- [ ] Storage API used correctly
- [ ] Background service worker properly event-driven

### Testing
- [ ] Tests written and passing
- [ ] Unit tests for business logic
- [ ] Integration tests for Chrome APIs
- [ ] Tests actually test the feature
- [ ] Manual testing in Chrome with extension loaded
- [ ] No console errors in browser DevTools

### Performance
- [ ] Bundle size optimized (check with build output)
- [ ] No memory leaks (test with Chrome Task Manager)
- [ ] Efficient DOM operations in content scripts
- [ ] Cached results when appropriate
- [ ] Background service worker properly terminates when idle

### Security
- [ ] Input validated and sanitized
- [ ] No eval() or unsafe innerHTML usage
- [ ] CSP headers properly configured
- [ ] No sensitive data in logs or storage
- [ ] XSS protection in content scripts
- [ ] Proper origin checks for message passing

### Documentation
- [ ] Complex logic has JSDoc comments
- [ ] Sprint file updated with progress
- [ ] Architectural decisions recorded (if applicable)
- [ ] README updated if public API changed

### Git
- I'll do the committing

---

## CONTEXT MANAGEMENT

### Before Clearing Context
**ALWAYS update these files**:

1. **`.ia/current-sprint.md`**
- Mark completed tasks `[x]`
- Add new tasks discovered
- Update time spent

2. **`.ia/context.md`**
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
