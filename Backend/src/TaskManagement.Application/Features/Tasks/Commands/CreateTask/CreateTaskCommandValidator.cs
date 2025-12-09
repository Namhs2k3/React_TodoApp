using FluentValidation;
using TaskManagement.Application.Common.CustomValidator;

namespace TaskManagement.Application.Features.Tasks.Commands.CreateTask;

public class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    public CreateTaskCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .NoInvalidCharacters().WithMessage("Title cannot contain !, @, ~, %")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .NoInvalidCharacters().WithMessage("Description cannot contain !, @, ~, %")
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => (int)x.Priority)
            .InclusiveBetween(1, 3).WithMessage("Priority must be between 1 and 3");
    }
}

