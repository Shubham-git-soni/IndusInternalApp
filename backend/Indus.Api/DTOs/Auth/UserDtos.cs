namespace Indus.Api.DTOs.Auth;

public record UserDto(int EmployeeID, string FullName, string Email, bool IsActive, string RoleName);
public record UpdateUserRoleDto(int RoleID);
public record UpdateUserStatusDto(bool IsActive);
