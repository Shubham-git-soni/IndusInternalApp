using Indus.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Indus.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesignationsController : ControllerBase
    {
        private readonly IndusDbContext _context;

        public DesignationsController(IndusDbContext context)
        {
            _context = context;
        }

        // GET: /api/designations
        /// <summary>
        /// Gets a list of all designations for use in UI dropdowns.
        /// </summary>
        /// <returns>A list of designation objects with id and name.</returns>
        [HttpGet]
        public async Task<IActionResult> GetDesignations()
        {
            var designations = await _context.Designations
                .Select(d => new { id = d.DesignationID, name = d.DesignationName })
                .ToListAsync();

            return Ok(designations);
        }
    }
}