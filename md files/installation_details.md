Installation Directory: C:\Program Files\PostgreSQL\18
Server Installation Directory: C:\Program Files\PostgreSQL\18
Data Directory: C:\Program Files\PostgreSQL\18\data
Database Port: 5432
Database Superuser: postgres
Operating System Account: NT AUTHORITY\NetworkService
Database Service: postgresql-x64-18
Command Line Tools Installation Directory: C:\Program Files\PostgreSQL\18
pgAdmin4 Installation Directory: C:\Program Files\PostgreSQL\18\pgAdmin 4
Stack Builder Installation Directory: C:\Program Files\PostgreSQL\18
Installation Log: C:\Users\sonaw\AppData\Local\Temp\install-postgresql.log




users
 ├── user_profiles (1:1)
 ├── categories (1:N)
 ├── expenses (1:N)
 ├── budgets (1:N)
 ├── recurring_payments (1:N)
 ├── events (1:N)
 ├── notifications (1:N)
 ├── monthly_summary (1:N)
 ├── category_summary (1:N)
 ├── financial_scores (1:N)
 └── financial_predictions (1:N)

categories
 ├── expenses
 ├── budgets
 └── recurring_payments



terminal:

psql -U postgres
password: root

\c money_mind_dev --> connect the database