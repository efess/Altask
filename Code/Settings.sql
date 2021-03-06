/*
   Friday, May 25, 20188:23:16 AM
   User: 
   Server: RayNeshko-LT\SQL2008
   Database: Altask
   Application: 
*/

/* To prevent any potential data loss issues, you should review this script in detail before running it outside the context of the database designer.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Settings
	(
	Id int NOT NULL IDENTITY (1, 1),
	Name varchar(100) NOT NULL,
	Area varchar(100) NULL,
	Classification varchar(100) NULL,
	Value varchar(250) NULL,
	CreatedBy varchar(50) NOT NULL,
	CreatedOn datetime2(7) NOT NULL,
	UpdatedBy varchar(50) NOT NULL,
	UpdatedOn datetime2(7) NOT NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.Settings ADD CONSTRAINT
	PK_Settings PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
CREATE UNIQUE NONCLUSTERED INDEX IX_Settings_Unique ON dbo.Settings
	(
	Area,
	Classification,
	Name
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE dbo.Settings ADD CONSTRAINT
	FK_Settings_Settings FOREIGN KEY
	(
	Id
	) REFERENCES dbo.Settings
	(
	Id
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Settings SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
