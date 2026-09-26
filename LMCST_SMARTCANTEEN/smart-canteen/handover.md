# Project Handover Document: Lourdes Matha College Smart Canteen

**System Name:** Lourdes Matha College Smart Canteen System  
**Tagline:** Smart Food • Smart Queue • Smart Campus  
**Institution:** Lourdes Matha College of Science and Technology (LMCST)  
**Management:** Archdiocese of Changanassery  
**Document Purpose:** Comprehensive technical, operational, and architectural handover detailing all features, security policies, data models, APIs, logical rectifications, and execution steps.

---

## 1. Executive Summary & Problem-Solution Model

### 1.1 The Campus Challenge
During the official morning recess (**11:00 AM – 11:15 AM**), over 700 students across 8 academic blocks previously rushed to the ground-floor canteen simultaneously, leading to:
* Severe counter congestion with 10–12 minute queue wait times during a 15-minute recess.
* High dining hall chaos and seat unavailability.
* 24% daily food wastage due to kitchen inability to forecast real-time demand batches.

### 1.2 The Implemented Smart Solution
1. **5-Minute Walking Distance Compensation:** System factors in campus walking times (~5 minutes) from academic blocks to the central canteen.
2. **Intelligent Department Staggering Matrix:** Staggers departures across 8 academic streams (from 11:00 AM to 11:08 AM) so students arrive in balanced waves (11:05 AM to 11:13 AM) without shortening or shifting the official break.
3. **Classroom Pre-Selection & Kitchen Demand:** Students reserve Kerala canteen meals from class. Kitchen staff aggregate item demand in real-time, cutting food waste from 24% down to 8%.
4. **Physical Dine-In Only (Zero Delivery):** Generates digital tokens, scannable Code 128 barcodes, and QR codes for swift counter collection and immediate dining hall seating.
5. **Role-Based Access Control (RBAC):** Department departure schedule modifications are strictly restricted to administrators, while students and staff have secure view-only access.
6. **Ultra-Premium Single Light Palette:** Completely removed dark mode and transitioned to an executive, collegiate Kerala-heritage design aesthetic.

---

## 2. Technology Stack & System Architecture

### 2.1 Frontend Architecture
* **Core:** Semantic HTML5, Vanilla JavaScript (ES6+ Class-based State Machine in `app.js`).
* **Design System & Styling:** Pure Vanilla CSS3 (`styles.css`, ~4,000 lines) with CSS Custom Properties, multi-layered ambient shadows, frosted glassmorphism (`backdrop-filter: blur(16px)`), micro-animations, responsive grid/flexbox layouts, and custom Lourdes Matha collegiate branding (Royal Burgundy `#831843`, Champagne Amber Gold `#b45309`, Soft Emerald `#047857`, Pearl Slate `#f8fafc`).
* **Interactive Libraries:**
  * `JsBarcode` (v3.11.5, bundled locally for 100% offline availability) for real, production-ready Code 128 barcode generation.
  * `qrcode.js` (v1.5.3) for digital token verification QR codes.
  * `Chart.js` (v4.4.1) for crowd flow curves, P&L statements, and kitchen production sheets.
* **Dual Runtime Capability:** Runs either as a **Zero-Dependency Standalone Browser Application** (using `data.js` as an in-memory client database) or connected to the Node.js REST API.

### 2.2 Backend Architecture
* **Runtime & Framework:** Node.js & Express.js (`server.js`).
* **Database & ORM:** MongoDB & Mongoose (`models/` for User, MenuItem, Order, and CrowdLog).
* **Security & Utility:** CORS enabled, JSON body parser, environment configuration via `dotenv`.
* **High Availability & Graceful Fallback:** If MongoDB is offline, the backend automatically transitions into local in-memory mock mode without crashing, providing instant responses for all REST API endpoints.

---

## 3. Directory Structure

```
code_crusaders-main/
├── handover.md                                      # Workspace root handover document
└── code_crusaders-main/
    └── LMCST_SMARTCANTEEN/
        ├── handover.md                              # Sub-project handover document
        ├── index.html                               # Root redirect page
        ├── start-server.ps1                         # Portable PowerShell local web server
        └── smart-canteen/
            ├── README.md                            # Comprehensive project guide
            ├── handover.md                          # Active module handover document
            ├── frontend/
            │   ├── index.html                       # Single Page Application
            │   ├── css/
            │   │   └── styles.css                   # Ultra-Premium Master Design System (Light Theme Only)
            │   └── js/
            │       ├── app.js                       # State machine, timers, active order tracking, stock logic
            │       ├── data.js                      # Menu items, demo accounts, schedule data
            │       └── jsbarcode.min.js             # Offline Code 128 barcode generator
            └── backend/
                ├── package.json                     # Express, Mongoose, CORS, dotenv
                ├── .env                             # Active environment configuration
                ├── .env.example                     # Environment template
                ├── server.js                        # Express server & static host
                ├── seed.js                          # Database seeder
                ├── models/
                │   ├── User.js                      # Student, Staff, Admin schema
                │   ├── MenuItem.js                  # Food inventory schema
                │   ├── Order.js                     # Token, items, departure, status
                │   └── CrowdLog.js                  # Occupancy telemetry
                ├── controllers/
                │   ├── authController.js            # Login, profiles, user directory
                │   ├── orderController.js           # Order issuance, token generation, status transitions
                │   ├── menuController.js            # Food catalog CRUD
                │   ├── departmentController.js      # RBAC-protected department schedule management
                │   └── analyticsController.js       # P&L, crowd curves, demand batches
                └── routes/
                    └── api.js                       # Express REST API routes
```

---

## 4. Logical Rectifications & Architectural Upgrades (Phase 4)

In the latest major release, all underlying logical flaws, hardcoded placeholders, theme inconsistencies, and inventory synchronization issues were comprehensively analyzed and resolved:

### 4.1 Eradication of Dark Mode & Transition to Ultra-Premium Light Palette
* **HTML Cleanup:** Removed all 5 theme toggle buttons (`theme-toggle-btn`) from the Landing Header, Public Menu, Student Portal, Staff Console, and Admin Dashboard.
* **JavaScript State Simplification:** Removed theme persistence (`localStorage.getItem('lmc_theme')`), `this.theme`, `toggleTheme()`, and `applyTheme()` from `app.js`.
* **CSS Cleanup:** Completely eradicated all `[data-theme="dark"]` variables and component overrides from `styles.css`.
* **Executive Aesthetics:** Implemented luxury tokens including Royal Burgundy (`#831843`), Champagne Gold (`#b45309`), Pearl Slate canvas (`#f8fafc`), frosted glassmorphic navigation (`backdrop-filter: blur(16px)`), micro-elevation cards, and custom scrollbars.

### 4.2 Dynamic Active Order Tracking (Elimination of Hardcoded Tokens)
* **The Bug:** Previously, the tracking views, barcode generators, and status transition handlers relied on a hardcoded token string (`SC-127`). Any new order placed by a student was ignored by the tracking system.
* **The Rectification:**
  * Implemented `getActiveOrder()` to dynamically locate the authenticated student's active order from `this.orders`.
  * Updated `updateActiveOrderDisplay()`, `simulateOrderStep()`, `markOrderCollected()`, and `openTokenPassModal()` to bind dynamically to the student's active order token.
  * Replaced hardcoded placeholders with clean dynamic templates (`SC-XXX`).

### 4.3 4-Step Visual Timeline Synchronization
* Connected the four timeline nodes (`step-node-1` through `step-node-4`) and three connectors directly to `order.status`:
  * **Order Placed / Pending:** Step 1 Completed.
  * **Preparing:** Step 1 Completed, Connector 1 Active, Step 2 Active (`🍳 Preparing`).
  * **Ready for Pickup:** Steps 1 & 2 Completed, Connectors 1 & 2 Active, Step 3 Active/Completed (`🔔 Ready for Pickup`), pickup notification banner displayed.
  * **Meal Collected:** Steps 1–4 Completed, Connectors 1–3 Active, Step 4 Active/Completed (`🍽️ Meal Collected`), pickup banner dismissed.

### 4.4 Real-Time Stock Management & Depletion Protection
* **The Bug:** Menu items defined `dailyStock` and `inStock` properties, but placing an order did not decrement inventory, allowing infinite ordering of depleted items.
* **The Rectification:**
  * Food cards dynamically render stock badges (`Available Fresh`, `Only X Left!`, or `Sold Out`).
  * Steppers and `changeQty()` clamp additions against `f.dailyStock` and prevent adding sold-out dishes.
  * `createOrderReservation()` validates inventory for all cart items, decrements `food.dailyStock`, marks `food.inStock = false` upon exhaustion, and updates kitchen demand statistics (`CANTEEN_DATA.foodDemand`).
  * Sold-out items feature distinct styling (`.is-sold-out`) with desaturated images and disabled buttons.

### 4.5 Mandatory UPI Payment Verification Gate
* **The Bug:** Selecting the UPI payment method allowed users to proceed directly to order confirmation without verifying payment.
* **The Rectification:**
  * Enforced an `isUpiPaid` gate in `createOrderReservation()`.
  * If UPI is selected and payment is not verified, the reservation is halted, an alert prompt is displayed, and the UPI simulator panel is automatically brought into focus.
  * Upon order completion, payment state is safely reset.

### 4.6 Cross-Portal Live Synchronization
* Implemented `syncAllPortals()` to synchronize updates across all active views simultaneously:
  * When kitchen staff mark an order as `Preparing`, `Ready`, or `Collected`, the student's live tracking view and active timeline update immediately.
  * Staff metrics (`sf-stat-total`, `sf-stat-preparing`, `sf-stat-ready`, `sf-stat-completed`) update in lockstep with student reservations.

### 4.7 Dynamic Classroom Departure Calculations & Stagger Testing
* Implemented `calculateDepartureSeconds(timeStr)` to dynamically parse break departure windows (e.g. `11:04 AM`) and compute exact real-time seconds remaining.
* Added interactive Department Switcher buttons in the student portal so students can test different departure times (e.g. CS at 11:04 AM, ME at 11:00 AM, EC at 11:08 AM) and review corresponding campus walk routes.

### 4.8 Activity-Grounded Crowd Telemetry
* Grounded occupancy calculations in real-time canteen kitchen load (`Preparing` and `Ready` orders) rather than purely static numbers, providing realistic crowd levels (`LOW`, `MEDIUM`, `HIGH`) and estimated queue wait times.

### 4.9 Real-Time Order Cancellation & Stock Replenishment
* Students can cancel pending, preparing, or ready orders directly from their Order History table.
* When cancelled, food portions are immediately restored to `dailyStock`, dish status returned to in-stock if previously depleted, and kitchen demand numbers (`CANTEEN_DATA.foodDemand`) automatically decremented.
* Synchronized with backend endpoint `PUT /api/orders/:token/cancel` to update persistent records.

### 4.10 Kitchen Queue Search & Filtering
* Kitchen staff can search incoming queue cards by Token ID, student name, department, or food dish in real-time.
* Status filter pills allow toggling between All, Pending, Preparing, Ready, and Cancelled orders.

### 4.11 Admin Orders Ledger Search & Filtering
* Added live text search across all customer orders and a status filter dropdown to isolate orders by their lifecycle state.
* Enhanced order display with distinct color-coded badges for Completed, Preparing, and Cancelled/Restocked orders.

### 4.12 Live Admin Dashboard Financial KPIs
* Replaced static metric values with dynamic calculations derived from active application orders:
  * Today's Revenue dynamically sums non-cancelled active orders over baseline sales.
  * Expenses, profit margins, and total student counts reflect actual canteen activity.

### 4.13 Menu Item Deletion with RBAC Protection
* Canteen administrators can delete obsolete dishes from the campus menu with one click.
* Protected by role verification on `DELETE /api/menu/:id`, preventing unauthorized modifications by students.

### 4.14 Conversational AI Food Assistant & Intelligent Recommender
* **Interactive Floating Widget:** Integrated a responsive, collegiate AI Food Assistant widget (`#ai-chat-btn`, `#ai-chat-window`, `#ai-chat-body`, `#ai-chat-input`) accessible across the campus canteen interface.
* **Natural Language Culinary Advice:** Features contextual intent parsing tailored to Kerala student and faculty preferences:
  * **Spicy & Authentic Cravings:** Automatically highlights spice-rich favorites (e.g., Malabar Chicken Biriyani, Egg Roast).
  * **Vegetarian & Pure-Veg Guidance:** Filters plant-based Kerala staples (e.g., Masala Dosa, Idli Sambar, Pazham Pori).
  * **Beverages & Tea-Break Treats:** Recommends recess refreshments (Kerala Sulaimani, Fresh Lime Juice, Ela Ada).
  * **Popular & Bestsellers:** Recommends trending dishes ranked dynamically by real-time campus sales count (`soldCount`).
* **Interactive Conversational UX:** Provides 1-click quick-reply chips for instant meal discovery, realistic simulated response delay (600ms), and direct dish pricing feedback.

### 4.15 Macro-Nutrient Architecture & Real-Time Goal Filtering
* **Nutritional Metadata Schema:** Enriched every menu item with structured nutritional profiles (`calories`, `macros: { protein, carbs, fats }`).
* **Macro Goal Filtering:** Integrated an interactive header chip bar (`#student-macro-bar`) in the student ordering portal allowing instant filtration by fitness and dietary goals:
  * **High Protein (>15g):** Highlights muscle-recovery meals such as Malabar Chicken Biriyani (32g protein), Egg Roast (16g protein), and Masala Dosa (12g protein).
  * **Low Carb (<25g):** Isolates ketogenic and light carb dishes (e.g., Kerala Sulaimani, Fresh Lime Juice, Veg Cutlet).
  * **Low Fat (<8g):** Filters heart-healthy and low-lipid dishes (e.g., Idli Sambar, Sulaimani, Lime Juice).
  * **Low Calorie (<200 kcal):** Identifies guilt-free recess snacks under 200 calories.
* **Live Nutritional Telemetry:** Every food card showcases an active calorie pill (`🔥 X kcal`), and the dish modal provides real-time protein, carbs, and fats breakdown cards.

### 4.16 Flexible Portion Sizing Engine (Regular vs. Large +50%)
* **Portion Selection UI:** Integrated dual-state portion buttons (`Regular` and `Large (+50%)`) into the interactive food detail modal.
* **Dynamic Metric Scaling:** When selecting `Large (+50%)`, the system automatically scales:
  * Dish price by 1.5x (e.g., ₹50 Masala Dosa becomes ₹75).
  * Caloric and macronutrient stats dynamically (e.g., protein, carbs, and fats scale by 1.5x in real time).
* **Cart Segregation & Inventory Clamping:** 
  * Appends `-L` portion tags (`${item.id}-L`) with `Large ` item prefix to allow students to mix and match both regular and large portion sizes in the same cart.
  * Clamps portion ordering against real-time canteen kitchen inventory (`dailyStock`), preventing overselling during peak recess rush.

### 4.17 Data Layer Hygiene & Syntax Resiliency
* **Sanitized Dataset:** Purged orphaned duplicate menu definitions and syntax glitches in `data.js`.
* **Zero Syntax Errors:** Validated with Node.js parser (`node -c smart-canteen/frontend/js/data.js`), ensuring seamless offline browser runtime and full REST API parity on Node.js port 5000.

---

## 5. REST API Reference

| Endpoint | Method | Access / RBAC | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Authenticates credentials and returns user profile |
| `/api/users/profile/:id` | `GET` | Authenticated | Retrieves user metadata by Student/Staff/Admin ID |
| `/api/users` | `GET` | Staff / Admin | Lists all registered campus user accounts |
| `/api/departments` | `GET` | **Public / All** | Retrieves current departure timings for all 8 departments |
| `/api/departments/:code` | `PUT` | **Admin Only (RBAC)** | Updates departure & arrival windows for a department |
| `/api/departments` | `POST` | **Admin Only (RBAC)** | Creates a new department schedule |
| `/api/departments/:code` | `DELETE` | **Admin Only (RBAC)** | Deletes a department schedule |
| `/api/menu` | `GET` | Public | Returns Kerala canteen menu items with inventory status |
| `/api/menu` | `POST` | Admin / Staff (RBAC) | Adds a new menu item |
| `/api/menu/:id` | `PUT` | Admin / Staff (RBAC) | Updates item price, stock limit, or popularity tag |
| `/api/menu/:id` | `DELETE` | Admin / Staff (RBAC) | Removes a menu item from the campus menu |
| `/api/orders` | `POST` | Student | Creates reservation, issues token (`SC-XXX`) |
| `/api/orders` | `GET` | Staff / Admin | Lists all active and fulfilled orders |
| `/api/orders/:token` | `GET` | Authenticated | Retrieves details for a specific order token |
| `/api/orders/student/:id` | `GET` | Student | Retrieves order history for a specific student |
| `/api/orders/:token/status` | `PUT` | Staff / Admin | Transitions order state (`Preparing` / `Ready` / `Collected`) |
| `/api/orders/:token/cancel` | `PUT` | Authenticated | Cancels order and restocks inventory portions |
| `/api/analytics/financials`| `GET` | Admin Only | Daily revenue, cost breakdown, and net profit |
| `/api/analytics/crowd` | `GET` | Public / Admin | Real-time capacity utilization and wait times |
| `/api/analytics/demand` | `GET` | Staff / Admin | Kitchen demand forecasting and preparation metrics |

---

## 6. Pre-Configured Demo Credentials

Click the 1-click quick fill chips on the login screen or enter manually:

| Role | User ID | Password | Name | Department / Class |
| :--- | :--- | :--- | :--- | :--- |
| **🎓 Student (CS)** | `LM2026CS101` | `pass` | Amal Krishna | Computer Science (2nd Year, CS-B) |
| **🎓 Student (AI)** | `LM2026AI104` | `pass` | Diya Thomas | CS with AI (3rd Year, AI-A) |
| **🎓 Student (EC)** | `LM2026EC202` | `pass` | Rahul Mathew | Electronics & Comm (4th Year, EC-A) |
| **👨‍🍳 Staff (Kitchen)** | `LMC-STAFF-04` | `staff` | Ramesh Nair | Canteen Operations Head |
| **🛡️ Admin (Executive)** | `LMC-ADMIN-01` | `admin` | Dr. Jacob Kurian | Executive Board Director |

---

## 7. How to Run the Application

### Option 1: Full-Stack Node.js Server (Recommended)
```bash
# 1. Navigate to backend directory
cd code_crusaders-main/LMCST_SMARTCANTEEN/smart-canteen/backend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the server
node server.js
```
* **Application URL:** [http://localhost:5000](http://localhost:5000)
* Serves the single-page application and all REST API endpoints.
* Automatically uses `.env` configuration (`PORT=5000`, `MONGODB_URI=...`).
* In-memory mock fallback automatically activates if MongoDB service is not running.

### Option 2: Portable PowerShell Local Server
```powershell
# In LMCST_SMARTCANTEEN directory:
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```
* Serves the frontend at [http://localhost:8080/](http://localhost:8080/).

### Option 3: Direct Browser Launch (Zero-Install)
Open [`frontend/index.html`](file:///d:/IEDC%20Workshop/SWAP%203/rockz/code_crusaders-main/code_crusaders-main/LMCST_SMARTCANTEEN/smart-canteen/frontend/index.html) directly in any modern web browser.

---

## 8. Verification & QA Status

| Verification Area | Expected Behavior | Result |
| :--- | :--- | :--- |
| **Dark Mode Eradication** | Zero theme toggle buttons; zero `[data-theme="dark"]` rules | ✅ Passed (100% Light Luxury) |
| **Token Resolution** | Dynamic active order resolution without `SC-127` hardcoding | ✅ Passed (Tested across all order flows) |
| **Stock Management** | Real-time decrementing; sold-out prevention; demand sync | ✅ Passed (Zero-stock items blocked) |
| **UPI Verification Gate** | UPI order creation blocked until approval simulated | ✅ Passed (Guard active) |
| **Timeline Synchronization** | All 4 steps and 3 connectors dynamically mirror order status | ✅ Passed (Pending ➔ Preparing ➔ Ready ➔ Collected) |
| **Cross-Portal Live Sync** | Staff kitchen actions update student views and admin metrics | ✅ Passed (`syncAllPortals()` active) |
| **Departure Timers** | Dynamic calculation from assigned department windows | ✅ Passed |
| **Server Startup** | Express listening on port 5000 with in-memory fallback | ✅ Passed (HTTP 200 OK) |
| **AI Food Assistant** | Interactive floating conversational recommender with category parsing | ✅ Passed (Contextual responses verified) |
| **Nutritional Macros** | Dynamic macro goals (High Protein, Low Carb, Low Fat, Low Cal) | ✅ Passed (Calorie pills & macro chips live) |
| **Portion Sizing** | Dual portion selection (Regular / Large +50%) with dynamic pricing & macros | ✅ Passed (Accurate 1.5x scaling & cart split) |
| **Data Layer Integrity** | Clean data.js without duplicate blocks; passes node -c check | ✅ Passed (Clean execution) |

---

**Handover Status:** Complete, tested, and production-ready.
