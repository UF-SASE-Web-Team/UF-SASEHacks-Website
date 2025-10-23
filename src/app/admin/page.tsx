import { fetchAdminRows } from "./actions";
import AdminTable from "@/components/admin/AdminTable";
import DownloadAllResumes from "@/components/admin/DownloadAllResumes";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const { q, status } = sp ?? {};
  const res = await fetchAdminRows({ q, status });

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Admin Console</h1>

      <div className="mt-4 rounded-xl border p-4">
        <form className="flex flex-col sm:flex-row gap-3">
          <input
            name="q"
            placeholder="Search name or email"
            defaultValue={q ?? ""}
            className="rounded-md border px-3 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlist">Waitlist</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="rounded-md border px-3 py-2 text-sm bg-black text-white border-black">
            Apply
          </button>
        </form>
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href="/api/export"
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border bg-white hover:bg-gray-50 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          Export CSV
        </a>
        <DownloadAllResumes />
      </div>

      <div className="mt-6">
        {res.ok ? (
          <AdminTable rows={res.rows ?? []} />
        ) : (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {res.error ?? "Failed to load"}
          </div>
        )}
      </div>
    </div>
  );
}
