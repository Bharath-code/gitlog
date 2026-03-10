# GitLog Development Scripts

**Created:** 2026-03-10  
**Status:** ✅ **COMPLETE**

---

## 📦 Available Scripts

### **Development:**

```bash
npm run dev
```

- Starts Next.js development server
- Hot reload enabled
- Opens at http://localhost:3000

---

### **Build:**

```bash
npm run build
```

- Creates production build
- Optimizes and minifies code
- Generates static files in `.next` folder

---

### **Start Production:**

```bash
npm run start
```

- Starts production server
- Use after `npm run build`

---

### **Linting:**

#### **Check for errors:**

```bash
npm run lint
# or
npm run lint:check
```

- Runs ESLint
- Fails on any errors
- Shows all warnings

#### **Auto-fix errors:**

```bash
npm run lint:fix
```

- Runs ESLint with `--fix`
- Automatically fixes fixable issues
- Shows remaining manual fixes

**Example Output:**

```
✔ No ESLint errors found.
# or
✖ 5 problems (2 errors, 3 warnings)
  2 errors and 3 warnings potentially fixable with the `--fix` option.
```

---

### **Type Checking:**

```bash
npm run type-check
```

- Runs TypeScript compiler in check mode
- Doesn't emit files
- Shows type errors

**Example Output:**

```
Found 0 errors.
# or
src/file.ts(10,5): error TS2322: Type 'string' is not assignable to type 'number'.
```

---

### **Formatting:**

#### **Format all files:**

```bash
npm run format
```

- Runs Prettier on all files
- Auto-fixes formatting issues
- Follows rules in `prettier.config.js`

#### **Check formatting:**

```bash
npm run format:check
```

- Checks if files are formatted correctly
- Doesn't modify files
- Fails if any file needs formatting

**Example Output:**

```
Checking formatting...
All matched files use Prettier code style!
# or
[warn] src/file.ts
[error] src/file.ts: Code style issues found.
```

---

## 🎯 Recommended Workflow

### **Before Committing:**

```bash
# 1. Fix linting issues
npm run lint:fix

# 2. Format code
npm run format

# 3. Type check
npm run type-check

# 4. Build to ensure no errors
npm run build
```

### **CI/CD Pipeline:**

```yaml
# Example GitHub Actions
- name: Lint
  run: npm run lint

- name: Type Check
  run: npm run type-check

- name: Format Check
  run: npm run format:check

- name: Build
  run: npm run build
```

---

## ⚙️ Configuration Files

### **ESLint:**

- File: `eslint.config.mjs`
- Rules: Next.js recommended
- Auto-fix: `npm run lint:fix`

### **Prettier:**

- File: `prettier.config.js`
- Rules:
  ```js
  {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    printWidth: 100,
    arrowParens: 'always',
    endOfLine: 'lf',
  }
  ```
- Auto-format: `npm run format`

### **TypeScript:**

- File: `tsconfig.json`
- Strict mode: Enabled
- Type check: `npm run type-check`

---

## 🚨 Common Issues & Fixes

### **Issue: Lint errors won't fix**

```bash
# Some errors can't be auto-fixed
npm run lint
# Manually fix the remaining errors shown
```

### **Issue: Format changes keep reverting**

```bash
# Ensure you're running format command
npm run format
# Check if prettier.config.js exists
```

### **Issue: Type errors in build**

```bash
# Run type check separately
npm run type-check
# Fix type errors before building
```

### **Issue: Build fails silently**

```bash
# Check for lint errors
npm run lint
# Check for type errors
npm run type-check
# Then build
npm run build
```

---

## 💡 Pro Tips

### **1. Pre-commit Hook:**

Create `.husky/pre-commit`:

```bash
#!/bin/sh
npm run lint:fix
npm run format
npm run type-check
```

### **2. VS Code Settings:**

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### **3. Watch Mode:**

```bash
# Run dev server with type checking
npm run dev
# In another terminal, run type check in watch mode
npx tsc --noEmit --watch
```

### **4. Quick Fix All:**

```bash
# Fix everything automatically
npm run lint:fix && npm run format && npm run type-check
```

---

## 📊 Script Comparison

| Script         | Auto-Fix | Shows Errors | Shows Warnings | Fails on Warnings |
| :------------- | :------- | :----------- | :------------- | :---------------- |
| `lint`         | ❌       | ✅           | ✅             | ✅                |
| `lint:fix`     | ✅       | ✅           | ✅             | ✅                |
| `lint:check`   | ❌       | ✅           | ✅             | ✅                |
| `type-check`   | ❌       | ✅           | ❌             | ✅                |
| `format`       | ✅       | ❌           | ❌             | ❌                |
| `format:check` | ❌       | ✅           | ❌             | ✅                |

---

## 🎯 Best Practices

### **DO:**

- ✅ Run `lint:fix` before committing
- ✅ Run `format` before committing
- ✅ Fix type errors immediately
- ✅ Build locally before pushing

### **DON'T:**

- ❌ Commit without linting
- ❌ Ignore type errors
- ❌ Skip formatting
- ❌ Push without building

---

## 📈 Quality Metrics

### **Target:**

- ESLint errors: 0
- ESLint warnings: <10
- Type errors: 0
- Format issues: 0
- Build warnings: 0

### **Check Before Release:**

```bash
npm run lint:check && \
npm run type-check && \
npm run format:check && \
npm run build
```

---

## 🚀 Quick Reference

```bash
# Daily development
npm run dev

# Before committing
npm run lint:fix && npm run format

# Before pushing
npm run lint:check && npm run type-check && npm run build

# Fix everything
npm run lint:fix && npm run format

# Check everything
npm run lint:check && npm run type-check && npm run format:check
```

---

_Last Updated: 2026-03-10_  
_Status: ✅ COMPLETE_  
_Scripts: 8 total (4 new)_
