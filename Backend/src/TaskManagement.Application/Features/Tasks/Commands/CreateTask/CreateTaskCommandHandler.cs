using AutoMapper;
using MediatR;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces.Repositories;
using TaskManagement.Domain.Entities;
using TaskStatus = TaskManagement.Domain.Enums.TaskStatus;

namespace TaskManagement.Application.Features.Tasks.Commands.CreateTask;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, TaskDto>
{
    private readonly ITaskRepository _repository;
    private readonly IMapper _mapper;

    public CreateTaskCommandHandler(ITaskRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<TaskDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Status = TaskStatus.Todo,
            DueDate = request.DueDate,
            Priority = (int)request.Priority,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(task);
        await _repository.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<TaskDto>(task);
        dto.StatusName = "Todo";

        return dto;
    }
}

