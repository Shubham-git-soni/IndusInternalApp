using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Repositories;

public class EmployeeDocumentRepositoryAdo : IEmployeeDocumentRepository
{
    private readonly DatabaseConnection _dbConnection;

    public EmployeeDocumentRepositoryAdo(DatabaseConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    /// <summary>
    /// Add a single document
    /// </summary>
    public async Task<EmployeeDocument> AddAsync(EmployeeDocument document)
    {
        using (SqlConnection conn = _dbConnection.GetConnection())
        {
            await conn.OpenAsync();

            string query = @"
                INSERT INTO EmployeeDocuments (
                    EmployeeID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt, UploadedBy
                )
                VALUES (
                    @EmployeeID, @DocumentType, @FileName, @FilePath, @FileSize, @MimeType, @UploadedAt, @UploadedBy
                );
                SELECT CAST(SCOPE_IDENTITY() AS INT);";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@EmployeeID", document.EmployeeID);
                cmd.Parameters.AddWithValue("@DocumentType", document.DocumentType);
                cmd.Parameters.AddWithValue("@FileName", document.FileName);
                cmd.Parameters.AddWithValue("@FilePath", document.FilePath);
                cmd.Parameters.AddWithValue("@FileSize", (object?)document.FileSize ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@MimeType", (object?)document.MimeType ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@UploadedAt", document.UploadedAt);
                cmd.Parameters.AddWithValue("@UploadedBy", (object?)document.UploadedBy ?? DBNull.Value);

                int newId = (int)await cmd.ExecuteScalarAsync();
                document.DocumentID = newId;

                return document;
            }
        }
    }

    /// <summary>
    /// Add multiple documents in a single transaction
    /// </summary>
    public async Task<IEnumerable<EmployeeDocument>> AddMultipleAsync(List<EmployeeDocument> documents)
    {
        using (SqlConnection conn = _dbConnection.GetConnection())
        {
            await conn.OpenAsync();

            // Start transaction for atomicity
            using (SqlTransaction transaction = conn.BeginTransaction())
            {
                try
                {
                    string query = @"
                        INSERT INTO EmployeeDocuments (
                            EmployeeID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt, UploadedBy
                        )
                        VALUES (
                            @EmployeeID, @DocumentType, @FileName, @FilePath, @FileSize, @MimeType, @UploadedAt, @UploadedBy
                        );
                        SELECT CAST(SCOPE_IDENTITY() AS INT);";

                    foreach (var document in documents)
                    {
                        using (SqlCommand cmd = new SqlCommand(query, conn, transaction))
                        {
                            cmd.Parameters.AddWithValue("@EmployeeID", document.EmployeeID);
                            cmd.Parameters.AddWithValue("@DocumentType", document.DocumentType);
                            cmd.Parameters.AddWithValue("@FileName", document.FileName);
                            cmd.Parameters.AddWithValue("@FilePath", document.FilePath);
                            cmd.Parameters.AddWithValue("@FileSize", (object?)document.FileSize ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@MimeType", (object?)document.MimeType ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@UploadedAt", document.UploadedAt);
                            cmd.Parameters.AddWithValue("@UploadedBy", (object?)document.UploadedBy ?? DBNull.Value);

                            int newId = (int)await cmd.ExecuteScalarAsync();
                            document.DocumentID = newId;
                        }
                    }

                    transaction.Commit();
                    return documents;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }

    /// <summary>
    /// Get all documents for an employee
    /// </summary>
    public async Task<IEnumerable<EmployeeDocument>> GetByEmployeeIdAsync(int employeeId)
    {
        List<EmployeeDocument> documents = new();

        using (SqlConnection conn = _dbConnection.GetConnection())
        {
            await conn.OpenAsync();

            string query = @"
                SELECT DocumentID, EmployeeID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt, UploadedBy
                FROM EmployeeDocuments
                WHERE EmployeeID = @EmployeeID
                ORDER BY UploadedAt DESC";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@EmployeeID", employeeId);

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        documents.Add(new EmployeeDocument
                        {
                            DocumentID = reader.GetInt32(0),
                            EmployeeID = reader.GetInt32(1),
                            DocumentType = reader.GetString(2),
                            FileName = reader.GetString(3),
                            FilePath = reader.GetString(4),
                            FileSize = reader.IsDBNull(5) ? null : reader.GetString(5),
                            MimeType = reader.IsDBNull(6) ? null : reader.GetString(6),
                            UploadedAt = reader.GetDateTime(7),
                            UploadedBy = reader.IsDBNull(8) ? null : reader.GetString(8)
                        });
                    }
                }
            }
        }

        return documents;
    }

    /// <summary>
    /// Get document by ID
    /// </summary>
    public async Task<EmployeeDocument?> GetByIdAsync(int documentId)
    {
        using (SqlConnection conn = _dbConnection.GetConnection())
        {
            await conn.OpenAsync();

            string query = @"
                SELECT DocumentID, EmployeeID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt, UploadedBy
                FROM EmployeeDocuments
                WHERE DocumentID = @DocumentID";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@DocumentID", documentId);

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new EmployeeDocument
                        {
                            DocumentID = reader.GetInt32(0),
                            EmployeeID = reader.GetInt32(1),
                            DocumentType = reader.GetString(2),
                            FileName = reader.GetString(3),
                            FilePath = reader.GetString(4),
                            FileSize = reader.IsDBNull(5) ? null : reader.GetString(5),
                            MimeType = reader.IsDBNull(6) ? null : reader.GetString(6),
                            UploadedAt = reader.GetDateTime(7),
                            UploadedBy = reader.IsDBNull(8) ? null : reader.GetString(8)
                        };
                    }
                }
            }
        }

        return null;
    }

    /// <summary>
    /// Delete a document
    /// </summary>
    public async Task DeleteAsync(int documentId)
    {
        using (SqlConnection conn = _dbConnection.GetConnection())
        {
            await conn.OpenAsync();

            string query = "DELETE FROM EmployeeDocuments WHERE DocumentID = @DocumentID";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@DocumentID", documentId);
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }

    /// <summary>
    /// Delete all documents for an employee
    /// </summary>
    public async Task DeleteByEmployeeIdAsync(int employeeId)
    {
        using (SqlConnection conn = _dbConnection.GetConnection())
        {
            await conn.OpenAsync();

            string query = "DELETE FROM EmployeeDocuments WHERE EmployeeID = @EmployeeID";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@EmployeeID", employeeId);
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
