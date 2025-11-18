using Indus.Api.DTOs.Employee;
using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IEmployeeRepository
    {
        // Basic CRUD operations
        Task<Employee?> GetByEmailAsync(string email);
        Task<Employee> AddAsync(Employee employee);
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int employeeId);
        Task UpdateAsync(Employee employee);

        // Complex queries with DTOs
        Task<IEnumerable<EmployeeListItemDto>> GetEmployeesWithDetailsAsync(string? search, string? department, string? status);
        Task<EmployeeDetailDto?> GetEmployeeFullProfileAsync(int employeeId);
        Task<IEnumerable<ManagerDto>> GetManagersAsync();
    }
}
