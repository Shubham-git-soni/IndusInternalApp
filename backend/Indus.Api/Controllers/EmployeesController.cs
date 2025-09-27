using Indus.Api.Data;
using Indus.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Indus.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IndusDbContext _context;

        public EmployeesController(IndusDbContext context)
        {
            _context = context;
        }

        // GET: /api/employees/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _context.Employees.CountAsync();
            var active = await _context.Employees.CountAsync(e => e.IsActive);
            var departments = await _context.Departments.CountAsync();
            var newThisMonth = await _context.Employees.CountAsync(e => e.DateOfJoining.Month == DateTime.UtcNow.Month && e.DateOfJoining.Year == DateTime.UtcNow.Year);

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
            var query = _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.ReportingManager)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(e => e.FullName.Contains(search) || e.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(department) && department.ToLower() != "all")
            {
                query = query.Where(e => e.Department.DepartmentName == department);
            }

            if (!string.IsNullOrEmpty(status) && status.ToLower() != "all")
            {
                query = query.Where(e => e.Status.ToLower() == status.ToLower());
            }

            var employees = await query
                .Select(e => new EmployeeDto(
                    e.EmployeeID,
                    e.FullName,
                    e.Email,
                    e.PhoneNumber,
                    e.Department.DepartmentName,
                    e.Designation.DesignationName,
                    e.DateOfJoining.ToString("yyyy-MM-dd"),
                    e.Status,
                    e.ReportingManager != null ? e.ReportingManager.FullName : null,
                    e.PhotoPath
                )).ToListAsync();

            return Ok(employees);
        }

        // POST: /api/employees
        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create the main employee record
                var newEmployee = new Employee
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PasswordHash = dto.Password, // Store plain text password
                    PhoneNumber = dto.PhoneNumber,
                    PersonalEmail = dto.PersonalEmail,
                    DateOfBirth = dto.DateOfBirth,
                    Gender = dto.Gender,
                    BloodGroup = dto.BloodGroup,
                    MaritalStatus = dto.MaritalStatus,
                    WeddingDate = dto.WeddingDate,
                    CurrentAddress = dto.CurrentAddress,
                    PermanentAddress = dto.PermanentAddress,
                    DepartmentID = dto.DepartmentId,
                    DesignationID = dto.DesignationId,
                    DateOfJoining = dto.JoiningDate,
                    ConfirmationDate = dto.ConfirmationDate,
                    EmployeeType = dto.EmployeeType,
                    WorkLocation = dto.WorkLocation,
                    ReportingManagerID = dto.ReportingManagerId,
                    UanNumber = dto.UanNumber,
                    PanCardNumber = dto.PanCardNumber,
                    AadharCardNumber = dto.AadharCardNumber,
                    RoleID = dto.RoleId ?? 1, // Default to Employee role
                    IsLoginEnabled = dto.IsLoginEnabled,
                    Status = dto.Status,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Employees.AddAsync(newEmployee);
                await _context.SaveChangesAsync(); // Save to get the EmployeeID

                // Create bank details if provided
                if (!string.IsNullOrEmpty(dto.BankName) && !string.IsNullOrEmpty(dto.AccountNumber))
                {
                    var bankDetails = new BankDetails
                    {
                        EmployeeID = newEmployee.EmployeeID,
                        BankName = dto.BankName,
                        AccountNumber = dto.AccountNumber,
                        IFSCCode = dto.IFSCCode ?? "",
                        AccountHolderName = dto.FullName
                    };
                    await _context.BankDetails.AddAsync(bankDetails);
                }

                // Create salary details if provided
                if (dto.AnnualCTC.HasValue && dto.AnnualCTC > 0)
                {
                    var salaryDetails = new SalaryDetails
                    {
                        EmployeeID = newEmployee.EmployeeID,
                        AnnualCTC = dto.AnnualCTC.Value,
                        BasicSalary = dto.BasicSalary ?? 0,
                        HRA = dto.HRA ?? 0,
                        PFDeduction = dto.PFDeduction ?? 0,
                        ProfessionalTax = dto.ProfessionalTax ?? 0,
                        OtherAllowances = dto.OtherAllowances ?? 0,
                        CostRate = dto.CostRate,
                        CostType = dto.CostType,
                        EffectiveFrom = dto.JoiningDate
                    };
                    await _context.SalaryDetails.AddAsync(salaryDetails);
                }

                // Create family members if provided
                if (dto.FamilyMembers != null && dto.FamilyMembers.Any())
                {
                    foreach (var familyMemberDto in dto.FamilyMembers)
                    {
                        var familyMember = new FamilyMember
                        {
                            EmployeeID = newEmployee.EmployeeID,
                            FullName = familyMemberDto.FullName,
                            Relationship = familyMemberDto.Relationship,
                            DateOfBirth = familyMemberDto.DateOfBirth,
                            Gender = familyMemberDto.Gender,
                            IsNominee = familyMemberDto.IsNominee,
                            IsDependent = familyMemberDto.IsDependent
                        };
                        await _context.FamilyMembers.AddAsync(familyMember);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Return the created employee with basic info
                var createdEmployee = new EmployeeDto(
                    newEmployee.EmployeeID,
                    newEmployee.FullName,
                    newEmployee.Email,
                    newEmployee.PhoneNumber,
                    _context.Departments.Find(newEmployee.DepartmentID)?.DepartmentName ?? "Unknown",
                    _context.Designations.Find(newEmployee.DesignationID)?.DesignationName ?? "Unknown",
                    newEmployee.DateOfJoining.ToString("yyyy-MM-dd"),
                    newEmployee.Status,
                    newEmployee.ReportingManagerID.HasValue ?
                        _context.Employees.Find(newEmployee.ReportingManagerID.Value)?.FullName : null,
                    newEmployee.PhotoPath
                );

                return CreatedAtAction(nameof(GetEmployeeById), new { id = newEmployee.EmployeeID }, createdEmployee);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = "Failed to create employee", error = ex.Message });
            }
        }

        // GET: /api/employees/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.ReportingManager)
                .Include(e => e.Role)
                .Include(e => e.BankDetails)
                .Include(e => e.SalaryDetails)
                .Include(e => e.FamilyMembers)
                .Where(e => e.EmployeeID == id)
                .FirstOrDefaultAsync();

            if (employee == null) return NotFound();

            // Create a comprehensive response object
            var response = new
            {
                // Basic employee info
                UserId = employee.EmployeeID,
                FullName = employee.FullName,
                Email = employee.Email,
                PhoneNumber = employee.PhoneNumber,
                PersonalEmail = employee.PersonalEmail,
                DateOfBirth = employee.DateOfBirth?.ToString("yyyy-MM-dd"),
                Gender = employee.Gender,
                BloodGroup = employee.BloodGroup,
                MaritalStatus = employee.MaritalStatus,
                WeddingDate = employee.WeddingDate?.ToString("yyyy-MM-dd"),

                // Address
                CurrentAddress = employee.CurrentAddress,
                PermanentAddress = employee.PermanentAddress,

                // Job Information
                Department = employee.Department.DepartmentName,
                Designation = employee.Designation.DesignationName,
                JoiningDate = employee.DateOfJoining.ToString("yyyy-MM-dd"),
                ConfirmationDate = employee.ConfirmationDate?.ToString("yyyy-MM-dd"),
                EmployeeType = employee.EmployeeType,
                WorkLocation = employee.WorkLocation,
                ManagerName = employee.ReportingManager?.FullName,

                // Government Documents
                UanNumber = employee.UanNumber,
                PanCardNumber = employee.PanCardNumber,
                AadharCardNumber = employee.AadharCardNumber,

                // System Information
                Status = employee.Status,
                IsLoginEnabled = employee.IsLoginEnabled,
                Role = employee.Role.RoleName,
                PhotoPath = employee.PhotoPath,

                // Bank Details
                BankDetails = employee.BankDetails != null ? new
                {
                    BankName = employee.BankDetails.BankName,
                    AccountNumber = employee.BankDetails.AccountNumber,
                    IFSCCode = employee.BankDetails.IFSCCode,
                    AccountHolderName = employee.BankDetails.AccountHolderName
                } : null,

                // Salary Details
                SalaryDetails = employee.SalaryDetails != null ? new
                {
                    AnnualCTC = employee.SalaryDetails.AnnualCTC,
                    BasicSalary = employee.SalaryDetails.BasicSalary,
                    HRA = employee.SalaryDetails.HRA,
                    PFDeduction = employee.SalaryDetails.PFDeduction,
                    ProfessionalTax = employee.SalaryDetails.ProfessionalTax,
                    OtherAllowances = employee.SalaryDetails.OtherAllowances,
                    CostRate = employee.SalaryDetails.CostRate,
                    CostType = employee.SalaryDetails.CostType
                } : null,

                // Family Members
                FamilyMembers = employee.FamilyMembers.Select(f => new
                {
                    Id = f.FamilyMemberID,
                    FullName = f.FullName,
                    Relationship = f.Relationship,
                    DateOfBirth = f.DateOfBirth.ToString("yyyy-MM-dd"),
                    Gender = f.Gender,
                    IsNominee = f.IsNominee,
                    IsDependent = f.IsDependent
                }).ToList()
            };

            return Ok(response);
        }

        // GET: /api/employees/departments
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.Departments
                .Select(d => new { Id = d.DepartmentID, Name = d.DepartmentName })
                .ToListAsync();

            return Ok(departments);
        }

        // GET: /api/employees/designations
        [HttpGet("designations")]
        public async Task<IActionResult> GetDesignations()
        {
            var designations = await _context.Designations
                .Select(d => new { Id = d.DesignationID, Name = d.DesignationName })
                .ToListAsync();

            return Ok(designations);
        }

        // GET: /api/employees/managers
        [HttpGet("managers")]
        public async Task<IActionResult> GetManagers()
        {
            var managers = await _context.Employees
                .Where(e => e.IsActive)
                .Select(e => new {
                    Id = e.EmployeeID,
                    Name = e.FullName,
                    Department = e.Department.DepartmentName,
                    Designation = e.Designation.DesignationName
                })
                .ToListAsync();

            return Ok(managers);
        }

        // GET: /api/employees/roles
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles
                .Select(r => new { Id = r.RoleID, Name = r.RoleName })
                .ToListAsync();

            return Ok(roles);
        }

        // ... Add PUT for update and DELETE endpoints similarly
    }
}