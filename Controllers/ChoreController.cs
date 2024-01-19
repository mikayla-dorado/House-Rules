using HouseRules.Data;
using HouseRules.Models;
using HouseRules.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/[controller]")]
public class ChoreController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public ChoreController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

//this gets the chores
    [HttpGet]
    //[Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
        .Chores
        .Include(c => c.ChoreAssignments)
        .Include(c => c.ChoreCompletions)
        .Select(c => new ChoreDTO
        {
            Id = c.Id,
            Name = c.Name,
            Difficulty = c.Difficulty,
            ChoreFrequencyDays = c.ChoreFrequencyDays,
            ChoreAssignments = c.ChoreAssignments.Select(ca => new ChoreAssignmentDTO
            {
                Id = ca.Id,
                UserProfileId = ca.UserProfileId,
                ChoreId = ca.ChoreId
            }).ToList(),
            ChoreCompletions = c.ChoreCompletions.Select(cc => new ChoreCompletionDTO
            {
                Id = cc.Id,
                UserProfileId = cc.UserProfileId,
                ChoreId = cc.ChoreId,
                CompletedOn = cc.CompletedOn
            }).ToList()
        }).ToList());
    }

//this gets the chores by id
    [HttpGet("{id}")]
    //[Authorize]
    public IActionResult GetById(int id)
    {
        Chore chore = _dbContext
        .Chores
        .Include(c => c.ChoreCompletions)
        .Include(c => c.ChoreAssignments)
        .ThenInclude(ca => ca.UserProfile)
        .SingleOrDefault(c => c.Id == id);

        if (chore == null)
        {
            return NotFound();
        }
        return Ok(chore);
    }

//this posts a completed chore
    [HttpPost("{id}/complete")]
    [Authorize]
    public IActionResult CompleteChore(int id, UserProfile user)
    {
        Chore foundChore = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
        UserProfile foundUser = _dbContext.UserProfiles.FirstOrDefault(u => u.Id == id);
        if (foundChore == null || foundUser == null)
        {
            return NotFound();
        }

        ChoreCompletion completedChore = new ChoreCompletion
        {
            ChoreId = id,
            CompletedOn = DateTime.Now,
            UserProfileId = user.Id
        };

        _dbContext.ChoreCompletions.Add(completedChore);
        _dbContext.SaveChanges();
        return NoContent();
    }

    //this is to post a chore as only an admin
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult PostChore(Chore chore)
    {
        _dbContext.Chores.Add(chore);
        _dbContext.SaveChanges();
        return Created($"/chores/{chore.Id}", chore);
    }

    //this is to edit a chore as only an admin
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateChore(int id, Chore chore)
    {
        Chore choreUpdate = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
        if (choreUpdate == null)
        {
            return NotFound();
        }

        choreUpdate.Name = chore.Name;
        choreUpdate.Difficulty = chore.Difficulty;
        choreUpdate.ChoreFrequencyDays = chore.ChoreFrequencyDays;

        _dbContext.SaveChanges();
        return NoContent();
    }

    //this is to delete a chore as only an admin
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteChore(int id)
    {
        Chore choreDelete = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
        if (choreDelete == null)
        {
            return NotFound();
        }

        _dbContext.Chores.Remove(choreDelete);
        _dbContext.SaveChanges();

        return NoContent();
    }

    //this allows an admin to assign a chore to a user
    [HttpPost("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public IActionResult AssignChore (int id, int? userId)
    {
        Chore chosenChore = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
        UserProfile chosenUser = _dbContext.UserProfiles.FirstOrDefault(u => u.Id == userId);

        if(chosenChore == null || chosenUser == null)
        {
            return NotFound();
        }

        ChoreAssignment choreAssignment = new ChoreAssignment
        {
            UserProfileId = (int)userId,
            ChoreId = id
        };

        _dbContext.ChoreAssignments.Add(choreAssignment);
        _dbContext.SaveChanges();
        return NoContent();
    }

    //this allows an admin to unassign a chore to a user
    [HttpPost("{id}/unassign")]
    [Authorize(Roles = "Admin")]
    public IActionResult UnassignChore (int id, int? userId)
    {
        ChoreAssignment chosenChoreAssignment = _dbContext.ChoreAssignments
        .FirstOrDefault(c => c.ChoreId == id && c.UserProfileId == userId);

        if (chosenChoreAssignment == null)
        {
            return NotFound();
        }

        _dbContext.ChoreAssignments.Remove(chosenChoreAssignment);
        _dbContext.SaveChanges();
        return NoContent();
    }
}