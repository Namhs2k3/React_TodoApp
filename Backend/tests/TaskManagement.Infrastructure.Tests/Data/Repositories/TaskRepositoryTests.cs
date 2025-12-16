using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;
using TaskStatus = TaskManagement.Domain.Enums.TaskStatus;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Infrastructure.Data.Repositories;
using Xunit;

namespace TaskManagement.Infrastructure.Tests.Data.Repositories;

public class TaskRepositoryTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly TaskRepository _repository;

    public TaskRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _repository = new TaskRepository(_context);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            new TaskItem { Id = 1, Title = "Task 1", Status = TaskStatus.Todo, Priority = 1, CreatedAt = DateTime.UtcNow },
            new TaskItem { Id = 2, Title = "Task 2", Status = TaskStatus.InProgress, Priority = 2, CreatedAt = DateTime.UtcNow }
        };

        await _context.Tasks.AddRangeAsync(tasks);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.Should().Contain(t => t.Id == 1);
        result.Should().Contain(t => t.Id == 2);
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsTask()
    {
        // Arrange
        var task = new TaskItem
        {
            Id = 1,
            Title = "Test Task",
            Status = TaskStatus.Todo,
            Priority = 1,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Tasks.AddAsync(task);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(1);
        result.Title.Should().Be("Test Task");
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        // Act
        var result = await _repository.GetByIdAsync(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task AddAsync_AddsTaskToContext()
    {
        // Arrange
        var task = new TaskItem
        {
            Title = "New Task",
            Status = TaskStatus.Todo,
            Priority = 1,
            CreatedAt = DateTime.UtcNow
        };

        // Act
        var result = await _repository.AddAsync(task);
        await _repository.SaveChangesAsync();

        // Assert
        result.Should().NotBeNull();
        var savedTask = await _context.Tasks.FindAsync(result.Id);
        savedTask.Should().NotBeNull();
        savedTask!.Title.Should().Be("New Task");
    }

    [Fact]
    public async Task UpdateAsync_UpdatesTask()
    {
        // Arrange
        var task = new TaskItem
        {
            Id = 1,
            Title = "Original Title",
            Status = TaskStatus.Todo,
            Priority = 1,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Tasks.AddAsync(task);
        await _context.SaveChangesAsync();

        task.Title = "Updated Title";
        task.Status = TaskStatus.InProgress;

        // Act
        await _repository.UpdateAsync(task);
        await _repository.SaveChangesAsync();

        // Assert
        var updatedTask = await _context.Tasks.FindAsync(1);
        updatedTask.Should().NotBeNull();
        updatedTask!.Title.Should().Be("Updated Title");
        updatedTask.Status.Should().Be(TaskStatus.InProgress);
    }

    [Fact]
    public async Task DeleteAsync_RemovesTask()
    {
        // Arrange
        var task = new TaskItem
        {
            Id = 1,
            Title = "Task to Delete",
            Status = TaskStatus.Todo,
            Priority = 1,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Tasks.AddAsync(task);
        await _context.SaveChangesAsync();

        // Act
        await _repository.DeleteAsync(task);
        await _repository.SaveChangesAsync();

        // Assert
        var deletedTask = await _context.Tasks.FindAsync(1);
        deletedTask.Should().BeNull();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}

