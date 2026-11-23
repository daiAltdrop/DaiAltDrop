CREATE TABLE Reactions
(
    -- Кожна реакція належить користувачу та кейсу.
    Id int PRIMARY KEY IDENTITY(1,1),
    UserId int NOT NULL,
    CaseId int NOT NULL,
    ReactionType nvarchar(20) NOT NULL
        CHECK (ReactionType IN (N'like', N'love', N'wow', N'sad', N'angry')),
    CreatedAt datetime2 NOT NULL DEFAULT (SYSDATETIME()),

    -- Користувач може залишити лише одну реакцію на один кейс.
    CONSTRAINT UQ_Reactions_User_Case UNIQUE (UserId, CaseId)
);

CREATE TABLE Comments
(
    Id int PRIMARY KEY IDENTITY(1,1),
    UserId int NOT NULL,
    CaseId int NOT NULL,
    Content nvarchar(1000) NOT NULL
        CHECK (LEN(LTRIM(RTRIM(Content))) > 0),
    CreatedAt datetime2 NOT NULL DEFAULT (SYSDATETIME())
);