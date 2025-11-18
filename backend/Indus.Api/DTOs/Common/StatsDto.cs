namespace Indus.Api.DTOs.Common;

/// <summary>
/// DTO for dashboard statistics
/// </summary>
public record StatsDto(
    int TotalEmployees,
    int ActiveEmployees,
    int TotalDepartments,
    int NewThisMonth
);
