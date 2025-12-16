using AutoMapper;
using FluentAssertions;
using Moq;
using TaskManagement.Application.Features.Tasks.Queries.GetTaskList;
using TaskManagement.Application.Interfaces.Repositories;
using TaskManagement.Domain.Entities;
using TaskStatus = TaskManagement.Domain.Enums.TaskStatus;
using Xunit;

namespace TaskManagement.Application.Tests.Features.Tasks.Queries;

public class GetTaskListQueryHandlerTests
{
    private readonly Mock<ITaskRepository> _repositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly GetTaskListQueryHandler _handler;

    public GetTaskListQueryHandlerTests()
    {
        _repositoryMock = new Mock<ITaskRepository>();
        _mapperMock = new Mock<IMapper>();
        _handler = new GetTaskListQueryHandler(_repositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task Handle_ReturnsListOfTaskDtos()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            new TaskItem
            {
                Id = 1,
                Title = "Task 1",
                Description = "Description 1",
                Status = TaskStatus.Todo,
                Priority = 1,
                CreatedAt = DateTime.UtcNow
            },
            new TaskItem
            {
                Id = 2,
                Title = "Task 2",
                Description = "Description 2",
                Status = TaskStatus.InProgress,
                Priority = 2,
                CreatedAt = DateTime.UtcNow
            }
        };

        var taskDtos = new List<Application.DTOs.TaskDto>
        {
            new Application.DTOs.TaskDto { Id = 1, Title = "Task 1", Status = Domain.Enums.TaskStatus.Todo },
            new Application.DTOs.TaskDto { Id = 2, Title = "Task 2", Status = Domain.Enums.TaskStatus.InProgress }
        };

        _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(tasks);
        _mapperMock.Setup(m => m.Map<List<Application.DTOs.TaskDto>>(tasks))
            .Returns(taskDtos);

        // Act
        var result = await _handler.Handle(new GetTaskListQuery(), CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result[0].StatusName.Should().Be("Todo");
        result[1].StatusName.Should().Be("In Progress");
        _repositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}

