namespace Indus.Api.DTOs.Employee;

/// <summary>
/// DTO for manager list (GET /api/employees/managers)
/// </summary>
public record ManagerDto(
    int Id,
    string Name,
    string Department,
    string Designation
);
