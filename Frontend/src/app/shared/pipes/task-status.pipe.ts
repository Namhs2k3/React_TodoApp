import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "taskStatus",
  standalone: true,
})
export class TaskStatusPipe implements PipeTransform {
  transform(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: "Todo",
      2: "In Progress",
      3: "Done",
    };
    return statusMap[status] || "Unknown";
  }
}
