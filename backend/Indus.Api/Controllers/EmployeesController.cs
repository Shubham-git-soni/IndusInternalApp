using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

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
        private readonly DatabaseConnection _dbConnection;

        public EmployeesController(
            IEmployeeService employeeService,
            IDepartmentService departmentService,
            IDesignationService designationService,
            IRoleService roleService,
            DatabaseConnection dbConnection)
        {
            _employeeService = employeeService;
            _departmentService = departmentService;
            _designationService = designationService;
            _roleService = roleService;
            _dbConnection = dbConnection;
        }

        // GET: /api/employees/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            int total = await _employeeService.GetTotalEmployeesCountAsync();
            int active = await _employeeService.GetActiveEmployeesCountAsync();
            int departments = await _departmentService.GetDepartmentsCountAsync();
            int newThisMonth = await _employeeService.GetNewEmployeesThisMonthAsync();

            var stats = new StatsDto(total, active, departments, newThisMonth);
            return Ok(stats);
        }

        // GET: /api/employees
        [HttpGet]
        public async Task<IActionResult> GetEmployees(
            [FromQuery] string? search,
            [FromQuery] string? department,
            [FromQuery] string? status)
        {
            List<EmployeeDto> employees = new List<EmployeeDto>();

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    SELECT
                        e.EmployeeID,
                        e.FullName,
                        e.Email,
                        e.PhoneNumber,
                        d.DepartmentName,
                        des.DesignationName,
                        e.DateOfJoining,
                        e.Status,
                        m.FullName AS ManagerName,
                        e.PhotoPath
                    FROM Employees e
                    INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
                    INNER JOIN Designations des ON e.DesignationID = des.DesignationID
                    LEFT JOIN Employees m ON e.ReportingManagerID = m.EmployeeID
                    WHERE 1=1";

                List<SqlParameter> parameters = new List<SqlParameter>();

                if (!string.IsNullOrEmpty(search))
                {
                    query += " AND (e.FullName LIKE @Search OR e.Email LIKE @Search)";
                    parameters.Add(new SqlParameter("@Search", "%" + search + "%"));
                }

                if (!string.IsNullOrEmpty(department) && department.ToLower() != "all")
                {
                    query += " AND d.DepartmentName = @Department";
                    parameters.Add(new SqlParameter("@Department", department));
                }

                if (!string.IsNullOrEmpty(status) && status.ToLower() != "all")
                {
                    query += " AND e.Status = @Status";
                    parameters.Add(new SqlParameter("@Status", status));
                }

                query += " ORDER BY e.EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddRange(parameters.ToArray());

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            employees.Add(new EmployeeDto(
                                reader.GetInt32(0), // EmployeeID
                                reader.GetString(1), // FullName
                                reader.GetString(2), // Email
                                reader.IsDBNull(3) ? null : reader.GetString(3), // PhoneNumber
                                reader.GetString(4), // DepartmentName
                                reader.GetString(5), // DesignationName
                                reader.GetDateTime(6).ToString("yyyy-MM-dd"), // DateOfJoining
                                reader.GetString(7), // Status
                                reader.IsDBNull(8) ? null : reader.GetString(8), // ManagerName
                                reader.IsDBNull(9) ? null : reader.GetString(9) // PhotoPath
                            ));
                        }
                    }
                }
            }

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
            List<object> managers = new List<object>();

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    SELECT
                        e.EmployeeID,
                        e.FullName,
                        d.DepartmentName,
                        des.DesignationName
                    FROM Employees e
                    INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
                    INNER JOIN Designations des ON e.DesignationID = des.DesignationID
                    WHERE e.IsActive = 1
                    ORDER BY e.FullName";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            managers.Add(new
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Department = reader.GetString(2),
                                Designation = reader.GetString(3)
                            });
                        }
                    }
                }
            }

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
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                // Main employee query with related data
                string query = @"
                    SELECT
                        e.EmployeeID, e.FullName, e.Email, e.PhoneNumber, e.PersonalEmail,
                        e.DateOfBirth, e.Gender, e.BloodGroup, e.MaritalStatus, e.WeddingDate,
                        e.CurrentAddress, e.PermanentAddress, e.DateOfJoining, e.ConfirmationDate,
                        e.EmployeeType, e.WorkLocation, e.UanNumber, e.PanCardNumber, e.AadharCardNumber,
                        e.Status, e.IsLoginEnabled, e.PhotoPath,
                        d.DepartmentName,
                        des.DesignationName,
                        r.RoleName,
                        m.FullName AS ManagerName,
                        b.BankName, b.AccountNumber, b.IFSCCode, b.AccountHolderName,
                        s.AnnualCTC, s.BasicSalary, s.HRA, s.PFDeduction, s.ProfessionalTax,
                        s.OtherAllowances, s.CostRate, s.CostType
                    FROM Employees e
                    LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
                    LEFT JOIN Designations des ON e.DesignationID = des.DesignationID
                    LEFT JOIN Roles r ON e.RoleID = r.RoleID
                    LEFT JOIN Employees m ON e.ReportingManagerID = m.EmployeeID
                    LEFT JOIN BankDetails b ON e.EmployeeID = b.EmployeeID
                    LEFT JOIN SalaryDetails s ON e.EmployeeID = s.EmployeeID
                    WHERE e.EmployeeID = @EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeID", id);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (!await reader.ReadAsync())
                        {
                            return NotFound();
                        }

                        // Build response object
                        var response = new
                        {
                            UserId = reader.GetInt32(reader.GetOrdinal("EmployeeID")),
                            FullName = reader.GetString(reader.GetOrdinal("FullName")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            PhoneNumber = reader.IsDBNull(reader.GetOrdinal("PhoneNumber")) ? null : reader.GetString(reader.GetOrdinal("PhoneNumber")),
                            PersonalEmail = reader.IsDBNull(reader.GetOrdinal("PersonalEmail")) ? null : reader.GetString(reader.GetOrdinal("PersonalEmail")),
                            DateOfBirth = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")).ToString("yyyy-MM-dd"),
                            Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? null : reader.GetString(reader.GetOrdinal("Gender")),
                            BloodGroup = reader.IsDBNull(reader.GetOrdinal("BloodGroup")) ? null : reader.GetString(reader.GetOrdinal("BloodGroup")),
                            MaritalStatus = reader.IsDBNull(reader.GetOrdinal("MaritalStatus")) ? null : reader.GetString(reader.GetOrdinal("MaritalStatus")),
                            WeddingDate = reader.IsDBNull(reader.GetOrdinal("WeddingDate")) ? null : reader.GetDateTime(reader.GetOrdinal("WeddingDate")).ToString("yyyy-MM-dd"),
                            CurrentAddress = reader.IsDBNull(reader.GetOrdinal("CurrentAddress")) ? null : reader.GetString(reader.GetOrdinal("CurrentAddress")),
                            PermanentAddress = reader.IsDBNull(reader.GetOrdinal("PermanentAddress")) ? null : reader.GetString(reader.GetOrdinal("PermanentAddress")),
                            Department = reader.IsDBNull(reader.GetOrdinal("DepartmentName")) ? null : reader.GetString(reader.GetOrdinal("DepartmentName")),
                            Designation = reader.IsDBNull(reader.GetOrdinal("DesignationName")) ? null : reader.GetString(reader.GetOrdinal("DesignationName")),
                            JoiningDate = reader.GetDateTime(reader.GetOrdinal("DateOfJoining")).ToString("yyyy-MM-dd"),
                            ConfirmationDate = reader.IsDBNull(reader.GetOrdinal("ConfirmationDate")) ? null : reader.GetDateTime(reader.GetOrdinal("ConfirmationDate")).ToString("yyyy-MM-dd"),
                            EmployeeType = reader.IsDBNull(reader.GetOrdinal("EmployeeType")) ? null : reader.GetString(reader.GetOrdinal("EmployeeType")),
                            WorkLocation = reader.IsDBNull(reader.GetOrdinal("WorkLocation")) ? null : reader.GetString(reader.GetOrdinal("WorkLocation")),
                            ManagerName = reader.IsDBNull(reader.GetOrdinal("ManagerName")) ? null : reader.GetString(reader.GetOrdinal("ManagerName")),
                            UanNumber = reader.IsDBNull(reader.GetOrdinal("UanNumber")) ? null : reader.GetString(reader.GetOrdinal("UanNumber")),
                            PanCardNumber = reader.IsDBNull(reader.GetOrdinal("PanCardNumber")) ? null : reader.GetString(reader.GetOrdinal("PanCardNumber")),
                            AadharCardNumber = reader.IsDBNull(reader.GetOrdinal("AadharCardNumber")) ? null : reader.GetString(reader.GetOrdinal("AadharCardNumber")),
                            Status = reader.GetString(reader.GetOrdinal("Status")),
                            IsLoginEnabled = reader.GetBoolean(reader.GetOrdinal("IsLoginEnabled")),
                            Role = reader.IsDBNull(reader.GetOrdinal("RoleName")) ? null : reader.GetString(reader.GetOrdinal("RoleName")),
                            PhotoPath = reader.IsDBNull(reader.GetOrdinal("PhotoPath")) ? null : reader.GetString(reader.GetOrdinal("PhotoPath")),

                            // Bank Details
                            BankDetails = reader.IsDBNull(reader.GetOrdinal("BankName")) ? null : new
                            {
                                BankName = reader.GetString(reader.GetOrdinal("BankName")),
                                AccountNumber = reader.IsDBNull(reader.GetOrdinal("AccountNumber")) ? null : reader.GetString(reader.GetOrdinal("AccountNumber")),
                                IFSCCode = reader.IsDBNull(reader.GetOrdinal("IFSCCode")) ? null : reader.GetString(reader.GetOrdinal("IFSCCode")),
                                AccountHolderName = reader.IsDBNull(reader.GetOrdinal("AccountHolderName")) ? null : reader.GetString(reader.GetOrdinal("AccountHolderName"))
                            },

                            // Salary Details
                            SalaryDetails = reader.IsDBNull(reader.GetOrdinal("AnnualCTC")) ? null : new
                            {
                                AnnualCTC = reader.GetDecimal(reader.GetOrdinal("AnnualCTC")),
                                BasicSalary = reader.IsDBNull(reader.GetOrdinal("BasicSalary")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("BasicSalary")),
                                HRA = reader.IsDBNull(reader.GetOrdinal("HRA")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("HRA")),
                                PFDeduction = reader.IsDBNull(reader.GetOrdinal("PFDeduction")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("PFDeduction")),
                                ProfessionalTax = reader.IsDBNull(reader.GetOrdinal("ProfessionalTax")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("ProfessionalTax")),
                                OtherAllowances = reader.IsDBNull(reader.GetOrdinal("OtherAllowances")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("OtherAllowances")),
                                CostRate = reader.IsDBNull(reader.GetOrdinal("CostRate")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("CostRate")),
                                CostType = reader.IsDBNull(reader.GetOrdinal("CostType")) ? null : reader.GetString(reader.GetOrdinal("CostType"))
                            },

                            FamilyMembers = new List<object>() // Will fetch separately
                        };

                        // Close the first reader
                        reader.Close();

                        // Now fetch family members
                        string familyQuery = @"
                            SELECT FamilyMemberID, FullName, Relationship, DateOfBirth, Gender, IsNominee, IsDependent
                            FROM FamilyMembers
                            WHERE EmployeeID = @EmployeeID";

                        var familyMembers = new List<object>();
                        using (SqlCommand familyCmd = new SqlCommand(familyQuery, conn))
                        {
                            familyCmd.Parameters.AddWithValue("@EmployeeID", id);

                            using (SqlDataReader familyReader = await familyCmd.ExecuteReaderAsync())
                            {
                                while (await familyReader.ReadAsync())
                                {
                                    familyMembers.Add(new
                                    {
                                        Id = familyReader.GetInt32(0),
                                        FullName = familyReader.GetString(1),
                                        Relationship = familyReader.GetString(2),
                                        DateOfBirth = familyReader.GetDateTime(3).ToString("yyyy-MM-dd"),
                                        Gender = familyReader.IsDBNull(4) ? null : familyReader.GetString(4),
                                        IsNominee = familyReader.GetBoolean(5),
                                        IsDependent = familyReader.GetBoolean(6)
                                    });
                                }
                            }
                        }

                        // Create final response with family members
                        var finalResponse = new
                        {
                            response.UserId,
                            response.FullName,
                            response.Email,
                            response.PhoneNumber,
                            response.PersonalEmail,
                            response.DateOfBirth,
                            response.Gender,
                            response.BloodGroup,
                            response.MaritalStatus,
                            response.WeddingDate,
                            response.CurrentAddress,
                            response.PermanentAddress,
                            response.Department,
                            response.Designation,
                            response.JoiningDate,
                            response.ConfirmationDate,
                            response.EmployeeType,
                            response.WorkLocation,
                            response.ManagerName,
                            response.UanNumber,
                            response.PanCardNumber,
                            response.AadharCardNumber,
                            response.Status,
                            response.IsLoginEnabled,
                            response.Role,
                            response.PhotoPath,
                            response.BankDetails,
                            response.SalaryDetails,
                            FamilyMembers = familyMembers
                        };

                        return Ok(finalResponse);
                    }
                }
            }
        }

        /*
         * TODO: The following endpoints still need to be implemented:
         *
         * POST /api/employees - Create new employee with transaction
         * PUT /api/employees/{id} - Update employee
         * DELETE /api/employees/{id} - Delete employee
         *
         * See EMPLOYEES_CONTROLLER_TODO.md for implementation details
         */
    }
}
