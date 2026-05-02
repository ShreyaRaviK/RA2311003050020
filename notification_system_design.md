# Notification System Design – Priority Inbox (Stage 1)

## 1. Overview

This system implements a Priority Inbox that retrieves notifications from a notification service API and displays the most important unread notifications first.

The solution supports selecting the top **N priority notifications dynamically** (e.g., 5, 10, 15, 20), based on user preference. If no value is provided, the system defaults to returning the **top 10 notifications**.

The implementation follows the constraints specified in the assignment:

* No database usage
* No UI required for Stage 1
* API-based notification retrieval
* Logging middleware integration
* Priority-based notification ordering
* Efficient and scalable sorting strategy

---

## 2. Data Source

Notifications are fetched using a REST API endpoint:

GET
`/evaluation-service/notifications`

Each notification contains:

* id
* type
* message
* timestamp

Supported notification types:

* Placement
* Result
* Event

---

## 3. Priority Assignment Strategy

Notifications are prioritized based on importance:

| Notification Type | Priority Level |
| ----------------- | -------------- |
| Placement         | High (3)       |
| Result            | Medium (2)     |
| Event             | Low (1)        |

This mapping ensures placement-related notifications appear first, followed by results and events.

---

## 4. Sorting Logic

Notifications are sorted using two criteria:

### Primary Sorting

Priority level (descending)

Example:

Placement → Result → Event

### Secondary Sorting

Timestamp (descending)

Newer notifications appear before older notifications when priority levels are equal.

Sorting implementation complexity:

O(n log n)

This is efficient for the expected dataset size.

---

## 5. Configurable Priority Inbox Size

The system supports selecting the number of notifications displayed dynamically.

Example usage:

node notification_app_fe/stage1.js 5
node notification_app_fe/stage1.js 15

If no value is provided:

Default:

Top 10 notifications

This design ensures flexibility while maintaining predictable behavior.

---

## 6. Logging Middleware Design

A reusable logging middleware function was implemented:

Log(stack, level, package, message)

This middleware sends structured logs to:

POST
`/evaluation-service/logs`

Example:

Log("frontend", "info", "api", "Fetching notifications")

Logging is performed during:

* API request start
* API request success
* Sorting process
* Output generation
* Error handling

This ensures observability and traceability of system execution.

---

## 7. System Workflow

The system follows this execution pipeline:

Step 1
Fetch notifications from API

Step 2
Assign priority values

Step 3
Sort notifications using priority + timestamp

Step 4
Select top N notifications

Step 5
Display results in terminal

Step 6
Log execution events using middleware

---

## 8. Error Handling Strategy

The system handles:

* API request failure
* invalid authorization token errors
* empty notification response
* invalid input values for N

Fallback behavior:

If N is invalid or not provided → default = 10

---

## 9. Scalability Considerations

For larger datasets, sorting the entire notification list may become inefficient.

An optimized alternative approach:

Use a Max Heap / Priority Queue

Time complexity becomes:

O(n log k)

Where:

k = number of required top notifications

This improves performance when handling large notification streams.

---

## 10. Design Constraints Followed

The implementation strictly follows assignment requirements:

✔ API-only notification retrieval
✔ No database storage
✔ Logging middleware integration
✔ Priority-based sorting
✔ Configurable top-N selection
✔ Default fallback behavior
✔ Modular reusable code

---

## 11. Output

The system displays:

Top N most important unread notifications

in descending priority order directly in the terminal.

Example:

TOP 10 IMPORTANT NOTIFICATIONS
