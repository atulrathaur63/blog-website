/**
 * LoadingSpinner
 * Centered spinner with optional message.
 */
const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      {/* Animated ink-drop spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-ink-100" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-ink-900 animate-spin" />
      </div>
      {message && (
        <p className="text-sm text-ink-500 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
