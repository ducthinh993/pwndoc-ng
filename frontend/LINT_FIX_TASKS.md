# Lint Fix Tasks for PwnDoc-ng Frontend

## Overview
This document outlines all the linting and TypeScript issues found in the frontend codebase and provides a prioritized task list for fixing them without breaking business logic.

## Issues Summary
- **ESLint Errors**: 8,272 errors, 790 warnings
- **TypeScript Errors**: 9 errors in 2 files
- **PostCSS Configuration**: ES module syntax in .js file

## Priority 1: Critical Configuration Issues

### Task 1.1: Fix PostCSS Configuration
**File**: `postcss.config.js`
**Issue**: ES module syntax in .js file causing ReferenceError
**Solution**: Rename to `postcss.config.mjs` or convert to CommonJS syntax
**Impact**: Prevents `npm run dev` from working

### Task 1.2: Fix TypeScript Configuration Issues
**Files**: 
- `src/lib/utils.ts` (8 errors)
- `src/main.ts` (1 error)
**Issues**: 
- Missing type definitions for options objects
- Incorrect property access on untyped objects
- Invalid plugin configuration
**Impact**: TypeScript compilation fails

## Priority 2: Service Files (High Impact)

### Task 2.1: Fix Service Files Formatting
**Files**: All files in `src/services/`
**Issues**:
- Missing trailing commas
- Incorrect indentation (4 spaces instead of 2)
- Missing newlines at end of files
- Object shorthand syntax violations
- Quote style violations (double quotes instead of single)
- Extra semicolons
- Trailing spaces

**Files to fix**:
- `src/services/audit.js` (87 errors)
- `src/services/chart.js` (50+ errors)
- `src/services/client.js` (27 errors)
- `src/services/collaborator.js` (23 errors)
- `src/services/company.js` (27 errors)
- `src/services/data.js` (100+ errors)
- `src/services/image.js` (14 errors)
- `src/services/reviewer.js` (6 errors)
- `src/services/settings.js` (7 errors)
- `src/services/template.js` (12 errors)
- `src/services/user.js` (120+ errors)
- `src/services/utils.js` (250+ errors)
- `src/services/vulnerability.js` (15 errors)

### Task 2.2: Convert Service Files to TypeScript
**Rationale**: Better type safety and consistency with modern Vue 3 + Vite setup
**Files**: All `.js` files in `src/services/`
**Process**:
1. Rename files from `.js` to `.ts`
2. Add proper type annotations
3. Fix import/export statements
4. Update any dynamic imports

## Priority 3: Configuration Files

### Task 3.1: Fix Tailwind Configuration
**File**: `tailwind.config.js`
**Issues**:
- Quote style violations (double quotes instead of single)
- Trailing spaces
- Missing newlines
- CommonJS syntax in ES module context

### Task 3.2: Fix Vite Configuration
**File**: `vite.config.ts`
**Issues**:
- Missing trailing commas
- Quote style violations
- Trailing spaces
- Missing newlines
- `__dirname` not defined in ES modules

## Priority 4: Component and Page Files

### Task 4.1: Fix Vue Component Files
**Files**: All `.vue` files
**Issues**:
- Quote style violations
- Indentation issues
- Missing trailing commas
- Object shorthand violations
- Console statements (warnings in development)

### Task 4.2: Fix Router Configuration
**File**: `src/router/routes.js`
**Issues**:
- Quote style violations
- Indentation issues
- Missing trailing commas

## Priority 5: Utility and Library Files

### Task 5.1: Fix Utils Library
**File**: `src/lib/utils.ts`
**Issues**:
- TypeScript type errors
- Missing type definitions
- Quote style violations
- Indentation issues

## Implementation Strategy

### Phase 1: Configuration Fixes (1-2 hours)
1. Fix PostCSS configuration
2. Fix TypeScript configuration issues
3. Fix Vite configuration
4. Fix Tailwind configuration

### Phase 2: Service Files (4-6 hours)
1. Fix formatting issues in all service files
2. Convert service files to TypeScript
3. Add proper type annotations
4. Update imports/exports

### Phase 3: Component Files (2-3 hours)
1. Fix Vue component formatting
2. Fix router configuration
3. Remove console statements or add eslint-disable comments

### Phase 4: Final Cleanup (1 hour)
1. Run full lint check
2. Fix any remaining issues
3. Update documentation

## Automated Fixes Available

Most issues can be fixed automatically using:
```bash
npm run lint:fix
```

**Note**: This will fix approximately 7,950 errors automatically.

## Manual Fixes Required

1. **TypeScript type errors** - Need manual type definitions
2. **PostCSS configuration** - Need to rename file or change syntax
3. **Complex object structures** - May need manual review
4. **Business logic** - Any fixes that could affect functionality need manual review

## Testing Strategy

After each phase:
1. Run `npm run lint:check` to verify fixes
2. Run `npx tsc --noEmit` to check TypeScript
3. Run `npm run dev` to ensure development server works
4. Test critical user flows to ensure no business logic is broken

## Risk Mitigation

1. **Backup Strategy**: Create git branch before starting
2. **Incremental Approach**: Fix one file type at a time
3. **Testing**: Test after each major change
4. **Rollback Plan**: Keep original files as backup

## Estimated Time

- **Phase 1**: 1-2 hours
- **Phase 2**: 4-6 hours  
- **Phase 3**: 2-3 hours
- **Phase 4**: 1 hour
- **Total**: 8-12 hours

## Success Criteria

1. ESLint passes with 0 errors
2. TypeScript compilation passes with 0 errors
3. Development server starts without errors
4. All critical user flows work correctly
5. No business logic is broken 