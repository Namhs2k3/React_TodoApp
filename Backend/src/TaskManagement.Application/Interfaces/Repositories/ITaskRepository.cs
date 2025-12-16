using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Interfaces.Repositories;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<TaskItem> AddAsync(TaskItem task);
    Task UpdateAsync(TaskItem task);
    Task DeleteAsync(TaskItem task);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

