using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Application = TaskManagement.Application;
using TaskManagement.Application.Common.Mappings;
using TaskManagement.Application.Common.Behaviors;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Infrastructure.Data.Repositories;
using TaskManagement.Application.Interfaces.Repositories;
using Domain = TaskManagement.Domain;
using FluentValidation;
using MediatR;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("TaskManagementDb"));

// FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(Application.Features.Tasks.Queries.GetTaskList.GetTaskListQueryHandler).Assembly);

// MediatR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Application.Features.Tasks.Queries.GetTaskList.GetTaskListQueryHandler).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Repositories
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Seed data for demo
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    SeedData(context);
}

app.Run();

static void SeedData(ApplicationDbContext context)
{
    if (!context.Tasks.Any())
    {
        context.Tasks.AddRange(
            new Domain.Entities.TaskItem
            {
                Id = 1,
                Title = "Complete project documentation",
                Description = "Write comprehensive documentation for the project",
                Status = Domain.Enums.TaskStatus.InProgress,
                DueDate = DateTime.UtcNow.AddDays(3),
                Priority = 2,
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Domain.Entities.TaskItem
            {
                Id = 2,
                Title = "Review code changes",
                Description = "Review and approve pull requests",
                Status = Domain.Enums.TaskStatus.Todo,
                DueDate = DateTime.UtcNow.AddDays(1),
                Priority = 3,
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new Domain.Entities.TaskItem
            {
                Id = 3,
                Title = "Deploy to production",
                Description = "Deploy the latest version to production environment",
                Status = Domain.Enums.TaskStatus.Done,
                DueDate = DateTime.UtcNow.AddDays(-1),
                Priority = 1,
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            }
        );
        context.SaveChanges();
    }
}

