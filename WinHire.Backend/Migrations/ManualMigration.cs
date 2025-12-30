using Microsoft.Data.Sqlite;
using System;

namespace WinHire.Backend.Migrations
{
    public class ManualMigration
    {
        public static void ApplyMigration(string connectionString)
        {
            using var connection = new SqliteConnection(connectionString);
            connection.Open();

            try
            {
                // Add Round column to Interviews table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Interviews ADD COLUMN Round INTEGER NOT NULL DEFAULT 1;
                ");
                Console.WriteLine("✓ Added Round column to Interviews");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- Round column already exists in Interviews");
            }

            try
            {
                // Add PanelistIds column to Interviews table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Interviews ADD COLUMN PanelistIds TEXT;
                ");
                Console.WriteLine("✓ Added PanelistIds column to Interviews");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- PanelistIds column already exists in Interviews");
            }

            try
            {
                // Add CurrentRound column to Applications table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Applications ADD COLUMN CurrentRound INTEGER;
                ");
                Console.WriteLine("✓ Added CurrentRound column to Applications");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- CurrentRound column already exists in Applications");
            }

            try
            {
                // Add Round column to Feedbacks table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Feedbacks ADD COLUMN Round INTEGER;
                ");
                Console.WriteLine("✓ Added Round column to Feedbacks");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- Round column already exists in Feedbacks");
            }

            try
            {
                // Add TechnicalSkillsRating column to Feedbacks table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Feedbacks ADD COLUMN TechnicalSkillsRating INTEGER;
                ");
                Console.WriteLine("✓ Added TechnicalSkillsRating column to Feedbacks");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- TechnicalSkillsRating column already exists in Feedbacks");
            }

            try
            {
                // Add CommunicationRating column to Feedbacks table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Feedbacks ADD COLUMN CommunicationRating INTEGER;
                ");
                Console.WriteLine("✓ Added CommunicationRating column to Feedbacks");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- CommunicationRating column already exists in Feedbacks");
            }

            try
            {
                // Add ProblemSolvingRating column to Feedbacks table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Feedbacks ADD COLUMN ProblemSolvingRating INTEGER;
                ");
                Console.WriteLine("✓ Added ProblemSolvingRating column to Feedbacks");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- ProblemSolvingRating column already exists in Feedbacks");
            }

            try
            {
                // Add CulturalFitRating column to Feedbacks table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Feedbacks ADD COLUMN CulturalFitRating INTEGER;
                ");
                Console.WriteLine("✓ Added CulturalFitRating column to Feedbacks");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- CulturalFitRating column already exists in Feedbacks");
            }

            try
            {
                // Add OverallRating column to Feedbacks table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Feedbacks ADD COLUMN OverallRating INTEGER;
                ");
                Console.WriteLine("✓ Added OverallRating column to Feedbacks");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- OverallRating column already exists in Feedbacks");
            }

            try
            {
                // Add Specialization column to Users table
                ExecuteNonQuery(connection, @"
                    ALTER TABLE Users ADD COLUMN Specialization TEXT;
                ");
                Console.WriteLine("✓ Added Specialization column to Users");
            }
            catch (SqliteException ex) when (ex.Message.Contains("duplicate column"))
            {
                Console.WriteLine("- Specialization column already exists in Users");
            }

            try
            {
                // Create PanelistAvailabilities table
                ExecuteNonQuery(connection, @"
                    CREATE TABLE IF NOT EXISTS PanelistAvailabilities (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        PanelistId INTEGER NOT NULL,
                        AvailableDate TEXT NOT NULL,
                        StartTime TEXT NOT NULL,
                        EndTime TEXT NOT NULL,
                        Status TEXT NOT NULL DEFAULT 'Available',
                        Notes TEXT,
                        CreatedAt TEXT NOT NULL,
                        FOREIGN KEY(PanelistId) REFERENCES Users(Id) ON DELETE CASCADE
                    );
                ");
                Console.WriteLine("✓ Created PanelistAvailabilities table");
            }
            catch (SqliteException ex)
            {
                Console.WriteLine($"- PanelistAvailabilities table creation: {ex.Message}");
            }

            Console.WriteLine("\nMigration completed successfully!");
        }

        private static void ExecuteNonQuery(SqliteConnection connection, string sql)
        {
            using var command = connection.CreateCommand();
            command.CommandText = sql;
            command.ExecuteNonQuery();
        }
    }
}
