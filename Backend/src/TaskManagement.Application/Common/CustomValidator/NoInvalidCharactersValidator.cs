using FluentValidation;
using FluentValidation.Validators;

namespace TaskManagement.Application.Common.CustomValidator
{
    public class NoInvalidCharactersValidator<T> : PropertyValidator<T, string>
    {
        private readonly char[] _invalidChars = { '!', '@', '~', '%' };

        public override string Name => "NoInvalidCharactersValidator";

        public override bool IsValid(ValidationContext<T> context, string value)
        {
            if (string.IsNullOrEmpty(value))
                return true;

            return !value.Any(c => _invalidChars.Contains(c));
        }

        protected override string GetDefaultMessageTemplate(string errorCode)
            => "The field contains invalid characters (!, @, ~, %).";
    }
}
