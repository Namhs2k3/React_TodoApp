using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Tasks.Commands.CreateTask;
using TaskManagement.Application.Features.Tasks.Commands.DeleteTask;
using TaskManagement.Application.Features.Tasks.Commands.UpdateTask;
using TaskManagement.Application.Features.Tasks.Queries.GetTaskById;
using TaskManagement.Application.Features.Tasks.Queries.GetTaskList;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskManagement.Application.DTOs.TaskDto>>> GetTasks()
    {
        var query = new GetTaskListQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskManagement.Application.DTOs.TaskDto>> GetTask(int id)
    {
        var query = new GetTaskByIdQuery { Id = id };
        var result = await _mediator.Send(query);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<TaskManagement.Application.DTOs.TaskDto>> CreateTask(CreateTaskCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetTask), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskManagement.Application.DTOs.TaskDto>> UpdateTask(int id, UpdateTaskCommand command)
    {
        if (id != command.Id)
            return BadRequest();

        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var command = new DeleteTaskCommand { Id = id };

        try
        {
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

