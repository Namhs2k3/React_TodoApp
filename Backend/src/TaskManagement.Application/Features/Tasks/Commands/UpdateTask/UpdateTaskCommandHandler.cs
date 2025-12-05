using AutoMapper;
using MediatR;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces.Repositories;
using TaskStatus = TaskManagement.Domain.Enums.TaskStatus;


namespace TaskManagement.Application.Features.Tasks.Commands.UpdateTask;

public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand, TaskDto>
{
    private readonly ITaskRepository _repository;
    private readonly IMapper _mapper;

    public UpdateTaskCommandHandler(ITaskRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<TaskDto> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            throw new KeyNotFoundException($"Task with Id {request.Id} not found");

        task.Title = request.Title;
        task.Description = request.Description;
        task.Status = (TaskStatus)request.Status;
        task.DueDate = request.DueDate;
        task.Priority = request.Priority;
        task.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(task);
        await _repository.SaveChangesAsync(cancellationToken);

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

