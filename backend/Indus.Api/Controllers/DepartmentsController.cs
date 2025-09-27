using Indus.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Indus.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly IndusDbContext _context;
        public DepartmentsController(IndusDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.Departments
                .Select(d => new { id = d.DepartmentID, name = d.DepartmentName })
                .ToListAsync();
            return Ok(departments);
        }
    }
}
