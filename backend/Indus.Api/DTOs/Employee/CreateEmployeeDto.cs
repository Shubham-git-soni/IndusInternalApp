namespace Indus.Api.DTOs.Employee;

/// <summary>
/// DTO for creating a new employee (POST /api/employees)
/// </summary>
public record CreateEmployeeDto(
    // Basic Information
    string FullName,
    string Email,
    string Password,
    string? PhoneNumber,
    string? PersonalEmail,
    DateTime? DateOfBirth,
    string? Gender,
    string? BloodGroup,
    string? MaritalStatus,
    DateTime? WeddingDate,

    // Address Information
    string? CurrentAddress,
    string? PermanentAddress,

    // Job Information
    int DepartmentId,
    int DesignationId,
    DateTime JoiningDate,
    DateTime? ConfirmationDate,
    string? EmployeeType,
    string? WorkLocation,
    int? ReportingManagerId,

    // Government Documents
    string? UanNumber,
    string? PanCardNumber,
    string? AadharCardNumber,

    // System Information
    int? RoleId,
    bool IsLoginEnabled,
    string Status,

    // Bank Details
    string? BankName,
    string? AccountNumber,
    string? IFSCCode,

    // Salary Information
    decimal? AnnualCTC,
    decimal? BasicSalary,
    decimal? HRA,
    decimal? PFDeduction,
    decimal? ProfessionalTax,
    decimal? OtherAllowances,
    decimal? CostRate,
    string? CostType,

    // Family Members
    List<CreateFamilyMemberDto>? FamilyMembers
);

public record CreateFamilyMemberDto(
    string FullName,
    string Relationship,
    DateTime DateOfBirth,
    string Gender,
    bool IsNominee,
    bool IsDependent
);
