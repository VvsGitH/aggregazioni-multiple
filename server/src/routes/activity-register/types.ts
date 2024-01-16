export interface IRegisteredActivity {
  id: number;
  project: { id: number; name: string } | null;
  employee: { id: number; name: string } | null;
  date: string | null; // ISO
  hours: number;
}
