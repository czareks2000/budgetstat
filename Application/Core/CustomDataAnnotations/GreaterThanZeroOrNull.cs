using System.ComponentModel.DataAnnotations;

namespace Application.Core.CustomDataAnnotations
{
    public class GreaterThanZeroOrNull : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null)
                return true;

            if (value is decimal decimalValue)
            {
                return decimalValue > 0;
            }

            if (value is double doubleValue)
            {
                return doubleValue > 0;
            }

            if (value is float floatValue)
            {
                return floatValue > 0;
            }

            if (value is int intValue)
            {
                return intValue > 0;
            }

            return false;
        }
    }
}
