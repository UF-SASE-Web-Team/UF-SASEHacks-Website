import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSignedResumeUrl, uploadResume } from "./actions";
import ResumeUploader from "@/components/resume/ResumeUploader";

export default async function ResumePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: reg } = await supabase
    .from("registrations")
    .select("editing_locked, resume_url, resume_updated_at")
    .eq("user_id", user?.id ?? "")
    .single();

  const locked = reg?.editing_locked ?? false;
  const hasResume = !!reg?.resume_url;
  const signed = await getSignedResumeUrl();

  return (
    <div className="mx-auto max-w-screen-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Resume</h1>

      {!hasResume && (
        <div className="mt-4 rounded-md border border-blue-300 bg-blue-50 p-3 text-sm">
          <strong>Resume upload is required</strong> to complete your registration. Please upload your resume below.
        </div>
      )}

      {locked && (
        <div className="mt-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm">
          Editing is locked by admins. You can still download the last uploaded resume.
        </div>
      )}

      <div className="mt-6 rounded-xl border p-4 space-y-3">
        <div className="text-sm">
          {hasResume ? (
            <>
              <div>Current file: <span className="font-medium">resume.pdf</span></div>
              {reg?.resume_updated_at && (
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(reg.resume_updated_at).toLocaleString()}
                </div>
              )}
            </>
          ) : (
            <div>No resume uploaded yet.</div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {signed.url ? (
            <a
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border hover:bg-gray-50"
              href={signed.url}
              target="_blank"
              rel="noreferrer"
            >
              {hasResume ? "Preview / Download" : "Preview"}
            </a>
          ) : (
            <span className="text-sm text-gray-500">No preview available.</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <ResumeUploader action={uploadResume} disabled={locked} />
      </div>

      <p className="mt-3 text-xs text-gray-500">
        PDFs only, max 10 MB. Your file is stored privately at <code>resumes/{user?.id}/resume.pdf</code>.
      </p>
    </div>
  );
}
