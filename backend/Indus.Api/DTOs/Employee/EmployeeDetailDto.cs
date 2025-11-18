namespace Indus.Api.DTOs.Employee;

/// <summary>
/// DTO for employee detail view (GET /api/employees/{id})
/// </summary>
public record EmployeeDetailDto(
    int UserId,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? PersonalEmail,
    string? DateOfBirth,
    string? Gender,
    string? BloodGroup,
    string? MaritalStatus,
    string? WeddingDate,
    string? CurrentAddress,
    string? PermanentAddress,
    string? Department,
    string? Designation,
    string JoiningDate,
    string? ConfirmationDate,
    string? EmployeeType,
    string? WorkLocation,
    string? ManagerName,
    string? UanNumber,
    string? PanCardNumber,
    string? AadharCardNumber,
    string Status,
    bool IsLoginEnabled,
    string? Role,
    string? PhotoPath,
    BankDetailsDto? BankDetails,
    SalaryDetailsDto? SalaryDetails,
    List<FamilyMemberDto> FamilyMembers
);

public record BankDetailsDto(
    string BankName,
    string? AccountNumber,
    string? IFSCCode,
    string? AccountHolderName
);

public record SalaryDetailsDto(
    decimal AnnualCTC,
    decimal? BasicSalary,
    decimal? HRA,
    decimal? PFDeduction,
    decimal? ProfessionalTax,
    decimal? OtherAllowances,
    decimal? CostRate,
    string? CostType
);

public record FamilyMemberDto(
    int Id,
    string FullName,
    string Relationship,
    string DateOfBirth,
    string? Gender,
    bool IsNominee,
    bool IsDependent
);
