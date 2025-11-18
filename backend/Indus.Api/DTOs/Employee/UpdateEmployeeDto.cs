namespace Indus.Api.DTOs.Employee;

/// <summary>
/// DTO for updating an existing employee (PUT /api/employees/{id})
/// Matches frontend Add Team Member form fields
/// </summary>
public record UpdateEmployeeDto(
    // Basic Information
    string FullName,
    string? PhoneNumber,
    string? PersonalEmail,
    DateTime? DateOfBirth,
    string? Gender,
    string? BloodGroup,
    string? MaritalStatus,
    DateTime? WeddingDate,
    string? FatherName,
    string? EmergencyContactNumber,
    string? EmergencyContactRelation,

    // Address Information
    string? CurrentAddress,
    string? PermanentAddress,

    // Job Information
    int DepartmentId,
    int DesignationId,
    DateTime? ConfirmationDate,
    string? EmployeeType,
    string? WorkLocation,
    int? ReportingManagerId,

    // Government Documents
    string? UanNumber,
    string? PanCardNumber,
    string? AadharCardNumber,

    // System Information
    string Status // "Active", "Inactive", "Resigned"
);
