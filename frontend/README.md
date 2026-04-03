# CampusLancer Frontend

This is a premium, modern frontend built with React (Vite) and Tailwind CSS, connected to your FastAPI backend.

## 🚀 How to Run the Frontend

1. Ensure your backend is running at `http://127.0.0.1:8000`.
2. Open a terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install the dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173` (or the URL Vite provides).

---

## 🧪 Testing the User Journey Flow

To fully test the application, you'll need to simulate two users: **The Client** (creates tasks) and **The Freelancer** (applies and works). You can use two different browser windows (one regular, one incognito) to test this smoothly.

### 1. Register & Login
* Go to the **Register** page.
* Create User A (Client) and User B (Freelancer).
* Log in as User A in your normal browser, and User B in an incognito window.

### 2. Create Task (Client)
* As User A, click **Post a Task** in the navbar.
* Fill in the Title, Description, and Budget.
* Click Submit. You'll be redirected to your "My Tasks" page.

### 3. Apply to Task (Freelancer)
* Switch to User B's window.
* Go to the **Dashboard** (Explore Tasks). You will see the task posted by User A.
* Click the **Apply Now** button. A success toast notification will appear.

### 4. Assign Freelancer (Client)
* Switch back to User A.
* Go to **My Tasks**. On the task card, click the **Applicants** button.
* You will see User B's application. Click **Assign to Task**.
* The task status will change to `assigned`.

### 5. Chat (Both Users)
* For User A: Go to **My Tasks**, click **Open Chat** on the assigned task card.
* For User B: Go to **My Tasks** -> **My Assignments**, click **Open Chat with Client**.
* Both users can now send messages back and forth in real-time (auto-refreshes every 5 seconds).

### 6. Mark Complete (Client)
* As User A, go to **My Tasks**.
* On the assigned task, click the green **Complete** button.
* The task status will update to `completed` and the finalize sequence is complete.

---

## 🐛 How to Detect Bugs

* **Console Errors:** Open browser developer tools (F12) and check the "Console" tab for Red errors during API calls or routing.
* **Network Tab:** Check the "Network" tab in dev tools. Filter by `Fetch/XHR`. Make sure requests to `http://127.0.0.1:8000` are returning `200 OK` or expected JSON responses.
* **Toast Notifications:** The app incorporates `react-toastify`. If an API call fails, a red notification will pop up in the top right corner with the specific backend error message.

---

## 🔧 Common Issues & Fixes

1. **"Network Error" when trying to Register/Login or Fetch Tasks:**
   * **Cause:** The frontend cannot reach the backend.
   * **Fix:** Make sure your FastAPI backend is running. Check if it's running on port `8000`. Also, ensure CORS middleware is configured in FastAPI to allow `http://localhost:5173`.

2. **"Not Authenticated" / Redirection loop to Login:**
   * **Cause:** The JWT token has expired or is missing.
   * **Fix:** The frontend automatically clears bad tokens and redirects to login. Just log in again.

3. **Status changes/applications not updating locally:**
   * **Cause:** The frontend caches data and refetches on page reload.
   * **Fix:** Simply refresh the page or navigate away and back to let the `useEffect` hooks pull fresh data. (The chat is built to auto-refresh).

4. **White Screen on Load (React Crash):**
   * **Cause:** Internal UI exception. 
   * **Fix:** Open the console (DevTools). Look for the exact line causing the crash. Ensure the API isn't returning radically different JSON formats (e.g., returning a string when an array is expected for tasks).

Enjoy your new CampusLancer platform!
