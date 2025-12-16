using AutoMapper;
using FluentAssertions;
using Moq;
using TaskManagement.Application.Features.Tasks.Commands.UpdateTask;
using TaskManagement.Application.Interfaces.Repositories;
using TaskManagement.Domain.Entities;
using TaskStatus = TaskManagement.Domain.Enums.TaskStatus;
using Xunit;
using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.Tests.Features.Tasks.Commands;

public class UpdateTaskCommandHandlerTests
{
    private readonly Mock<ITaskRepository> _repositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly UpdateTaskCommandHandler _handler;

    public UpdateTaskCommandHandlerTests()
    {
        _repositoryMock = new Mock<ITaskRepository>();
        _mapperMock = new Mock<IMapper>();
        _handler = new UpdateTaskCommandHandler(_repositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_UpdatesTaskAndReturnsDto()
    {
        // Arrange
        var existingTask = new TaskItem
        {
            Id = 1,
            Title = "Old Title",
            Description = "Old Description",
            Status = TaskStatus.Todo,
            Priority = 1,
            CreatedAt = DateTime.UtcNow.AddDays(-5)
        };

        var command = new UpdateTaskCommand
        {
            Id = 1,
            Title = "Updated Title",
            Description = "Updated Description",
            Status = TaskStatus.InProgress,
            Priority = TaskPriority.Medium,
            DueDate = DateTime.UtcNow.AddDays(5)
        };

        var taskDto = new Application.DTOs.TaskDto
        {
            Id = 1,
            Title = command.Title,
            Description = command.Description,
            Status = command.Status,
            StatusName = "In Progress",
            Priority = command.Priority,
            DueDate = command.DueDate
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingTask);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<TaskItem>()))
            .Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
        _mapperMock.Setup(m => m.Map<Application.DTOs.TaskDto>(It.IsAny<TaskItem>()))
            .Returns(taskDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be(command.Title);
        result.Description.Should().Be(command.Description);
        result.Status.Should().Be(TaskStatus.InProgress);
        existingTask.Status.Should().Be(TaskStatus.InProgress);
        existingTask.UpdatedAt.Should().NotBeNull();
        _repositoryMock.Verify(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TaskItem>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_TaskNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var command = new UpdateTaskCommand { Id = 999 };

        _repositoryMock.Setup(r => r.GetByIdAsync(999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskItem?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.Handle(command, CancellationToken.None));
    }
}

