Design REST API contract for Expense module for a personal finance app.

Database table already exists:
expenses(id, user_id, category_id, amount, description, expense_date, payment_method, created_at)

Requirements:

Endpoints:

1. POST /expenses
Create new expense

2. GET /expenses
Get all expenses for authenticated user
Support filters:
- month
- category_id

3. GET /expenses/:id
Get single expense

4. PUT /expenses/:id
Update expense

5. DELETE /expenses/:id
Delete expense

Rules:
- All routes must require JWT authentication
- User can only access their own expenses
- Amount must be > 0
- expense_date required

Provide:
- Request JSON format
- Response JSON format
- Validation rules
- Error cases
- Query parameter structure

Do NOT provide implementation code.
