using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HouseRules.Data;
using HouseRules.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using HouseRules.Models;

namespace HouseRules.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public UserProfileController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
            .UserProfiles
            .Include(up => up.IdentityUser)
            .Select(up => new UserProfileDTO
            {
                Id = up.Id,
                FirstName = up.FirstName,
                LastName = up.LastName,
                Address = up.Address,
                IdentityUserId = up.IdentityUserId,
                Email = up.IdentityUser.Email,
                UserName = up.IdentityUser.UserName
            })
            .ToList());
    }

    [HttpGet("withroles")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetWithRoles()
    {
        return Ok(_dbContext.UserProfiles
        .Include(up => up.IdentityUser)
        .Select(up => new UserProfileDTO
        {
            Id = up.Id,
            FirstName = up.FirstName,
            LastName = up.LastName,
            Address = up.Address,
            Email = up.IdentityUser.Email,
            UserName = up.IdentityUser.UserName,
            IdentityUserId = up.IdentityUserId,
            Roles = _dbContext.UserRoles
            .Where(ur => ur.UserId == up.IdentityUserId)
            .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name)
            .ToList()
        }));
    }

    [HttpPost("promote/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Promote(string id)
    {
        IdentityRole role = _dbContext.Roles.SingleOrDefault(r => r.Name == "Admin");
        // This will create a new row in the many-to-many UserRoles table.
        _dbContext.UserRoles.Add(new IdentityUserRole<string>
        {
            RoleId = role.Id,
            UserId = id
        });
        _dbContext.SaveChanges();
        return NoContent();
    }

    [HttpPost("demote/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Demote(string id)
    {
        IdentityRole role = _dbContext.Roles
            .SingleOrDefault(r => r.Name == "Admin");
        IdentityUserRole<string> userRole = _dbContext
            .UserRoles
            .SingleOrDefault(ur =>
                ur.RoleId == role.Id &&
                ur.UserId == id);

        _dbContext.UserRoles.Remove(userRole);
        _dbContext.SaveChanges();
        return NoContent();
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetUserProfilesById(int id)
    {
        UserProfile foundUserProfiles = _dbContext
        .UserProfiles
        .Include(p => p.IdentityUser)
        .Include(p => p.ChoreAssignments)
        .ThenInclude(ca => ca.Chore)
        .Include(p => p.ChoreCompletions)
        .ThenInclude(cc => cc.Chore)
        .SingleOrDefault(up => up.Id == id);

        if (foundUserProfiles == null)
        {
            return NotFound();
        }

        return Ok(new UserProfileDTO
        {
            Id = foundUserProfiles.Id,
            FirstName = foundUserProfiles.FirstName,
            LastName = foundUserProfiles.LastName,
            Address = foundUserProfiles.Address,
            Email = foundUserProfiles.IdentityUser.Email,
            UserName = foundUserProfiles.IdentityUser.UserName,
            ChoreAssignments = foundUserProfiles.ChoreAssignments.Select(ca => new ChoreAssignmentDTO
            {
                Id = ca.Id,
                UserProfileId = ca.UserProfileId,
                ChoreId = ca.ChoreId,
                Chore = new ChoreDTO
                {
                    Id = ca.Chore.Id,
                    Name = ca.Chore.Name,
                    Difficulty = ca.Chore.Difficulty,
                    ChoreFrequencyDays = ca.Chore.ChoreFrequencyDays
                } 
            }).ToList(),
            ChoreCompletions = foundUserProfiles.ChoreCompletions.Select(cc => new ChoreCompletionDTO
            {
                Id = cc.Id,
                UserProfileId = cc.UserProfileId,
                ChoreId = cc.ChoreId,
                CompletedOn = cc.CompletedOn,
                Chore = new ChoreDTO
                {
                    Id = cc.Chore.Id,
                    Name = cc.Chore.Name,
                    Difficulty = cc.Chore.Difficulty,
                    ChoreFrequencyDays = cc.Chore.ChoreFrequencyDays
                }
            }).ToList()
        });
    }

}