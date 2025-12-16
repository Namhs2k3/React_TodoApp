using AutoMapper;
using MediatR;
using TaskManagement.Application.Common.Helpers;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces.Repositories;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTaskList;

public class GetTaskListQueryHandler : IRequestHandler<GetTaskListQuery, List<TaskDto>>
{
    private readonly ITaskRepository _repository;
    private readonly IMapper _mapper;

    public GetTaskListQueryHandler(ITaskRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<TaskDto>> Handle(GetTaskListQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _repository.GetAllAsync(cancellationToken);
        var taskDtos = _mapper.Map<List<TaskDto>>(tasks);

        // Map status name
        foreach (var dto in taskDtos)
        {
            dto.StatusName = MapTaskStatusName.ToStatusName(dto.Status);
        }

        return taskDtos.OrderBy(x => x.Id).ToList();
    }
}

