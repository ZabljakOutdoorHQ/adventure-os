import { AgendaList } from "@/components/calendar/agenda-list";
import { MonthGrid } from "@/components/calendar/month-grid";
import { SectionHeader } from "@/components/demo/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        description="Tours, meetings and deadlines connected to the work they relate to. Demo data only — this does not read from Google Calendar."
        eyebrow="Calendar"
        title="Calendar"
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardContent className="p-6">
            <MonthGrid />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Agenda</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <AgendaList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
