SELECT * FROM [UserRole]


INSERT INTO [UserRole] ([UserId], [RoleId], [Name], [CreatedBy], [UpdatedBy])
SELECT
	U.[Id]
	,3
	,'User'
	,'import'
	,'import'
FROM
	[User] U
	LEFT JOIN [UserRole] UR ON U.[Id] = UR.[UserId]
WHERE
	UR.[UserId] IS NULL