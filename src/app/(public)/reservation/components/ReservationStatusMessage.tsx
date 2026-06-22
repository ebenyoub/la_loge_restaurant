interface ReservationStatusMessageProps {
  successMessage: string | null;
  globalError?: string;
}

export function ReservationStatusMessage({ successMessage, globalError }: ReservationStatusMessageProps) {
  return (
    <>
      {successMessage && (
        <div className="p-6 mb-10 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-center rounded-sm">
          <svg className="w-10 h-10 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-body font-medium tracking-[-0.02em] text-2xl text-[#f0e8d8] mb-3">Demande envoyée</h2>
          <p className="text-sm font-body font-light leading-relaxed max-w-sm mx-auto">
            {successMessage}
          </p>
        </div>
      )}

      {globalError && (
        <div className="p-4 mb-6 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
          {globalError}
        </div>
      )}
    </>
  );
}
