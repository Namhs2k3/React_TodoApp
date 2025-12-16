using FluentValidation;
using TaskManagement.Application.Common.CustomValidator;

namespace TaskManagement.Application.Features.Tasks.Commands.UpdateTask;

public class UpdateTaskCommandValidator : AbstractValidator<UpdateTaskCommand>
{
    public UpdateTaskCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .NoInvalidCharacters().WithMessage("Title cannot contain !, @, ~, %")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .NoInvalidCharacters().WithMessage("Description cannot contain !, @, ~, %")
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => (int)x.Status)
            .InclusiveBetween(1, 3).WithMessage("Status must be between 1 and 3");

        RuleFor(x => (int)x.Priority)
            .InclusiveBetween(1, 3).WithMessage("Priority must be between 1 and 3");
    }
}

