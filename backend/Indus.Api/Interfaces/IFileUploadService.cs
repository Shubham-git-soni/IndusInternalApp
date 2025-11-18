namespace Indus.Api.Interfaces;

public interface IFileUploadService
{
    /// <summary>
    /// Upload a single file and return the file path
    /// </summary>
    Task<string> UploadFileAsync(IFormFile file, string folder, string? customFileName = null);

    /// <summary>
    /// Upload multiple files and return their paths
    /// </summary>
    Task<List<string>> UploadMultipleFilesAsync(List<IFormFile> files, string folder);

    /// <summary>
    /// Delete a file from the server
    /// </summary>
    Task<bool> DeleteFileAsync(string filePath);

    /// <summary>
    /// Get file size in readable format (KB, MB, etc.)
    /// </summary>
    string GetFileSize(long bytes);

    /// <summary>
    /// Validate file extension
    /// </summary>
    bool IsValidFileExtension(string fileName, string[] allowedExtensions);
}
