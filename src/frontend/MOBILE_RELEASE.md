# Thunderlab Mobile Release Guide

This guide walks you through packaging Thunderlab for iOS and Android and submitting it to the Apple App Store and Google Play Store.

## Prerequisites

Before you begin, ensure you have:

### Required Accounts
- [ ] **Apple Developer Account** ($99/year) - [developer.apple.com](https://developer.apple.com)
- [ ] **Google Play Developer Account** ($25 one-time) - [play.google.com/console](https://play.google.com/console)

### Development Environment
- [ ] **Node.js** (v18 or later) and **pnpm** installed
- [ ] **Xcode** (latest version, macOS only) for iOS builds
- [ ] **Android Studio** (latest version) for Android builds
- [ ] **Capacitor CLI** installed globally: `npm install -g @capacitor/cli`

### Store Submission Materials (prepare these in advance)
- [ ] App name: **Thunderlab**
- [ ] App description (short and full versions)
- [ ] App keywords/tags for store search
- [ ] Privacy policy URL
- [ ] Support URL or email
- [ ] App category (e.g., Music, Productivity)
- [ ] Screenshots for all required device sizes:
  - iOS: iPhone 6.7", 6.5", 5.5" and iPad Pro 12.9"
  - Android: Phone and 10" tablet
- [ ] App icon (already generated: 1024×1024 PNG)
- [ ] Promotional graphics (optional but recommended)

---

## Part 1: Initial Setup

### Step 1: Install Capacitor Dependencies

From the `frontend` directory, install Capacitor and platform packages:

