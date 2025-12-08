# Setup Instructions - Paggie Trainer

## Quick Start Guide

Follow these steps to set up the project locally after all QA fixes have been applied.

---

## 1. Environment Configuration

### Step 1: Create `.env` file

Create a `.env` file in the project root directory (same level as `package.json`):

```bash
# Copy the example file
cp .env.example .env
```

Or manually create `.env` with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://kyrpsgsseussenrchovc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cnBzZ3NzZXVzc2VucmNob3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Nzg3NjYsImV4cCI6MjA4MDU1NDc2Nn0.1n-Hu8Do7SQrou0KrS5BNetQ4uWUSGH3K3FT5aJvJg0

# Groq AI Configuration
VITE_GROQ_API_KEY=your_groq_api_key_here

# File Upload Limits (in bytes) - 5MB default
VITE_MAX_FILE_SIZE=5242880

# API Timeout (in milliseconds) - 30 seconds default
VITE_API_TIMEOUT=30000
```

### Step 2: Get Your API Keys

#### Supabase Credentials
- The Supabase URL and anon key are already provided above (from the original code)
- For production, create your own Supabase project at https://supabase.com
- Replace the values in `.env` with your own credentials

#### Groq API Key
1. Go to https://console.groq.com/keys
2. Create a new API key
3. Copy the key and paste it in `.env` as `VITE_GROQ_API_KEY`

---

## 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React & React DOM
- Supabase client
- Google Generative AI
- Vite and build tools

---

## 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000` (or the port specified in `vite.config.ts`)

---

## 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

---

## 5. Preview Production Build

```bash
npm run preview
```

---

## 🔒 Security Notes

### Important:
- **Never commit `.env` file to version control**
- The `.env` file is already in `.gitignore` (should be)
- Use `.env.example` as a template for team members
- For production deployment, set environment variables in your hosting platform

### Environment Variables in Production:

#### Vercel:
1. Go to Project Settings > Environment Variables
2. Add each variable:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GROQ_API_KEY`
   - `VITE_MAX_FILE_SIZE` (optional)
   - `VITE_API_TIMEOUT` (optional)

#### Netlify:
1. Go to Site Settings > Environment Variables
2. Add each variable (same as above)

#### Other Platforms:
Follow your platform's documentation for setting environment variables.

---

## 🧪 Testing the Fixes

### 1. Test Authentication
- Try signing up with a weak password (< 6 chars) - should show error
- Try signing up with a strong password - should show strength indicator
- Test timeout by disconnecting network during signup

### 2. Test File Uploads
- Try uploading a file > 5MB - should show error
- Try uploading a non-image file - should show error
- Upload a valid image - should work

### 3. Test Export Functionality
- Generate a report and try exporting as PDF
- Generate a report and try exporting as image
- Test with network issues - should show appropriate errors

### 4. Test Error Boundary
- Open browser console
- Manually trigger an error (if possible)
- Should see error boundary UI instead of blank screen

### 5. Test Validation
- Try submitting forms with invalid data
- Check that error messages appear
- Verify that required fields are enforced

---

## 📁 Project Structure

```
cópia-de-paggie-trainer/
├── components/          # React components
│   ├── ui/             # UI components (Button, Input)
│   ├── ErrorBoundary.tsx  # NEW: Error boundary
│   └── ...
├── services/           # API services
│   ├── supabase.ts    # UPDATED: Uses env vars
│   └── groqService.ts  # Groq API integration
├── utils/              # NEW: Utility functions
│   ├── validation.ts  # Validation utilities
│   ├── storage.ts     # LocalStorage utilities
│   ├── debounce.ts    # Debouncing utilities
│   ├── api.ts         # API utilities with timeout
│   └── export.ts      # Export utilities
├── .env.example       # NEW: Environment template
├── .env               # CREATE THIS: Your actual env vars
├── index.tsx          # UPDATED: Wrapped with ErrorBoundary
└── ...
```

---

## 🐛 Troubleshooting

### Issue: "API Key não encontrada"
**Solution:** Make sure `VITE_GROQ_API_KEY` is set in `.env` file

### Issue: "Supabase credentials não configuradas"
**Solution:** Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`

### Issue: Export not working
**Solution:** 
- Check browser console for errors
- Verify that html2canvas and html2pdf libraries are loaded (check Network tab)
- Try refreshing the page

### Issue: File upload fails
**Solution:**
- Check file size (must be < 5MB by default)
- Check file type (must be image: JPEG, PNG, GIF, WebP)
- Check browser console for specific error

### Issue: LocalStorage errors
**Solution:**
- Check if browser allows LocalStorage
- Try clearing browser data
- Check if quota is exceeded

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` file created with all required variables
- [ ] Application starts without errors
- [ ] Can sign up / sign in
- [ ] Can create profile
- [ ] Can upload logo (valid image)
- [ ] Can create assessment
- [ ] Can export reports (PDF and Image)
- [ ] Error messages display correctly
- [ ] Password strength indicator works
- [ ] File upload validation works

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

---

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Check that all dependencies are installed
4. Review the `IMPLEMENTATION_SUMMARY.md` for details on fixes
5. Review the `QA_FINDINGS_REPORT.md` for original issues

---

*Last Updated: After QA fixes implementation*

