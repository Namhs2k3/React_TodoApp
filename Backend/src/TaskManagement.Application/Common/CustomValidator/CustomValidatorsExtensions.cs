using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Application.Common.CustomValidator
{
    public static class CustomValidatorsExtensions
    {
        public static IRuleBuilderOptions<T, string> NoInvalidCharacters<T>(
            this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.SetValidator(new NoInvalidCharactersValidator<T>());
        }
    }

}
