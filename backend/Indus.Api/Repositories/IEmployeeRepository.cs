using Indus.Api.Models;

// Ensure the namespace is exactly this
namespace Indus.Api.Repositories
{
    public interface IEmployeeRepository
    {
        Task<Employee?> GetByEmailAsync(string email);
        Task<Employee> AddAsync(Employee employee);
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int employeeId); // <-- Yeh nayi line add karein
        Task UpdateAsync(Employee employee);
    }
}