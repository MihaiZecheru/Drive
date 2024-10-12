### This template is for quickly initializing a react app that uses the React x Supabase x MUI tech stack (in typescript).
- The react app is linked to supabase (.env is set up) and contains login / logout functionality.
- Has the App.tsx file set up with a router and authenticator component for redirecting users attempting to access that route who aren't logged in.
- Has MUI set up and uses it for the LoginRegister.tsx component.
- Typescript
- QOL:
  - InfoModal.tsx component
  - Authenticator.tsx component (for use in router)
  - ID.ts for branded UUID types
  - GetUser.ts for getting the logged-in user

### In order to use this template, you must:
- set supabase environment variables in the .env file
- set favicon.ico
- set title of app in index.html
- change line 121 of LoginRegister.tsx: replace "APP_NAME" in the 'login to APP_NAME' label
- configure app in manifest.json, package.json, & package-lock.json
- add content to Home.tsx & Landing.tsx components (home page and landing page)
- IMPORTANT: make sure that "confirm email" is disabled in supabase!
  - NOT doing so will give a "session not found" error when trying to login / register!
  - Go to 'authentication', then to 'providers' (as in auth providers)
  - Click on the 'email' provider
  - Disable the 'Confirm email' setting. It's automatically enabled by default, which means that "Users will need to confirm their email address before signing in for the first time."
