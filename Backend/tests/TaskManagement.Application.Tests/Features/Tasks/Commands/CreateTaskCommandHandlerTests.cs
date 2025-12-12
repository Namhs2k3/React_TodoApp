using AutoMapper;
using FluentAssertions;
using Moq;
using TaskManagement.Application.Features.Tasks.Commands.CreateTask;
using TaskManagement.Application.Interfaces.Repositories;
using TaskManagement.Domain.Enums;
using Xunit;

namespace TaskManagement.Application.Tests.Features.Tasks.Commands;

public class CreateTaskCommandHandlerTests
{
    private readonly Mock<ITaskRepository> _repositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly CreateTaskCommandHandler _handler;

    public CreateTaskCommandHandlerTests()
    {
        _repositoryMock = new Mock<ITaskRepository>();
        _mapperMock = new Mock<IMapper>();
        _handler = new CreateTaskCommandHandler(_repositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsTaskDto()
    {
        // Arrange
        var command = new CreateTaskCommand
        {
            Title = "Test Task",
            Description = "Test Description",
            Priority = TaskPriority.Low,
            DueDate = DateTime.UtcNow.AddDays(7)
        };

        var task = new Domain.Entities.TaskItem
        {
            Id = 1,
            Title = command.Title,
            Description = command.Description,
            Status = Domain.Enums.TaskStatus.Todo,
            Priority = (int)command.Priority,
            DueDate = command.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        var taskDto = new Application.DTOs.TaskDto
        {
            Id = 1,
            Title = command.Title,
            Description = command.Description,
            Status = Domain.Enums.TaskStatus.Todo,
            StatusName = "Todo",
            Priority = command.Priority,
            DueDate = command.DueDate
        };

        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Domain.Entities.TaskItem>()))
            .ReturnsAsync(task);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
        _mapperMock.Setup(m => m.Map<Application.DTOs.TaskDto>(It.IsAny<Domain.Entities.TaskItem>()))
            .Returns(taskDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be(command.Title);
        result.Description.Should().Be(command.Description);
        result.Status.Should().Be(Domain.Enums.TaskStatus.Todo); // Todo
        result.StatusName.Should().Be("Todo");
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Domain.Entities.TaskItem>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}

