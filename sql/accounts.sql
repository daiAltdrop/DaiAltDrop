-- створення таблиці акаунтів
create table Accounts
(
    Id int PRIMARY KEY identity(1,1),
    FirstName nvarchar(100) not null,
    LastName nvarchar(100) not null,
    Email nvarchar(100) not null unique,
    Phone nvarchar(20) not null unique,
    PasswordHash nvarchar(255) not null,
    Avatar nvarchar(255) null,
    Login nvarchar(50) not null unique
);

-- створення таблиці статусів акаунта (без поле identified)
create table AccountStatuses
(
    AccountId int PRIMARY KEY FOREIGN KEY REFERENCES Accounts(Id),
    EmailVerified bit not null default(0),
    PhoneVerified bit not null default(0),
    AgeVerified bit not null default(0)
);