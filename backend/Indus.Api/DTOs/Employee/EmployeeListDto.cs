namespace Indus.Api.DTOs.Employee;

/// <summary>
/// DTO for employee list view (GET /api/employees)
/// </summary>
public record EmployeeListItemDto(
    int UserId,
    string FullName,
    string Email,
    string? PhoneNumber,
    string Department,
    string Designation,
    string JoiningDate,
    string Status,
    string? ManagerName,
    string? PhotoPath
);
