# Admin Panel Implementation Plan

## Architecture
- Sidebar layout with 9 sections
- Independent admin data store (`adminDataStore.ts`)
- Existing `activitySubmissionsStore.ts` for student requests
- Existing `mockDataStore.ts` for user profiles

## Files to Create
1. `lib/adminDataStore.ts` - Admin-specific data (services, transactions, NFTs)
2. `admindashboard/components/AdminSidebar.tsx` - Sidebar navigation
3. `admindashboard/components/AdminLayout.tsx` - Layout wrapper with sidebar
4. `admindashboard/components/sections/OverviewSection.tsx`
5. `admindashboard/components/sections/StudentRequestsSection.tsx` ⭐ CORE
6. `admindashboard/components/sections/TokenApprovalsSection.tsx`
7. `admindashboard/components/sections/NFTCertificatesSection.tsx`
8. `admindashboard/components/sections/ServicesManagerSection.tsx`
9. `admindashboard/components/sections/TransactionsSection.tsx`
10. `admindashboard/components/sections/StudentsListSection.tsx`
11. `admindashboard/components/sections/AnalyticsSection.tsx`
12. `admindashboard/components/sections/SettingsSection.tsx`

## Rewrite
- `AdminDashboardContent.tsx` → Uses AdminLayout + sections
