# Modules & Domain Workflows

Open HR manages 15 distinct domain modules, each providing dedicated data storage, business workflows, and user interface controls.

---

## 1. The 15 Domain Modules

Modules are registered in `src/config/modules.ts` and managed dynamically via `Setting`:

| Module Identifier | Display Name | Purpose | Model / Collection |
| :--- | :--- | :--- | :--- |
| `employee` | Employee | Master employee directory, auth, status | `employees` |
| `employee-lifecycle` | Employee Lifecycle | Onboarding & offboarding checklists | `employee_onboarding`, `employee_offboarding` |
| `leave` | Leave | Annual leave allowances and entitlements | `leaves` |
| `leave-request` | Leave Requests | Submission, review, and approval flow | `leave_requests` |
| `calendar` | Calendar | Company holidays, weekends, and events | `calendars` |
| `payroll` | Payroll | Salary structure, disbursements, bonuses | `payrolls` |
| `asset` | Asset | Physical equipment and hardware tracking | `assets` |
| `tool` | Tool | Software licenses, accounts, access | `tools` |
| `course` | Course | Learning materials, certifications | `courses` |
| `employee-bank` | Employee Bank | Banking and direct deposit information | `employee_banks` |
| `employee-contact` | Employee Contact | Emergency contacts and personal address | `employee_contacts` |
| `employee-document` | Employee Document | Identity proofs, contracts, S3 uploads | `employee_documents` |
| `employee-education` | Employee Education | Degrees, institutes, graduation years | `employee_educations` |
| `employee-achievement` | Employee Achievement | Certifications, awards, honors | `employee_achievements` |
| `setting` | Settings | Company metadata, module toggles, tasks | `settings` |

---

## 2. Core Business Workflows

### 1. Employee Onboarding

1. **Creation:** Admin creates a new employee from `/employees` (`POST /api/employee`).
2. **Token Generation:** System mints a secure JWT invitation token encoding the employee's ID.
3. **Invitation Email:** System sends an onboarding email with a link to `/onboard?token=...` via Nodemailer (`src/server/mail/mail-sender.ts`).
4. **Account Activation:** The employee accesses `/onboard`, sets their password, and completes their profile. The credentials provider verifies the token and stores the hashed password.

### 2. Employee Offboarding

1. **Initiation:** Admin triggers offboarding for an employee (`POST /api/employee-offboarding`).
2. **Task Population:** System queries `Setting` for default offboarding tasks (`offboarding_tasks`) and generates checklist items with `status: "pending"`.
3. **Archiving:** The employee's record is immediately patched:
   - `role: ENUM_ROLE.FORMER`
   - `status: "archived"`
4. **Access Transition:** When the employee logs in, their dashboard displays an archival acknowledgement notice.

### 3. Leave Request & Approval Lifecycle

1. **Submission:** An employee requests time off specifying `start_date`, `end_date`, and `leave_type` (`POST /api/leave-request`).
2. **Working Day Calculation:** `src/server/services/leave-request.service.ts` calculates the exact working days required, factoring out weekends and official company holidays from the `Calendar` collection.
3. **Review:** Admins and Moderators review pending requests under `/leave-requests`.
4. **Approval & Balance Deduction:**
   - Approving the request updates its status to `approved`.
   - The approved days are deducted from the employee's yearly allowance in the `Leave` model.
   - Rejection sets status to `rejected` with an optional note and leaves the balance untouched.

### 4. Hardware Asset Tracking & Serial IDs

1. **Serial Assignment:** Assets require unique identifiers formatted as `<prefix>_<TYPE>_<serial>` (e.g. `EMP_LAPTOP_1`).
2. **Non-Reusing Serial:** `nextAssetId()` inspects the highest numeric serial across existing assets of that type to prevent ID collision even after asset deletions.
3. **Assignment:** Assets are mapped to `employee_id` and displayed on the employee's personal dashboard.

### 5. Dynamic Module Toggling

- Company settings store an array of module configurations: `{ name: "payroll", enable: true }`.
- Client components consume `useSettings()` to check `modules.find(m => m.name === id)?.enable`.
- If a module is disabled:
  - Sidebar links are automatically hidden.
  - Dashboard widgets for that module are suppressed.
  - Pages redirect or render access restrictions.
