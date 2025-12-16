using MediatR;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTaskList;

public class GetTaskListQuery : IRequest<List<TaskDto>>
{
}

