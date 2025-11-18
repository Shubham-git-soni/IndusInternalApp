namespace Indus.Api.DTOs.Employee;

/// <summary>
/// DTO for document upload information
/// </summary>
public record DocumentUploadDto(
    string DocumentType,  // "AadharCard", "PanCard", "BankPassbook", "Photo", etc.
    string FileName,
    string FilePath,
    string? FileSize,
    string? MimeType
);

/// <summary>
/// DTO for creating employee with documents
/// </summary>
public record CreateEmployeeWithDocumentsDto
{
    // Basic Information
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public string? PersonalEmail { get; init; }
    public DateTime? DateOfBirth { get; init; }
    public string? Gender { get; init; }
    public string? BloodGroup { get; init; }
    public string? MaritalStatus { get; init; }
    public DateTime? WeddingDate { get; init; }
    public string? FatherName { get; init; }
    public string? EmergencyContactNumber { get; init; }
    public string? EmergencyContactRelation { get; init; }

    // Address Information
    public string? CurrentAddress { get; init; }
    public string? PermanentAddress { get; init; }

    // Job Information
    public int DepartmentId { get; init; }
    public int DesignationId { get; init; }
    public DateTime JoiningDate { get; init; }
    public DateTime? ConfirmationDate { get; init; }
    public string? EmployeeType { get; init; }
    public string? WorkLocation { get; init; }
    public int? ReportingManagerId { get; init; }

    // Government Documents
    public string? UanNumber { get; init; }
    public string? PanCardNumber { get; init; }
    public string? AadharCardNumber { get; init; }

    // System Information
    public int? RoleId { get; init; }
    public bool IsLoginEnabled { get; init; } = true;
    public string Status { get; init; } = "Active";

    // Bank Details
    public string? BankName { get; init; }
    public string? AccountNumber { get; init; }
    public string? IFSCCode { get; init; }

    // Salary Information
    public decimal? AnnualCTC { get; init; }
    public decimal? BasicSalary { get; init; }
    public decimal? HRA { get; init; }
    public decimal? PFDeduction { get; init; }
    public decimal? ProfessionalTax { get; init; }
    public decimal? OtherAllowances { get; init; }
    public decimal? CostRate { get; init; }
    public string? CostType { get; init; }

    // Family Members
    public List<CreateFamilyMemberDto>? FamilyMembers { get; init; }

    // 🆕 Documents (will be uploaded as files)
    // Frontend will upload files first, then send file paths
    public List<DocumentUploadDto>? Documents { get; init; }
}

/// <summary>
/// Response after creating employee with documents
/// </summary>
public record CreateEmployeeResponseDto(
    int EmployeeId,
    string FullName,
    string Email,
    string Message,
    List<string> UploadedDocuments
);
