using MediatR;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTaskById;

public class GetTaskByIdQuery : IRequest<TaskDto?>
{
    public int Id { get; set; }
}

