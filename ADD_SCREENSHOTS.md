# How to Add Screenshots to GitHub

## Step 1: Save Your Screenshots

Save the 8 screenshots you took with these exact names in the `screenshots` folder:

1. `01-landing-hero.png` - Landing page hero section
2. `02-how-it-works.png` - How it works section
3. `03-coin-system.png` - Coin system explanation
4. `04-login.png` - Login page
5. `05-marketplace.png` - Marketplace page
6. `06-profile.png` - User profile page
7. `07-messages.png` - Messages list
8. `08-chat-completed.png` - Chat with completed swap

## Step 2: Add to Git

Open PowerShell/Terminal in the project root and run:

```bash
# Add all screenshots
git add screenshots/

# Add the documentation files
git add SCREENSHOTS.md README.md ADD_SCREENSHOTS.md

# Commit
git commit -m "docs: Add application screenshots and visual documentation

- Added 8 screenshots showcasing key features
- Created SCREENSHOTS.md with detailed visual tour
- Updated README.md with link to screenshots
- Includes: landing page, marketplace, profile, messages, chat, and authentication"

# Push to GitHub
git push origin main
```

## Step 3: Verify on GitHub

1. Go to your GitHub repository
2. You should see the `screenshots` folder
3. Click on `SCREENSHOTS.md` to view the visual tour
4. The images should display properly in the markdown file

## Alternative: Use GitHub Web Interface

If you prefer, you can also:

1. Go to your GitHub repository
2. Click "Add file" → "Upload files"
3. Drag and drop all 8 screenshots
4. Add commit message: "Add application screenshots"
5. Click "Commit changes"

---

That's it! Your screenshots will be part of your repository and visible to anyone viewing your project.
