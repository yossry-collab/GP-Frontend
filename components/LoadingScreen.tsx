type LoadingScreenProps = {
  className?: string;
};

export default function LoadingScreen({ className = "" }: LoadingScreenProps) {
  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center ${className}`.trim()}
    >
      <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
