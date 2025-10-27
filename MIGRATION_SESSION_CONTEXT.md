# Migration Session Context - October 22, 2025

## Objective

Migrate 3 admin modules (QuanLyBaiTap, QuanLyCauHoi, QuanLyChuDe) from the existing CRA project (`ixl_clone_2_Frontend`) to a new standalone Vite project using Strategy B (Shared Core architecture).

---

## Project Status

### Source Project

- **Location**: `d:\Ai Tee\Student_Elearning\student_Elearning\ixl_clone_2_Frontend\`
- **Type**: Create React App (CRA)
- **Modules to migrate**:
  1. **QuanLyBaiTap** (Question Creator) - `src/pages/QuanLyBaiTap/`
  2. **QuanLyCauHoi** (Question List) - `src/pages/QuanLyCauHoi/`
  3. **QuanLyChuDe** (Topic & SubTopic Manager) - `src/pages/QuanLyChuDe/`

### Target Project (NEW)

- **Location**: `d:\Ai Tee\Student_Elearning\student_Elearning\kilovia-admin\`
- **Type**: Vite + React
- **Template**: `react` (standard, not SWC, not React Compiler)
- **Status**: ✅ Created and base setup complete

---

## Completed Setup Steps

### 1. Project Initialization

```powershell
npm create vite@latest kilovia-admin -- --template react
cd kilovia-admin
npm install react-router-dom axios classnames lucide-react
npm install tailwindcss framer-motion katex mathjs react-dnd
```

### 2. Configuration Files Added

- ✅ **vite.config.js**: Path aliases configured
  - `@` → `./src`
  - `@shared` → `./src/shared`
  - `@modules` → `./src/modules`
- ✅ **.env**: Environment variables

  ```
  VITE_API_BASE_URL=http://localhost:8080/api
  ```

- ✅ **jsconfig.json**: Editor path resolution for aliases

### 3. Tailwind CSS Setup

- ✅ Using Tailwind v4 (lightweight)
- ✅ Added `@import "tailwindcss";` to `src/index.css`

### 4. Directory Structure Created

```
kilovia-admin/
├── src/
│   ├── shared/              ✅ Created with placeholders
│   │   ├── services/
│   │   │   └── hierarchyService.js
│   │   ├── constants/
│   │   │   └── kinds.js
│   │   ├── components/
│   │   │   └── previewRegistry.js
│   │   └── utils/
│   │       └── envelop.js
│   │
│   ├── modules/             ✅ Created with placeholders
│   │   ├── question-creator/
│   │   │   └── index.jsx
│   │   ├── question-list/
│   │   │   └── index.jsx
│   │   └── topic-manager/
│   │       └── index.jsx
│   │
│   ├── App.jsx              ✅ Router wired
│   └── main.jsx
```

### 5. Routing Setup

- ✅ React Router configured in `App.jsx`
- ✅ Routes:
  - `/` → redirects to `/quan-ly-cau-hoi`
  - `/quan-ly-bai-tap` → Question Creator
  - `/quan-ly-cau-hoi` → Question List
  - `/quan-ly-chu-de` → Topic Manager
- ✅ Simple navigation bar added

### 6. Build Validation

- ✅ Production build successful: `npm run build` → PASS
- ✅ No errors, compiles cleanly

---

## Current File States

### Shared Core (Placeholders - Need Real Implementation)

1. **hierarchyService.js**: Minimal ping method, needs full API implementation
2. **kinds.js**: Question type constants (complete)
3. **previewRegistry.js**: Placeholder preview component registry
4. **envelop.js**: Question envelope factory (basic structure)

### Module Placeholders

1. **question-creator/index.jsx**: Basic placeholder with API status check
2. **question-list/index.jsx**: Basic placeholder
3. **topic-manager/index.jsx**: Not created yet (needs to be added)

---

## Next Steps (Migration Phase)

### Phase 1: Migrate Shared Core

Copy and adapt from source to target:

- [ ] `hierarchyService.js` - Full API service with all methods
- [ ] `kinds.js` - Already complete ✅
- [ ] `previewRegistry.js` - All preview components
- [ ] `envelop.js` - Complete envelope utilities
- [ ] Copy `mockQuestionsForList.js` if using mock data

### Phase 2: Migrate Modules (One by One)

1. [ ] **QuanLyBaiTap** → `modules/question-creator/`
   - Copy all subdirectories: components, editors, panels, previews, styles, templates, store, data
   - Update imports to use `@shared` aliases
2. [ ] **QuanLyCauHoi** → `modules/question-list/`
   - Copy components subdirectory
   - Update imports to use `@shared` aliases
3. [ ] **QuanLyChuDe** → `modules/topic-manager/`
   - Copy components subdirectory and services/topicService.js
   - Update imports to use `@shared` aliases

### Phase 3: Import Fixes

For each migrated file, replace:

```diff
- import { hierarchyService } from "../services/hierarchyService";
+ import { hierarchyService } from "@shared/services/hierarchyService";

- import { KINDS } from "../templates/kinds";
+ import { KINDS } from "@shared/constants/kinds";

- import { getPreviewRegistry } from "../previews/previewRegistry";
+ import { getPreviewRegistry } from "@shared/components/previewRegistry";
```

### Phase 4: Testing

- [ ] Build after each module migration
- [ ] Test routes load correctly
- [ ] Test API calls hit correct base URL
- [ ] Test CRUD operations
- [ ] Test navigation between modules

---

## Key Technical Details

### Dependencies Mapping

**Required** (already installed):

- react, react-dom, react-router-dom
- axios, classnames, lucide-react
- tailwindcss, framer-motion, katex, mathjs, react-dnd

**Backend API**:

- Base URL: `http://localhost:8080/api`
- Env var: `VITE_API_BASE_URL` (Vite convention)
- Mock mode: `USE_MOCK = false` in hierarchyService

### Shared Dependencies Map

Files that ALL 3 modules depend on:

1. `hierarchyService.js` - Used by all modules for API calls
2. `kinds.js` - Used by QuanLyBaiTap, QuanLyCauHoi
3. `previewRegistry.js` - Used by QuanLyBaiTap, QuanLyCauHoi

### Module-Specific Dependencies

- **QuanLyChuDe** also uses: `topicService.js` (stays in module-specific services/)

---

## Architecture Strategy

### Strategy B: Shared Core

**Why chosen**:

- Single source of truth for shared code
- Minimal duplication
- Clear module boundaries
- Easier maintenance than flat copy (Strategy A)
- Simpler than micro-frontends (Strategy C)

**Benefits**:

- ~1 day migration time
- Scale-friendly
- Low risk
- Professional structure

---

## Documentation Reference

- **Full migration plan**: `ixl_clone_2_Frontend/STRATEGY_B_MIGRATION_PLAN.md`
- **Source docs**:
  - QuanLyBaiTap: `QUAN_LY_BAI_TAP_DOCUMENTATION.md`
  - QuanLyCauHoi: `HIERARCHY_FILTERS_DOCUMENTATION.md`, `PAGINATION_INTEGRATION_COMPLETE.md`
  - QuanLyChuDe: `README.md`, `IMPLEMENTATION_SUMMARY.md`

---

## Commands Reference

### Development

```powershell
cd "d:\Ai Tee\Student_Elearning\student_Elearning\kilovia-admin"
npm run dev
```

### Build

```powershell
npm run build
```

### Navigate to source

```powershell
cd "d:\Ai Tee\Student_Elearning\student_Elearning\ixl_clone_2_Frontend"
```

---

## Important Notes

### CRA vs Vite Differences

- `process.env.REACT_APP_*` → `import.meta.env.VITE_*`
- No additional config needed for most features
- Faster HMR and builds

### CSS Strategy

- All modules use scoped class prefixes: `qlbt-`, `qlch-`, `qlcd-`
- Low risk of CSS collisions
- Keep existing CSS files, just copy them

### API Endpoints (No Changes Required)

All endpoints remain the same:

- GET /api/grades/all
- GET /api/subject-grades/by-grade/{gradeId}
- GET /api/topics/by-subject-grade/{subjectGradeId}
- GET /api/subtopics/by-topic/{topicId}
- GET /api/questions/page/latest
- GET /api/questions/page/filter
- POST /api/questions/add
- PUT /api/questions/update
- DELETE /api/questions/delete/{id}

---

## Decision Log

1. ✅ **Framework**: Vite + React (standard template)
   - Not Vue/Preact/Vanilla (would require full rewrite)
   - Not React Compiler (avoid compatibility risks at migration time)
2. ✅ **Strategy**: B - Shared Core

   - Not Strategy A (monolithic copy has duplication)
   - Not Strategy C (micro-frontend overkill)

3. ✅ **Tailwind**: v4

   - Simpler setup (just @import)
   - No config file needed

4. ✅ **Project Name**: kilovia-admin
   - Clear purpose
   - Follows naming convention

---

## Success Criteria

### Phase 1 (Setup) - ✅ COMPLETE

- [x] Project created
- [x] Dependencies installed
- [x] Aliases configured
- [x] Routing wired
- [x] Build passes

### Phase 2 (Migration) - ⏳ IN PROGRESS

- [ ] Shared core migrated
- [ ] QuanLyBaiTap migrated
- [ ] QuanLyCauHoi migrated
- [ ] QuanLyChuDe migrated
- [ ] All imports fixed
- [ ] Build passes
- [ ] Routes load without errors

### Phase 3 (Validation) - ⏳ PENDING

- [ ] API calls work
- [ ] CRUD operations functional
- [ ] Navigation between modules works
- [ ] Edit flow (list → creator) works
- [ ] Filters and pagination work (QuanLyCauHoi)

---

**Last Updated**: October 22, 2025  
**Current Phase**: Setup Complete, Ready for Migration  
**Next Action**: Copy shared core files from source project
