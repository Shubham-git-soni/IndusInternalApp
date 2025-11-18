namespace Indus.Api.DTOs.Common;

/// <summary>
/// DTO for filtering employee list
/// </summary>
public record EmployeeFilterDto(
    string? Search,
    string? Department,
    string? Status
);
