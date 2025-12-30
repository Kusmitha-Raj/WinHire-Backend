using Microsoft.Data.Sqlite;

var connectionString = "Data Source=winhire.db";

using (var connection = new SqliteConnection(connectionString))
{
    connection.Open();
    
    var command = connection.CreateCommand();
    command.CommandText = @"
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
    ";
    
    command.ExecuteNonQuery();
    Console.WriteLine("PanelistAvailabilities table created successfully!");
}
