using Indus.Api.Data;
using Indus.Api.DTOs.Common;
using Indus.Api.DTOs.Employee;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IEmployeeDocumentRepository _documentRepository;
        private readonly DatabaseConnection _dbConnection;

        public EmployeeService(
            IEmployeeRepository employeeRepository,
            IDepartmentRepository departmentRepository,
            IEmployeeDocumentRepository documentRepository,
            DatabaseConnection dbConnection)
        {
            _employeeRepository = employeeRepository;
            _departmentRepository = departmentRepository;
            _documentRepository = documentRepository;
            _dbConnection = dbConnection;
        }

        // Basic CRUD operations
        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            return await _employeeRepository.GetAllAsync();
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int employeeId)
        {
            return await _employeeRepository.GetByIdAsync(employeeId);
        }

        public async Task<Employee?> GetEmployeeByEmailAsync(string email)
        {
            return await _employeeRepository.GetByEmailAsync(email);
        }

        public async Task<Employee> CreateEmployeeAsync(Employee employee)
        {
            return await _employeeRepository.AddAsync(employee);
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            await _employeeRepository.UpdateAsync(employee);
        }

        // Statistics - combined into single method
        public async Task<StatsDto> GetEmployeeStatsAsync()
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                int total = 0, active = 0, departments = 0, newThisMonth = 0;

                // Get total employees
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Employees", conn))
                {
                    total = (int)await cmd.ExecuteScalarAsync();
                }

                // Get active employees
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Employees WHERE IsActive = 1", conn))
                {
                    active = (int)await cmd.ExecuteScalarAsync();
                }

                // Get departments count
                departments = await _departmentRepository.CountAsync();

                // Get new this month
                using (SqlCommand cmd = new SqlCommand(
                    "SELECT COUNT(*) FROM Employees WHERE MONTH(DateOfJoining) = @Month AND YEAR(DateOfJoining) = @Year", conn))
                {
                    cmd.Parameters.AddWithValue("@Month", DateTime.UtcNow.Month);
                    cmd.Parameters.AddWithValue("@Year", DateTime.UtcNow.Year);
                    newThisMonth = (int)await cmd.ExecuteScalarAsync();
                }

                return new StatsDto(total, active, departments, newThisMonth);
            }
        }

        // DTOs-based queries (delegates to repository)
        public async Task<IEnumerable<EmployeeListItemDto>> GetEmployeesWithDetailsAsync(string? search, string? department, string? status)
        {
            return await _employeeRepository.GetEmployeesWithDetailsAsync(search, department, status);
        }

        public async Task<EmployeeDetailDto?> GetEmployeeFullProfileAsync(int employeeId)
        {
            return await _employeeRepository.GetEmployeeFullProfileAsync(employeeId);
        }

        public async Task<IEnumerable<ManagerDto>> GetManagersAsync()
        {
            return await _employeeRepository.GetManagersAsync();
        }

        /// <summary>
        /// Create employee with documents in a single transaction
        /// </summary>
        public async Task<CreateEmployeeResponseDto> CreateEmployeeWithDocumentsAsync(CreateEmployeeWithDocumentsDto dto, string uploadedBy)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                // Start transaction - if anything fails, everything will rollback
                using (SqlTransaction transaction = conn.BeginTransaction())
                {
                    try
                    {
                        // Step 1: Create Employee
                        var employee = new Employee
                        {
                            FullName = dto.FullName,
                            Email = dto.Email,
                            PasswordHash = dto.Password, // TODO: Hash this password!
                            PhoneNumber = dto.PhoneNumber,
                            PersonalEmail = dto.PersonalEmail,
                            DateOfBirth = dto.DateOfBirth,
                            Gender = dto.Gender,
                            BloodGroup = dto.BloodGroup,
                            MaritalStatus = dto.MaritalStatus,
                            WeddingDate = dto.WeddingDate,
                            FatherName = dto.FatherName,
                            EmergencyContactNumber = dto.EmergencyContactNumber,
                            EmergencyContactRelation = dto.EmergencyContactRelation,
                            CurrentAddress = dto.CurrentAddress,
                            PermanentAddress = dto.PermanentAddress,
                            DateOfJoining = dto.JoiningDate,
                            ConfirmationDate = dto.ConfirmationDate,
                            EmployeeType = dto.EmployeeType,
                            WorkLocation = dto.WorkLocation,
                            UanNumber = dto.UanNumber,
                            PanCardNumber = dto.PanCardNumber,
                            AadharCardNumber = dto.AadharCardNumber,
                            IsActive = true,
                            Status = dto.Status,
                            IsLoginEnabled = dto.IsLoginEnabled,
                            CreatedAt = DateTime.UtcNow,
                            RoleID = dto.RoleId ?? 4, // Default to Employee role
                            DepartmentID = dto.DepartmentId,
                            DesignationID = dto.DesignationId,
                            ReportingManagerID = dto.ReportingManagerId
                        };

                        // Insert Employee with transaction
                        string employeeQuery = @"
                            INSERT INTO Employees (
                                FullName, Email, PasswordHash, PhoneNumber, PersonalEmail, DateOfBirth,
                                Gender, BloodGroup, MaritalStatus, WeddingDate, FatherName,
                                EmergencyContactNumber, EmergencyContactRelation, CurrentAddress, PermanentAddress,
                                DateOfJoining, ConfirmationDate, EmployeeType, WorkLocation, UanNumber,
                                PanCardNumber, AadharCardNumber, IsActive, Status, IsLoginEnabled,
                                CreatedAt, RoleID, DepartmentID, DesignationID, ReportingManagerID
                            )
                            VALUES (
                                @FullName, @Email, @PasswordHash, @PhoneNumber, @PersonalEmail, @DateOfBirth,
                                @Gender, @BloodGroup, @MaritalStatus, @WeddingDate, @FatherName,
                                @EmergencyContactNumber, @EmergencyContactRelation, @CurrentAddress, @PermanentAddress,
                                @DateOfJoining, @ConfirmationDate, @EmployeeType, @WorkLocation, @UanNumber,
                                @PanCardNumber, @AadharCardNumber, @IsActive, @Status, @IsLoginEnabled,
                                @CreatedAt, @RoleID, @DepartmentID, @DesignationID, @ReportingManagerID
                            );
                            SELECT CAST(SCOPE_IDENTITY() AS INT);";

                        int newEmployeeId;
                        using (SqlCommand cmd = new SqlCommand(employeeQuery, conn, transaction))
                        {
                            cmd.Parameters.AddWithValue("@FullName", employee.FullName);
                            cmd.Parameters.AddWithValue("@Email", employee.Email);
                            cmd.Parameters.AddWithValue("@PasswordHash", employee.PasswordHash);
                            cmd.Parameters.AddWithValue("@PhoneNumber", (object?)employee.PhoneNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PersonalEmail", (object?)employee.PersonalEmail ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@DateOfBirth", (object?)employee.DateOfBirth ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@Gender", (object?)employee.Gender ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@BloodGroup", (object?)employee.BloodGroup ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@MaritalStatus", (object?)employee.MaritalStatus ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@WeddingDate", (object?)employee.WeddingDate ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@FatherName", (object?)employee.FatherName ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@EmergencyContactNumber", (object?)employee.EmergencyContactNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@EmergencyContactRelation", (object?)employee.EmergencyContactRelation ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@CurrentAddress", (object?)employee.CurrentAddress ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PermanentAddress", (object?)employee.PermanentAddress ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@DateOfJoining", employee.DateOfJoining);
                            cmd.Parameters.AddWithValue("@ConfirmationDate", (object?)employee.ConfirmationDate ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@EmployeeType", (object?)employee.EmployeeType ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@WorkLocation", (object?)employee.WorkLocation ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@UanNumber", (object?)employee.UanNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PanCardNumber", (object?)employee.PanCardNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@AadharCardNumber", (object?)employee.AadharCardNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@IsActive", employee.IsActive);
                            cmd.Parameters.AddWithValue("@Status", employee.Status);
                            cmd.Parameters.AddWithValue("@IsLoginEnabled", employee.IsLoginEnabled);
                            cmd.Parameters.AddWithValue("@CreatedAt", employee.CreatedAt);
                            cmd.Parameters.AddWithValue("@RoleID", employee.RoleID);
                            cmd.Parameters.AddWithValue("@DepartmentID", employee.DepartmentID);
                            cmd.Parameters.AddWithValue("@DesignationID", employee.DesignationID);
                            cmd.Parameters.AddWithValue("@ReportingManagerID", (object?)employee.ReportingManagerID ?? DBNull.Value);

                            newEmployeeId = (int)await cmd.ExecuteScalarAsync();
                        }

                        // Step 2: Add Bank Details (if provided)
                        if (!string.IsNullOrEmpty(dto.BankName))
                        {
                            string bankQuery = @"
                                INSERT INTO BankDetails (EmployeeID, BankName, AccountNumber, IFSCCode, AccountHolderName, CreatedAt)
                                VALUES (@EmployeeID, @BankName, @AccountNumber, @IFSCCode, @AccountHolderName, @CreatedAt)";

                            using (SqlCommand cmd = new SqlCommand(bankQuery, conn, transaction))
                            {
                                cmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                cmd.Parameters.AddWithValue("@BankName", dto.BankName);
                                cmd.Parameters.AddWithValue("@AccountNumber", (object?)dto.AccountNumber ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@IFSCCode", (object?)dto.IFSCCode ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@AccountHolderName", (object?)dto.FullName ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);

                                await cmd.ExecuteNonQueryAsync();
                            }
                        }

                        // Step 3: Add Salary Details (if provided)
                        if (dto.AnnualCTC.HasValue)
                        {
                            string salaryQuery = @"
                                INSERT INTO SalaryDetails (
                                    EmployeeID, AnnualCTC, BasicSalary, HRA, PFDeduction,
                                    ProfessionalTax, OtherAllowances, CostRate, CostType, EffectiveFrom, IsActive, CreatedAt
                                )
                                VALUES (
                                    @EmployeeID, @AnnualCTC, @BasicSalary, @HRA, @PFDeduction,
                                    @ProfessionalTax, @OtherAllowances, @CostRate, @CostType, @EffectiveFrom, @IsActive, @CreatedAt
                                )";

                            using (SqlCommand cmd = new SqlCommand(salaryQuery, conn, transaction))
                            {
                                cmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                cmd.Parameters.AddWithValue("@AnnualCTC", dto.AnnualCTC ?? 0);
                                cmd.Parameters.AddWithValue("@BasicSalary", dto.BasicSalary ?? 0);
                                cmd.Parameters.AddWithValue("@HRA", dto.HRA ?? 0);
                                cmd.Parameters.AddWithValue("@PFDeduction", dto.PFDeduction ?? 0);
                                cmd.Parameters.AddWithValue("@ProfessionalTax", dto.ProfessionalTax ?? 0);
                                cmd.Parameters.AddWithValue("@OtherAllowances", dto.OtherAllowances ?? 0);
                                cmd.Parameters.AddWithValue("@CostRate", (object?)dto.CostRate ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@CostType", (object?)dto.CostType ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@EffectiveFrom", dto.JoiningDate);
                                cmd.Parameters.AddWithValue("@IsActive", true);
                                cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);

                                await cmd.ExecuteNonQueryAsync();
                            }
                        }

                        // Step 4: Add Family Members (if provided)
                        if (dto.FamilyMembers != null && dto.FamilyMembers.Any())
                        {
                            string familyQuery = @"
                                INSERT INTO FamilyMembers (
                                    EmployeeID, FullName, Relationship, DateOfBirth, Gender, IsNominee, IsDependent, CreatedAt
                                )
                                VALUES (
                                    @EmployeeID, @FullName, @Relationship, @DateOfBirth, @Gender, @IsNominee, @IsDependent, @CreatedAt
                                )";

                            foreach (var member in dto.FamilyMembers)
                            {
                                using (SqlCommand cmd = new SqlCommand(familyQuery, conn, transaction))
                                {
                                    cmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                    cmd.Parameters.AddWithValue("@FullName", member.FullName);
                                    cmd.Parameters.AddWithValue("@Relationship", member.Relationship);
                                    cmd.Parameters.AddWithValue("@DateOfBirth", member.DateOfBirth);
                                    cmd.Parameters.AddWithValue("@Gender", member.Gender);
                                    cmd.Parameters.AddWithValue("@IsNominee", member.IsNominee);
                                    cmd.Parameters.AddWithValue("@IsDependent", member.IsDependent);
                                    cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);

                                    await cmd.ExecuteNonQueryAsync();
                                }
                            }
                        }

                        // Step 5: Add Documents (if provided)
                        var uploadedDocuments = new List<string>();
                        if (dto.Documents != null && dto.Documents.Any())
                        {
                            string docQuery = @"
                                INSERT INTO EmployeeDocuments (
                                    EmployeeID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt, UploadedBy
                                )
                                VALUES (
                                    @EmployeeID, @DocumentType, @FileName, @FilePath, @FileSize, @MimeType, @UploadedAt, @UploadedBy
                                )";

                            foreach (var doc in dto.Documents)
                            {
                                using (SqlCommand cmd = new SqlCommand(docQuery, conn, transaction))
                                {
                                    cmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                    cmd.Parameters.AddWithValue("@DocumentType", doc.DocumentType);
                                    cmd.Parameters.AddWithValue("@FileName", doc.FileName);
                                    cmd.Parameters.AddWithValue("@FilePath", doc.FilePath);
                                    cmd.Parameters.AddWithValue("@FileSize", (object?)doc.FileSize ?? DBNull.Value);
                                    cmd.Parameters.AddWithValue("@MimeType", (object?)doc.MimeType ?? DBNull.Value);
                                    cmd.Parameters.AddWithValue("@UploadedAt", DateTime.UtcNow);
                                    cmd.Parameters.AddWithValue("@UploadedBy", uploadedBy);

                                    await cmd.ExecuteNonQueryAsync();
                                    uploadedDocuments.Add($"{doc.DocumentType}: {doc.FileName}");
                                }
                            }
                        }

                        // ✅ Commit transaction - All or nothing!
                        transaction.Commit();

                        return new CreateEmployeeResponseDto(
                            newEmployeeId,
                            dto.FullName,
                            dto.Email,
                            "Employee created successfully with all documents",
                            uploadedDocuments
                        );
                    }
                    catch (Exception)
                    {
                        // ❌ Rollback transaction on any error
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        // ========================================
        // UPDATE EMPLOYEE
        // ========================================
        public async Task<bool> UpdateEmployeeAsync(int employeeId, UpdateEmployeeDto dto)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                // Check if employee exists
                string checkQuery = "SELECT COUNT(*) FROM Employees WHERE EmployeeID = @EmployeeID";
                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@EmployeeID", employeeId);
                    int count = (int)await checkCmd.ExecuteScalarAsync();
                    if (count == 0) return false;
                }

                // Update Employee
                string updateQuery = @"
                    UPDATE Employees
                    SET
                        FullName = @FullName,
                        PhoneNumber = @PhoneNumber,
                        PersonalEmail = @PersonalEmail,
                        DateOfBirth = @DateOfBirth,
                        Gender = @Gender,
                        BloodGroup = @BloodGroup,
                        MaritalStatus = @MaritalStatus,
                        WeddingDate = @WeddingDate,
                        FatherName = @FatherName,
                        EmergencyContactNumber = @EmergencyContactNumber,
                        EmergencyContactRelation = @EmergencyContactRelation,
                        CurrentAddress = @CurrentAddress,
                        PermanentAddress = @PermanentAddress,
                        ConfirmationDate = @ConfirmationDate,
                        EmployeeType = @EmployeeType,
                        WorkLocation = @WorkLocation,
                        UanNumber = @UanNumber,
                        PanCardNumber = @PanCardNumber,
                        AadharCardNumber = @AadharCardNumber,
                        Status = @Status,
                        DepartmentID = @DepartmentID,
                        DesignationID = @DesignationID,
                        ReportingManagerID = @ReportingManagerID,
                        UpdatedAt = @UpdatedAt
                    WHERE EmployeeID = @EmployeeID";

                using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeID", employeeId);
                    cmd.Parameters.AddWithValue("@FullName", dto.FullName);
                    cmd.Parameters.AddWithValue("@PhoneNumber", (object?)dto.PhoneNumber ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@PersonalEmail", (object?)dto.PersonalEmail ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DateOfBirth", (object?)dto.DateOfBirth ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Gender", (object?)dto.Gender ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@BloodGroup", (object?)dto.BloodGroup ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@MaritalStatus", (object?)dto.MaritalStatus ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@WeddingDate", (object?)dto.WeddingDate ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@FatherName", (object?)dto.FatherName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@EmergencyContactNumber", (object?)dto.EmergencyContactNumber ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@EmergencyContactRelation", (object?)dto.EmergencyContactRelation ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@CurrentAddress", (object?)dto.CurrentAddress ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@PermanentAddress", (object?)dto.PermanentAddress ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ConfirmationDate", (object?)dto.ConfirmationDate ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@EmployeeType", (object?)dto.EmployeeType ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@WorkLocation", (object?)dto.WorkLocation ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@UanNumber", (object?)dto.UanNumber ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@PanCardNumber", (object?)dto.PanCardNumber ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@AadharCardNumber", (object?)dto.AadharCardNumber ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Status", dto.Status);
                    cmd.Parameters.AddWithValue("@DepartmentID", dto.DepartmentId);
                    cmd.Parameters.AddWithValue("@DesignationID", dto.DesignationId);
                    cmd.Parameters.AddWithValue("@ReportingManagerID", (object?)dto.ReportingManagerId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

                    await cmd.ExecuteNonQueryAsync();
                }

                return true;
            }
        }

        // ========================================
        // DELETE EMPLOYEE (Soft Delete)
        // ========================================
        public async Task<bool> DeleteEmployeeAsync(int employeeId)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                // Soft delete: Set status to Inactive and IsActive to false
                string deleteQuery = @"
                    UPDATE Employees
                    SET
                        Status = 'Inactive',
                        IsActive = 0,
                        UpdatedAt = @UpdatedAt
                    WHERE EmployeeID = @EmployeeID";

                using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeID", employeeId);
                    cmd.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }
    }
}
