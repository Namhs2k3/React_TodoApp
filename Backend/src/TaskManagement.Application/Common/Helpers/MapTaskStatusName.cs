using TaskStatus = TaskManagement.Domain.Enums.TaskStatus;

namespace TaskManagement.Application.Common.Helpers
{
    public static class MapTaskStatusName
    {
        private static readonly Dictionary<TaskStatus, string> _statusNames = new()
        {
            { TaskStatus.Todo, "Todo" },
            { TaskStatus.InProgress, "In Progress" },
            { TaskStatus.Done, "Done" }
        };

        public static string ToStatusName(TaskStatus status)
            => _statusNames.TryGetValue(status, out var name) ? name : "Unknown";
    }

}
