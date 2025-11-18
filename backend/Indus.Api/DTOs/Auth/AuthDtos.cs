namespace Indus.Api.DTOs.Auth;

public record RegisterDto(string FullName, string Email, string Password, int RoleID, int DepartmentID, int DesignationID);
public record LoginDto(string Email, string Password);
public record LoginResult(bool IsSuccess, string Message, Models.Employee? Employee = null);
