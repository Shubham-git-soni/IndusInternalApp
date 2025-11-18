using Indus.Api.DTOs.Common;
using Indus.Api.DTOs.Employee;
using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IEmployeeService
    {
        // Basic CRUD operations
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<Employee?> GetEmployeeByIdAsync(int employeeId);
        Task<Employee?> GetEmployeeByEmailAsync(string email);
        Task<Employee> CreateEmployeeAsync(Employee employee);
        Task UpdateEmployeeAsync(Employee employee);

        // Statistics
        Task<StatsDto> GetEmployeeStatsAsync();

        // DTOs-based queries (for controller endpoints)
        Task<IEnumerable<EmployeeListItemDto>> GetEmployeesWithDetailsAsync(string? search, string? department, string? status);
        Task<EmployeeDetailDto?> GetEmployeeFullProfileAsync(int employeeId);
        Task<IEnumerable<ManagerDto>> GetManagersAsync();

        // Employee with documents creation (with transaction support)
        Task<CreateEmployeeResponseDto> CreateEmployeeWithDocumentsAsync(CreateEmployeeWithDocumentsDto dto, string uploadedBy);

        // Update & Delete operations
        Task<bool> UpdateEmployeeAsync(int employeeId, UpdateEmployeeDto dto);
        Task<bool> DeleteEmployeeAsync(int employeeId);
    }
}
