using Indus.Api.Models;

namespace Indus.Api.Interfaces;

public interface IEmployeeDocumentRepository
{
    Task<EmployeeDocument> AddAsync(EmployeeDocument document);
    Task<IEnumerable<EmployeeDocument>> AddMultipleAsync(List<EmployeeDocument> documents);
    Task<IEnumerable<EmployeeDocument>> GetByEmployeeIdAsync(int employeeId);
    Task<EmployeeDocument?> GetByIdAsync(int documentId);
    Task DeleteAsync(int documentId);
    Task DeleteByEmployeeIdAsync(int employeeId);
}
