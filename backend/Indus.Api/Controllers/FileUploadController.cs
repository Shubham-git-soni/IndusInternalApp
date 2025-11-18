using Indus.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Indus.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FileUploadController : ControllerBase
{
    private readonly IFileUploadService _fileUploadService;
    private readonly ILogger<FileUploadController> _logger;

    // Allowed file extensions for employee documents
    private readonly string[] _allowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx" };

    public FileUploadController(IFileUploadService fileUploadService, ILogger<FileUploadController> logger)
    {
        _fileUploadService = fileUploadService;
        _logger = logger;
    }

    /// <summary>
    /// Upload a single document
    /// POST: /api/fileupload/document
    /// </summary>
    [HttpPost("document")]
    public async Task<IActionResult> UploadDocument(IFormFile file, [FromForm] string documentType)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided" });

            // Validate file extension
            if (!_fileUploadService.IsValidFileExtension(file.FileName, _allowedExtensions))
            {
                return BadRequest(new { message = $"Invalid file type. Allowed: {string.Join(", ", _allowedExtensions)}" });
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "File size must be less than 5MB" });
            }

            // Upload file
            string filePath = await _fileUploadService.UploadFileAsync(file, "documents");

            return Ok(new
            {
                message = "File uploaded successfully",
                documentType,
                fileName = file.FileName,
                filePath,
                fileSize = _fileUploadService.GetFileSize(file.Length),
                mimeType = file.ContentType
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document");
            return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
        }
    }

    /// <summary>
    /// Upload multiple documents
    /// POST: /api/fileupload/documents
    /// </summary>
    [HttpPost("documents")]
    public async Task<IActionResult> UploadMultipleDocuments(List<IFormFile> files)
    {
        try
        {
            if (files == null || files.Count == 0)
                return BadRequest(new { message = "No files provided" });

            var uploadedFiles = new List<object>();

            foreach (var file in files)
            {
                // Validate file
                if (file.Length == 0) continue;

                if (!_fileUploadService.IsValidFileExtension(file.FileName, _allowedExtensions))
                {
                    uploadedFiles.Add(new
                    {
                        fileName = file.FileName,
                        success = false,
                        message = "Invalid file type"
                    });
                    continue;
                }

                if (file.Length > 5 * 1024 * 1024)
                {
                    uploadedFiles.Add(new
                    {
                        fileName = file.FileName,
                        success = false,
                        message = "File too large (max 5MB)"
                    });
                    continue;
                }

                // Upload file
                string filePath = await _fileUploadService.UploadFileAsync(file, "documents");

                uploadedFiles.Add(new
                {
                    fileName = file.FileName,
                    filePath,
                    fileSize = _fileUploadService.GetFileSize(file.Length),
                    mimeType = file.ContentType,
                    success = true
                });
            }

            return Ok(new
            {
                message = $"Uploaded {uploadedFiles.Count(f => ((dynamic)f).success)} of {files.Count} files",
                files = uploadedFiles
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading documents");
            return StatusCode(500, new { message = "Error uploading files", error = ex.Message });
        }
    }

    /// <summary>
    /// Upload employee photo
    /// POST: /api/fileupload/photo
    /// </summary>
    [HttpPost("photo")]
    public async Task<IActionResult> UploadPhoto(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided" });

            // Validate image file
            string[] allowedImageExtensions = { ".jpg", ".jpeg", ".png" };
            if (!_fileUploadService.IsValidFileExtension(file.FileName, allowedImageExtensions))
            {
                return BadRequest(new { message = "Only image files (jpg, jpeg, png) are allowed" });
            }

            // Validate file size (max 2MB for photos)
            if (file.Length > 2 * 1024 * 1024)
            {
                return BadRequest(new { message = "Photo size must be less than 2MB" });
            }

            // Upload photo
            string filePath = await _fileUploadService.UploadFileAsync(file, "photos");

            return Ok(new
            {
                message = "Photo uploaded successfully",
                fileName = file.FileName,
                filePath,
                fileSize = _fileUploadService.GetFileSize(file.Length)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading photo");
            return StatusCode(500, new { message = "Error uploading photo", error = ex.Message });
        }
    }
}
