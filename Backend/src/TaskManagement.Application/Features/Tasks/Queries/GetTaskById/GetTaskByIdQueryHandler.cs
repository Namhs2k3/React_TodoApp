using AutoMapper;
using MediatR;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces.Repositories;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTaskById;

public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, TaskDto?>
{
    private readonly ITaskRepository _repository;
    private readonly IMapper _mapper;

    public GetTaskByIdQueryHandler(ITaskRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<TaskDto?> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            return null;

        var dto = _mapper.Map<TaskDto>(task);
        dto.StatusName = dto.Status switch
        {
            1 => "Todo",
            2 => "In Progress",
            3 => "Done",
            _ => "Unknown"
        };

        return dto;
    }
}

