interface SuccessNotificationProps {
  show: boolean;
}

export default function SuccessNotification({ show }: SuccessNotificationProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-lg border border-green-400/50 text-white rounded-xl p-4 shadow-2xl shadow-green-500/20 animate-in">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div>
          <p className="font-semibold">Payment successful</p>
          <p className="text-sm text-green-100">Order reference received</p>
        </div>
      </div>
    </div>
  );
}
