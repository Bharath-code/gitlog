# Phase 2 Features - End-to-End Testing Guide

**Created:** 2026-03-09  
**Status:** Ready for Testing  

---

## 🧪 Testing Instructions

### Prerequisites
1. Start development server: `npm run dev`
2. Ensure `.env.local` is configured with all required keys
3. Open browser to `http://localhost:3000`
4. Sign in with GitHub account

---

## ✅ Feature 1: Embeddable Widget

### Test Case W-01: Generate Widget
**Steps:**
1. Navigate to `/widget`
2. Click "Generate Widget ID" button
3. Wait for loading state
4. Verify widget ID appears
5. Verify success toast appears

**Expected:**
- ✅ Widget ID generated (format: `widget_xxxxx`)
- ✅ Success toast: "Widget generated successfully!"
- ✅ Script snippet displayed

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case W-02: Copy Script
**Steps:**
1. Click "Copy" button on script snippet
2. Verify toast appears
3. Paste in text editor to verify content

**Expected:**
- ✅ Toast: "Script copied to clipboard!"
- ✅ Script contains correct widget ID
- ✅ Script format: `<script src="https://gitlog.app/widget.js" data-widget-id="xxx" async></script>`

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case W-03: Test Widget on Test Page
**Steps:**
1. Click "Open test page" link
2. Verify new tab opens
3. Verify widget appears in bottom-right corner
4. Click widget header to expand/collapse

**Expected:**
- ✅ Widget visible at `/widget-test.html`
- ✅ Widget shows "What's New" badge
- ✅ Click expands/collapses content
- ✅ Sample entries displayed

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case W-04: Customize Widget
**Steps:**
1. Return to `/widget`
2. Scroll to "Customize Widget" section
3. Select different color preset
4. Change position to "top-left"
5. Change size to "large"
6. Toggle "Show Dates" off
7. Click "Save" button

**Expected:**
- ✅ Preview updates in real-time
- ✅ Success toast on save: "Widget customization saved!"
- ✅ Settings persist after reload

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case W-05: Widget Analytics
**Steps:**
1. Click "View Analytics" button
2. Navigate to `/analytics/widgets`
3. Verify stats cards display
4. Verify widget list shows

**Expected:**
- ✅ Overview stats visible (Total Widgets, Impressions, Clicks, CTR)
- ✅ Time period filter works (7d/30d/90d/all)
- ✅ Widget performance table displays
- ✅ Top performing widgets shown

**Test Status:** ⬜ Pass ⬜ Fail

---

## ✅ Feature 2: Social Post Drafts

### Test Case S-01: Navigate to Social Posts
**Steps:**
1. Click "Social Posts" in sidebar
2. Verify page loads at `/social`

**Expected:**
- ✅ Page loads successfully
- ✅ Entry list displayed
- ✅ Twitter and LinkedIn sections visible

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case S-02: Generate Twitter Thread
**Steps:**
1. Select an entry from list
2. Choose tone: "Professional"
3. Click "Generate" button for Twitter
4. Wait for generation

**Expected:**
- ✅ Loading state shows
- ✅ 2-5 tweets generated
- ✅ Each tweet ≤280 characters
- ✅ Hashtags included
- ✅ Success toast appears

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case S-03: Generate LinkedIn Post
**Steps:**
1. Click "Generate" button for LinkedIn
2. Wait for generation
3. Verify post length

**Expected:**
- ✅ Post generated (1000-1300 chars)
- ✅ Professional tone
- ✅ 3-5 hashtags included
- ✅ Length indicator shows "Good"

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case S-04: Preview and Copy
**Steps:**
1. Review Twitter preview
2. Verify character counts shown
3. Click "Copy Thread" button
4. Click "Copy Post" for LinkedIn

**Expected:**
- ✅ Previews match platform UI
- ✅ Character counts accurate
- ✅ Copy buttons work
- ✅ Toast confirms copy

**Test Status:** ⬜ Pass ⬜ Fail

---

## ✅ Feature 3: Email Integrations

### Test Case E-01: Find Subscribe Link
**Steps:**
1. Navigate to public changelog: `/changelog/[user]/[repo]`
2. Scroll to footer
3. Find "📧 Subscribe to updates" link
4. Click link

**Expected:**
- ✅ Subscribe link visible in footer
- ✅ Link navigates to subscribe page
- ✅ Subscribe form loads

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case E-02: Subscribe to Updates
**Steps:**
1. Enter valid email address
2. Click "Subscribe" button
3. Wait for response

**Expected:**
- ✅ Success message: "Please check your email to confirm"
- ✅ Confirmation email sent (check inbox)
- ✅ Email contains confirmation link

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case E-03: Confirm Subscription
**Steps:**
1. Open confirmation email
2. Click confirmation link
3. Verify redirect to success page

**Expected:**
- ✅ Link works
- ✅ Redirects to success page
- ✅ Subscription confirmed in database

**Test Status:** ⬜ Pass ⬜ Fail

---

## ✅ Feature 4: Analytics Dashboard

### Test Case A-01: Page Views Tracking
**Steps:**
1. Visit public changelog page
2. Open DevTools → Network tab
3. Refresh page
4. Look for POST to `/api/analytics/track`

**Expected:**
- ✅ Request sent on page load
- ✅ Response: `{ success: true }`
- ✅ Visitor cookie set

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case A-02: Most Viewed Entries
**Steps:**
1. Navigate to `/analytics/most-viewed`
2. Verify leaderboard displays
3. Change time period filter

**Expected:**
- ✅ Top 10 entries shown
- ✅ View counts displayed
- ✅ Trend indicators (↑/↓) visible
- ✅ Time filter updates data

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case A-03: Upvote System
**Steps:**
1. Navigate to public changelog
2. Find upvote button on entry
3. Click upvote
4. Try to upvote again

**Expected:**
- ✅ First click: Success toast
- ✅ Vote count increments
- ✅ Second click: "Already upvoted" message
- ✅ Vote persists after reload

**Test Status:** ⬜ Pass ⬜ Fail

---

## ✅ Feature 5: Roadmap from Issues

### Test Case R-01: Navigate to Roadmap
**Steps:**
1. Click "Roadmap" in sidebar
2. Verify page loads at `/roadmap`

**Expected:**
- ✅ Page loads successfully
- ✅ Kanban board visible
- ✅ Three columns: Planned, In Progress, Completed

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case R-02: Sync GitHub Issues
**Steps:**
1. Click "Sync Issues" button
2. Wait for sync to complete
3. Verify issues appear

**Expected:**
- ✅ Loading state shows
- ✅ Success toast: "Synced X issues"
- ✅ Issues displayed in cards
- ✅ GitHub labels shown

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case R-03: Public Roadmap
**Steps:**
1. Navigate to `/roadmap/[user]/[repo]`
2. Verify public page loads
3. Check upvote functionality

**Expected:**
- ✅ Public page accessible
- ✅ Stats displayed (features, votes, shipped)
- ✅ Most requested feature highlighted
- ✅ Upvote buttons work

**Test Status:** ⬜ Pass ⬜ Fail

---

### Test Case R-04: Roadmap Upvoting
**Steps:**
1. Click upvote on roadmap item
2. Verify vote count increments
3. Try to upvote same item again

**Expected:**
- ✅ First click: Vote increments
- ✅ Second click: "Already upvoted" message
- ✅ Vote persists after reload

**Test Status:** ⬜ Pass ⬜ Fail

---

## 📊 Test Results Summary

### Feature 1: Embeddable Widget
| Test Case | Status | Notes |
| :---- | :---- | :---- |
| W-01: Generate Widget | ⬜ | |
| W-02: Copy Script | ⬜ | |
| W-03: Test Widget | ⬜ | |
| W-04: Customize | ⬜ | |
| W-05: Analytics | ⬜ | |

### Feature 2: Social Posts
| Test Case | Status | Notes |
| :---- | :---- | :---- |
| S-01: Navigate | ⬜ | |
| S-02: Twitter | ⬜ | |
| S-03: LinkedIn | ⬜ | |
| S-04: Preview/Copy | ⬜ | |

### Feature 3: Email Integrations
| Test Case | Status | Notes |
| :---- | :---- | :---- |
| E-01: Find Link | ⬜ | |
| E-02: Subscribe | ⬜ | |
| E-03: Confirm | ⬜ | |

### Feature 4: Analytics
| Test Case | Status | Notes |
| :---- | :---- | :---- |
| A-01: Page Views | ⬜ | |
| A-02: Most Viewed | ⬜ | |
| A-03: Upvote | ⬜ | |

### Feature 5: Roadmap
| Test Case | Status | Notes |
| :---- | :---- | :---- |
| R-01: Navigate | ⬜ | |
| R-02: Sync | ⬜ | |
| R-03: Public | ⬜ | |
| R-04: Upvote | ⬜ | |

---

## 🐛 Bug Report Template

**Bug ID:** [Feature]-[Number]  
**Title:** [Brief description]  
**Severity:** Critical / High / Medium / Low  
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**  
**Actual Result:**  
**Screenshot:** (if applicable)  

---

## ✅ Testing Checklist

### Pre-Testing
- [ ] Development server running
- [ ] Environment variables configured
- [ ] Browser DevTools open
- [ ] Test email account ready

### Post-Testing
- [ ] All test cases executed
- [ ] Bugs documented
- [ ] Screenshots captured
- [ ] Results summarized

---

**Ready to start testing!** 🧪
