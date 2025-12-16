using MediatR;
using TaskManagement.Application.Interfaces.Repositories;

namespace TaskManagement.Application.Features.Tasks.Commands.DeleteTask;

public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand, Unit>
{
    private readonly ITaskRepository _repository;

    public DeleteTaskCommandHandler(ITaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            throw new KeyNotFoundException($"Task with Id {request.Id} not found");

        await _repository.DeleteAsync(task);
        await _repository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

