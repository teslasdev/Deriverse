# Installation & Verification Guide

## Pre-Installation Checklist

Before installing, ensure you have:

- [ ] Node.js 18.0 or higher installed
- [ ] npm 9.0 or higher installed
- [ ] A Solana wallet extension (Phantom or Solflare)
- [ ] Git installed (for cloning)

### Check Your Versions

```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 9.0.0 or higher
```

If you need to update Node.js:

- **macOS**: Use [nvm](https://github.com/nvm-sh/nvm) or download from [nodejs.org](https://nodejs.org)
- **Windows**: Download from [nodejs.org](https://nodejs.org)
- **Linux**: Use your package manager or nvm

---

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd /Users/user/Documents/hack
```

### 2. Install Dependencies

```bash
npm install
```

**Expected output:**

```
npm WARN deprecated ...
added 500+ packages in 30s
```

**Common issues:**

If you see "EACCES" permission errors:

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
```

If installation fails:

```bash
# Clear npm cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 3. Verify Installation

Check that node_modules directory was created:

```bash
ls -la node_modules
```

You should see folders for:

- next
- react
- react-dom
- @solana/web3.js
- @solana/wallet-adapter-react
- recharts
- And many more...

### 4. Type Check (Optional but Recommended)

```bash
npm run type-check
```

**Expected output:**

```
> type-check
> tsc --noEmit
```

If successful, you'll see no output (which means no errors!).

### 5. Start Development Server

```bash
npm run dev
```

**Expected output:**

```
> dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 2.5s
```

### 6. Open in Browser

Navigate to: http://localhost:3000

You should see the Deriverse Analytics welcome screen.

---

## Post-Installation Verification

### Visual Checks

1. **Welcome Screen**
   - [ ] "Deriverse Analytics" title visible
   - [ ] Three feature cards displayed
   - [ ] "Select Wallet" button in header
   - [ ] Dark mode toggle works (if system supports)

2. **Wallet Connection**
   - [ ] Click "Select Wallet" button
   - [ ] Wallet modal appears
   - [ ] Can select Phantom or Solflare
   - [ ] Connection successful
   - [ ] Navigation tabs appear (Dashboard, Journal, Portfolio)

3. **Dashboard Tab**
   - [ ] Key metrics cards display
   - [ ] Charts render correctly
   - [ ] No console errors
   - [ ] Filters work (date range, symbol)

4. **Journal Tab**
   - [ ] Trade table displays
   - [ ] Can edit notes/tags
   - [ ] Search functionality works
   - [ ] Filters apply correctly

5. **Portfolio Tab**
   - [ ] Risk metrics cards show
   - [ ] Charts render
   - [ ] Time analysis displays
   - [ ] No errors in console

### Console Checks

Open browser console (F12 or Cmd+Option+I) and verify:

**Should NOT see:**

- ❌ Red error messages
- ❌ Failed network requests
- ❌ React warnings
- ❌ TypeScript errors

**May see (these are OK):**

- ℹ️ Next.js build info
- ℹ️ React DevTools info
- ℹ️ Wallet adapter logs

### Network Checks

In browser DevTools → Network tab:

- [ ] No failed requests (red)
- [ ] All JavaScript loaded (status 200)
- [ ] No CORS errors
- [ ] Wallet connection successful

---

## Troubleshooting

### Issue: "Cannot find module 'next'"

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue: "Wallet won't connect"

**Solutions:**

1. Refresh the page
2. Disconnect wallet from extension settings
3. Clear browser cache
4. Try a different wallet
5. Check if wallet extension is updated

### Issue: Charts not rendering

**Solution:**

1. Check console for errors
2. Verify recharts is installed: `npm list recharts`
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Issue: TypeScript errors in IDE

**Solution:**

1. Reload VS Code window: Cmd+Shift+P → "Reload Window"
2. Ensure TypeScript extension is installed
3. Check tsconfig.json is in root directory

### Issue: Styles not applying

**Solution:**

1. Verify Tailwind is installed: `npm list tailwindcss`
2. Check postcss.config.js exists
3. Restart dev server
4. Clear Next.js cache: `rm -rf .next`

---

## Build Verification

### Production Build Test

```bash
npm run build
```

**Expected output:**

```
> build
> next build

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (4/4)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95 kB
└ ○ /_not-found                          0 B            0 kB
+ First Load JS shared by all            90 kB
  ├ chunks/...
  └ ...

○  (Static)  automatically rendered as static HTML
```

**If build succeeds:**

```bash
npm start  # Test production build
```

Navigate to http://localhost:3000 and verify everything works.

---

## Performance Verification

### Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select:
   - Mode: Navigation
   - Categories: Performance, Accessibility, Best Practices
   - Device: Desktop
4. Click "Analyze page load"

**Target Scores:**

- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## File Structure Verification

Ensure all critical files exist:

```bash
# Check main directories
ls -la app/
ls -la components/
ls -la lib/
ls -la types/

# Check config files
ls -la package.json
ls -la tsconfig.json
ls -la tailwind.config.ts
ls -la next.config.js

# Check documentation
ls -la README.md
ls -la TECHNICAL.md
ls -la QUICKSTART.md
```

All these should exist and be readable.

---

## Browser Compatibility Check

Test in multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (14+)
- [ ] Edge (latest)

Verify:

- Wallet connection works
- Charts render correctly
- Dark mode works
- Responsive design works

---

## Mobile Verification

Test on mobile devices or use browser DevTools:

1. Open Chrome DevTools
2. Click device toolbar icon (Cmd+Shift+M)
3. Select device (iPhone 12 Pro, Pixel 5, etc.)
4. Test:
   - [ ] Layout is responsive
   - [ ] Tables are scrollable
   - [ ] Buttons are tappable
   - [ ] Charts are visible
   - [ ] No horizontal scroll

---

## Security Verification

### Check Dependencies

```bash
npm audit
```

**Expected output:**

```
found 0 vulnerabilities
```

If vulnerabilities found:

```bash
npm audit fix
```

### Check Wallet Adapter

Verify official packages are installed:

```bash
npm list | grep wallet-adapter
```

Should show:

- @solana/wallet-adapter-base
- @solana/wallet-adapter-react
- @solana/wallet-adapter-react-ui
- @solana/wallet-adapter-wallets

---

## Final Checklist

Before considering installation complete:

### Functionality

- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] Wallet connects successfully
- [ ] All three tabs (Dashboard, Journal, Portfolio) work
- [ ] Filters apply correctly
- [ ] Charts render properly
- [ ] Notes/tags can be edited
- [ ] No console errors

### Build

- [ ] Production build completes successfully
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build size is reasonable (< 500KB first load)

### Performance

- [ ] Page loads quickly (< 3s)
- [ ] Interactions are smooth
- [ ] No memory leaks
- [ ] Charts render without lag

### Documentation

- [ ] README.md is readable
- [ ] All docs are present
- [ ] Examples work as described

---

## Getting Help

If you encounter issues not covered here:

1. Check the [README.md](README.md) for general information
2. Review [TECHNICAL.md](TECHNICAL.md) for architecture details
3. Search GitHub issues
4. Create a new issue with:
   - Your Node.js version
   - Your npm version
   - Error messages
   - Steps to reproduce

---

## Success! 🎉

If all checks pass, your installation is complete and verified!

You're ready to:

1. Explore the analytics dashboard
2. Add trade annotations
3. Analyze your portfolio
4. Deploy to production

**Next Steps:**

- Review [QUICKSTART.md](QUICKSTART.md) for usage guide
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

---

**Happy Trading! 📈**
