using Indus.Api.DTOs.Employee;
using Indus.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Indus.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IDepartmentService _departmentService;
        private readonly IDesignationService _designationService;
        private readonly IRoleService _roleService;

        public EmployeesController(
            IEmployeeService employeeService,
            IDepartmentService departmentService,
            IDesignationService designationService,
            IRoleService roleService)
        {
            _employeeService = employeeService;
            _departmentService = departmentService;
            _designationService = designationService;
            _roleService = roleService;
        }

        // GET: /api/employees/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _employeeService.GetEmployeeStatsAsync();
            return Ok(stats);
        }

        // GET: /api/employees
        [HttpGet]
        public async Task<IActionResult> GetEmployees(
            [FromQuery] string? search,
            [FromQuery] string? department,
            [FromQuery] string? status)
        {
            var employees = await _employeeService.GetEmployeesWithDetailsAsync(search, department, status);
            return Ok(employees);
        }

        // GET: /api/employees/departments
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _departmentService.GetAllDepartmentsAsync();

            var result = departments.Select(d => new
            {
                Id = d.DepartmentID,
                Name = d.DepartmentName
            });

            return Ok(result);
        }

        // GET: /api/employees/designations
        [HttpGet("designations")]
        public async Task<IActionResult> GetDesignations()
        {
            var designations = await _designationService.GetAllDesignationsAsync();

            var result = designations.Select(d => new
            {
                Id = d.DesignationID,
                Name = d.DesignationName
            });

            return Ok(result);
        }

        // GET: /api/employees/managers
        [HttpGet("managers")]
        public async Task<IActionResult> GetManagers()
        {
            var managers = await _employeeService.GetManagersAsync();
            return Ok(managers);
        }

        // GET: /api/employees/roles
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleService.GetAllRolesAsync();

            var result = roles.Select(r => new
            {
                Id = r.RoleID,
                Name = r.RoleName
            });

            return Ok(result);
        }

        // GET: /api/employees/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeFullProfileAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        // POST: /api/employees
        /// <summary>
        /// Create new employee with documents (all-in-one transaction)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeWithDocumentsDto dto)
        {
            try
            {
                // Get current user email from claims (if authenticated)
                string uploadedBy = User.Identity?.Name ?? "System";

                var result = await _employeeService.CreateEmployeeWithDocumentsAsync(dto, uploadedBy);

                return CreatedAtAction(
                    nameof(GetEmployeeById),
                    new { id = result.EmployeeId },
                    result
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Failed to create employee",
                    error = ex.Message
                });
            }
        }

        // PUT: /api/employees/{id}
        /// <summary>
        /// Update existing employee
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto dto)
        {
            try
            {
                var updated = await _employeeService.UpdateEmployeeAsync(id, dto);

                if (!updated)
                {
                    return NotFound(new { message = "Employee not found" });
                }

                return Ok(new { message = "Employee updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Failed to update employee",
                    error = ex.Message
                });
            }
        }

        // DELETE: /api/employees/{id}
        /// <summary>
        /// Delete employee (soft delete - sets status to Inactive)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var deleted = await _employeeService.DeleteEmployeeAsync(id);

                if (!deleted)
                {
                    return NotFound(new { message = "Employee not found" });
                }

                return Ok(new { message = "Employee deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Failed to delete employee",
                    error = ex.Message
                });
            }
        }
    }
}
